import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Field caps ───────────────────────────────────────────────────────────────
// Mirrors src/lib/inputValidation.js on the client. The client cap is UX only;
// this is the real gate, since the client can be bypassed entirely by anyone
// calling this function directly.
const FIELD_LIMITS = {
  geo: 100,
  name: 60,
  client: 600,
  challenge: 600,
  customNiche: 120,
  niche: 250,   // nicheBase + " — " + customNiche, composed client-side
  years: 60,
  llm: 60,
};

// ── Sanitization ─────────────────────────────────────────────────────────────

function stripControlChars(value) {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

function sanitizeField(value, maxLen) {
  const cleaned = stripControlChars(value);
  return typeof maxLen === 'number' ? cleaned.slice(0, maxLen) : cleaned;
}

function isBlank(value) {
  return typeof value !== 'string' || !value.trim();
}

// Phrases that have no legitimate reason to appear in a niche/market/client
// description and are the standard shape of a prompt-injection attempt.
// Applied to the fully-assembled prompt text (not just the raw form fields)
// because the client bakes formData directly into basePrompts before this
// function ever sees it -- stripping only the raw fields would miss anything
// already interpolated into the prompt string by the time it arrives here.
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(the\s+)?(previous|prior|above)\s+instructions?/gi,
  /disregard\s+(all\s+)?(the\s+)?(previous|prior|above)/gi,
  /forget\s+(all\s+)?(your\s+)?(previous|prior)\s+instructions?/gi,
  /system\s*prompt/gi,
  /you\s+are\s+now\s+/gi,
  /new\s+instructions?\s*:/gi,
  /^\s*(system|assistant|human)\s*:/gim,
];

function stripInjectionAttempts(text) {
  if (typeof text !== 'string') return { text: '', hits: 0 };
  let hits = 0;
  let cleaned = text;
  for (const pattern of INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, (m) => { hits++; return '[removed]'; });
  }
  return { text: cleaned, hits };
}

// ── Pre-flight coherence check ────────────────────────────────────────────────
// One cheap Haiku call before any of the seven phases run. Catches the "typed
// idk into everything" case with a specific, actionable message instead of
// generating a full vague report and letting the agent conclude the product
// doesn't work. Fails OPEN: if the check itself errors out, we proceed rather
// than block a real signup on a broken checker.

async function preflightCoherenceCheck(apiKey, formData) {
  const checkPrompt = `An agent submitted this to a referral partner planning tool:
Niche: ${formData.niche || ''} | Market: ${formData.geo || ''} | Ideal client: ${formData.client || '(not provided)'} | Challenge: ${formData.challenge || ''}

Is there enough real information here to build a useful, specific plan? A market and a niche are required. A vague or placeholder-looking market (e.g. "idk", "usa", "n/a") should be treated as insufficient.
Answer JSON only, no commentary: {"sufficient": true|false, "missing": ["..."], "note": "one sentence"}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        thinking: { type: 'disabled' },
        messages: [{ role: 'user', content: checkPrompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn('[startGenerationJob] Preflight check API error, failing open:', response.status);
      return { ok: true };
    }

    const data = await response.json();
    const textBlock = Array.isArray(data.content) ? data.content.find(b => b?.type === 'text') : null;
    if (!textBlock?.text) return { ok: true };

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { ok: true };

    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.sufficient === false) {
      return { ok: false, missing: parsed.missing || [], note: parsed.note || '' };
    }
    return { ok: true };

  } catch (err) {
    console.warn('[startGenerationJob] Preflight check failed, failing open:', err.message);
    return { ok: true };
  }
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
// No account system exists yet, so this is IP-based and deliberately simple.
// Fails OPEN if the IP can't be determined -- an unreliable proxy header
// should not take the whole funnel down.

const RATE_LIMIT_PER_HOUR = 5;
const RATE_LIMIT_PER_DAY = 20;

function getClientIp(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0].trim();
    if (first) return first;
  }
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const xri = req.headers.get('x-real-ip');
  if (xri) return xri.trim();
  return null;
}

async function checkRateLimit(base44, ip) {
  if (!ip) {
    console.warn('[startGenerationJob] No client IP found on request, skipping rate limit check');
    return { ok: true };
  }

  const recent = await base44.asServiceRole.entities.GenerationJob.filter(
    { clientIp: ip }, '-created_date', 50
  );

  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const dayAgo = now - 24 * 60 * 60 * 1000;

  let lastHour = 0;
  let lastDay = 0;
  for (const rec of recent) {
    const t = new Date(rec.created_date).getTime();
    if (Number.isNaN(t)) continue;
    if (t >= dayAgo) lastDay++;
    if (t >= hourAgo) lastHour++;
  }

  if (lastHour >= RATE_LIMIT_PER_HOUR) {
    return { ok: false, message: 'You have reached the hourly limit for blueprint generation. Please try again in a bit.' };
  }
  if (lastDay >= RATE_LIMIT_PER_DAY) {
    return { ok: false, message: 'You have reached today\'s limit for blueprint generation. Please try again tomorrow.' };
  }
  return { ok: true };
}

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { formData, basePrompts, userEmail } = body;

    // ── Basic shape validation ────────────────────────────────────────────────
    if (!formData || typeof formData !== 'object') {
      return Response.json({ error: 'Missing or invalid formData' }, { status: 400 });
    }
    if (!Array.isArray(basePrompts) || basePrompts.length !== 7) {
      return Response.json({ error: 'basePrompts must be an array with exactly 7 items' }, { status: 400 });
    }

    // ── Required fields, re-checked server-side ───────────────────────────────
    if (isBlank(formData.name) || isBlank(formData.geo) || isBlank(formData.niche) || isBlank(formData.challenge) || isBlank(formData.years)) {
      return Response.json({ error: 'Name, market, niche, referral challenge, and years of experience are all required.' }, { status: 400 });
    }

    // ── Sanitize + re-cap every field server-side ─────────────────────────────
    // Never trust the client cap -- this function can be called directly.
    const cleanFormData = {
      ...formData,
      name: sanitizeField(formData.name, FIELD_LIMITS.name),
      geo: sanitizeField(formData.geo, FIELD_LIMITS.geo),
      niche: sanitizeField(formData.niche, FIELD_LIMITS.niche),
      nicheBase: sanitizeField(formData.nicheBase, FIELD_LIMITS.niche),
      client: sanitizeField(formData.client || '', FIELD_LIMITS.client),
      challenge: sanitizeField(formData.challenge, FIELD_LIMITS.challenge),
      years: sanitizeField(formData.years || '', FIELD_LIMITS.years),
      llm: sanitizeField(formData.llm || '', FIELD_LIMITS.llm),
    };

    // ── Strip prompt-injection-shaped phrases from the assembled prompts ──────
    // basePrompts already has formData baked in by the client's promptBuilder,
    // so this runs on the full prompt text rather than only the raw fields.
    let totalInjectionHits = 0;
    const cleanBasePrompts = basePrompts.map(p => {
      const { text, hits } = stripInjectionAttempts(p?.prompt || '');
      totalInjectionHits += hits;
      return { ...p, prompt: text };
    });
    if (totalInjectionHits > 0) {
      console.warn(`[startGenerationJob] Stripped ${totalInjectionHits} instruction-shaped phrase(s) from submitted prompts`);
    }

    const base44 = createClientFromRequest(req);
    const clientIp = getClientIp(req);

    // ── Rate limit ──────────────────────────────────────────────────────────
    const rateLimitResult = await checkRateLimit(base44, clientIp);
    if (!rateLimitResult.ok) {
      return Response.json({ error: rateLimitResult.message }, { status: 429 });
    }

    // ── Pre-flight coherence check ─────────────────────────────────────────
    const apiKey = Deno.env.get('CLAUDE_THINGY');
    if (apiKey) {
      const preflight = await preflightCoherenceCheck(apiKey, cleanFormData);
      if (!preflight.ok) {
        const missingText = (preflight.missing || []).length ? ` Missing: ${preflight.missing.join(', ')}.` : '';
        return Response.json({
          error: `${preflight.note || 'A bit more detail would help build a useful plan.'}${missingText}`,
          insufficient: true,
        }, { status: 422 });
      }
    }

    // ── Create the job record ─────────────────────────────────────────────────
    const newJob = await base44.asServiceRole.entities.GenerationJob.create({
      formData: cleanFormData,
      basePrompts: cleanBasePrompts,
      userEmail: sanitizeField((userEmail || '').trim(), 320),
      clientIp: clientIp || '',
      status: 'queued',
      currentPhase: 0,
      phaseResults: {},
    });

    console.log(`[startGenerationJob] Created job ${newJob.id} for ${cleanFormData.name || 'unknown'}`);

    // ── Fire-and-forget: trigger Phase 1 ──────────────────────────────────────
    // Trigger Phase 1 via SDK (no await -- fire and forget)
    base44.functions.invoke('runGenerationPhase', { jobId: newJob.id, phaseId: 1 })
      .catch(err => console.error('[startGenerationJob] Phase 1 trigger failed:', err));

    // Brief delay to let the request initiate before isolate shuts down
    await new Promise(r => setTimeout(r, 500));

    return Response.json({ success: true, jobId: newJob.id });

  } catch (error) {
    console.error('[startGenerationJob] Exception:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
