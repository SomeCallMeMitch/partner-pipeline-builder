import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Per-Phase Model Config ──────────────────────────────────────────────────
// Phase 3 sets the Dream 5 that every later phase is locked to, so it gets a
// stronger model than the other analysis phases -- a bad Dream 5 poisons the
// whole report. Phases 4 and 6 produce the copy the agent actually sends, so
// they stay on Sonnet too. Phases 1, 2, 5, 7 are structured extraction and
// table-filling, which Haiku does well at a fifth of the cost.
//
// disableThinking: Sonnet 5 (and other current-generation models) think by
// default even when no thinking param is sent -- confirmed by a real failure
// where a 4000-token budget was entirely consumed by an invisible reasoning
// pass, leaving zero tokens for the actual report and killing the run with
// stop_reason max_tokens. These phases produce structured tables and copy,
// not novel reasoning, so thinking is turned off explicitly rather than left
// to model default. This also keeps cost predictable -- thinking tokens bill
// as output tokens at the same rate.
const PHASE_MODEL_CONFIG = {
  1: { model: 'claude-haiku-4-5-20251001', max_tokens: 4000 },
  2: { model: 'claude-haiku-4-5-20251001', max_tokens: 6000 },
  3: { model: 'claude-sonnet-5',           max_tokens: 8000,  disableThinking: true },
  4: { model: 'claude-sonnet-5',           max_tokens: 14000, disableThinking: true },
  5: { model: 'claude-haiku-4-5-20251001', max_tokens: 4000 },
  6: { model: 'claude-sonnet-5',           max_tokens: 9000,  disableThinking: true },
  7: { model: 'claude-haiku-4-5-20251001', max_tokens: 12000 },
};

const DEFAULT_MODEL_CONFIG = { model: 'claude-haiku-4-5-20251001', max_tokens: 4000 };

// ── Static content ──────────────────────────────────────────────────────────────
// This content is byte-identical in every report, so it is written once here
// and appended directly after generation instead of being written by the
// model on every run. Zero extra tokens, zero extra seconds, and it can
// never drift or get reworded phase to phase. The matching instruction to
// generate this content has been removed from the corresponding prompt in
// promptBuilder.jsx -- if you change the wording here, the prompt does not
// need to change, and vice versa these two files should be kept in sync.

const TIER_DEFINITIONS_BLOCK = `

---

### Tier Definitions

- **Tier 1 -- Direct Upstream:** sees the client immediately before a transaction trigger. Highest priority, fastest referral cycle.
- **Tier 2 -- Lifestyle & Transition:** sees the client during a life-phase shift that precedes the transaction by months. Slower cycle, still direct.
- **Tier 3 -- Community & Maintenance:** longer-term contact with slower, less predictable conversion. Use sparingly in a Dream 5.

### Why Five, Not a Hundred

A list of a hundred contacts produces a hundred shallow relationships and zero reliable referrals. Five well-chosen partners, worked consistently, is the number one solo agent can actually sustain: enough contact to stay top of mind with each one, not so many that the relationship becomes a mail-merge. The Dream 5 above is not a starting point to expand from. It is the whole system.`;

const HANDWRITTEN_NOTE_PROTOCOL_BLOCK = `

---

### Handwritten Note Protocol

| Step | Action |
|---|---|
| 1 | Write the note by hand -- do not type or print it |
| 2 | Use quality card stock, not a plain notecard |
| 3 | Address the envelope by hand, matching the handwriting inside |
| 4 | Use a real stamp, not a metered or printed indicia |
| 5 | Mail it 5-7 days before any other follow-up |
| 6 | Do not reference the note in the follow-up email or call -- let it stand on its own |`;

const REFERRAL_MATH_DISCLAIMER_BLOCK = `

---

### A Note on the Referral Math Above

The scenarios above are a directional illustration, not a forecast, an income projection, or a guarantee. Actual referral volume, close rates, and transaction velocity depend on the quality of the partnerships built, the consistency of outreach, market conditions, and how quickly each partner engages. Year one typically runs below these numbers while relationships ramp up -- the numbers assume consistent execution over 12 months, not immediate results.`;

// Appends the static block(s) for a given phase, if any. Pure string op,
// no model call. Safe to call on every phase -- phases without a static
// block just pass through unchanged.
function appendStaticContent(phaseId, text) {
  if (phaseId === 3) return text + TIER_DEFINITIONS_BLOCK;
  if (phaseId === 6) return text + HANDWRITTEN_NOTE_PROTOCOL_BLOCK;
  if (phaseId === 7) return text + REFERRAL_MATH_DISCLAIMER_BLOCK;
  return text;
}

// ── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a Strategic Alliances Director specializing in referral partner systems for high-performing real estate professionals. You use the Dream 100 methodology to build systematic referral networks.

Your output style:
- Use markdown formatting with clear headers, tables, and bullet points
- Be specific to the agent's niche and market -- never generic
- Prioritize strategic depth and actionable specificity
- Every recommendation should be something the agent can act on this week
- When referencing partner types, use the EXACT types established in earlier phases
- Deliver exactly the deliverables described in the task`;

// ── Phase output validation ───────────────────────────────────────────────────
// Called after each phase saves its result. Returns a warning string if the
// output looks incomplete or broken, otherwise returns null.
// Non-fatal -- the run continues regardless. Warnings stored in phaseWarnings.

function validatePhaseOutput(phaseId, text) {
  if (!text || text.length < 200) {
    return 'Output is unusually short and may be incomplete.';
  }

  const lower = text.toLowerCase();

  if (phaseId === 2) {
    const hasTable = text.includes('|') && (lower.includes('upstream') || lower.includes('partner'));
    const hasScoring = lower.includes('proximity') || lower.includes('practicality') || lower.includes('score');
    if (!hasTable || !hasScoring) {
      return 'Phase 2 output may be missing the full partner scoring table. Phase 3 ranking depends on this data.';
    }
  }

  if (phaseId === 3) {
    const refusedToRank = lower.includes('cannot complete') || lower.includes('missing critical') ||
      lower.includes('i need from you') || lower.includes('what i need to proceed') ||
      lower.includes('incomplete phase 2') || lower.includes('please provide');
    if (refusedToRank) {
      return 'Phase 3 could not build the Dream 5 ranking -- Phase 2 output was incomplete. Downstream phases may lack partner context.';
    }
    const hasRanking = text.includes('|') || lower.includes('rank') || lower.includes('dream 5') || lower.includes('tier 1');
    if (!hasRanking) {
      return 'Phase 3 output does not appear to contain a partner ranking table. Review before using.';
    }
  }

  if (phaseId === 4) {
    const hasValueCards = lower.includes('value gift') || lower.includes('value strategy') || lower.includes('the gap');
    if (!hasValueCards) {
      return 'Phase 4 output may be missing Value Strategy Cards. Check that value gifts are defined.';
    }
  }

  if (phaseId === 6) {
    const hasScript4 = lower.includes('script 4') || lower.includes('handwritten note introduction');
    if (!hasScript4) {
      return 'Phase 6 output may be missing Script 4 (handwritten notes). Check the full output.';
    }
  }

  if (phaseId === 7) {
    const has90Day = lower.includes('90-day') || lower.includes('90 day') || lower.includes('week 1');
    const hasMath = lower.includes('conservative') || lower.includes('referral math');
    if (!has90Day || !hasMath) {
      return 'Phase 7 output may be missing the 90-day plan or referral math. Output may have been truncated.';
    }
  }

  return null;
}

// ── Context builders ─────────────────────────────────────────────────────────

function extractSection(text, keyword, maxLines) {
  if (!text) return null;
  const lines = text.split('\n');
  const keyLines = [];
  const kw = keyword.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes(kw) && line.length > 15) {
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        if (lines[j].trim()) keyLines.push(lines[j].trim());
      }
    }
    if (keyLines.length >= maxLines * 2) break;
  }
  return keyLines.length > 0 ? keyLines.slice(0, maxLines * 2).join('\n') : null;
}

function extractDream5(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const tableLines = [];
  let inTable = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      if (!/^\|[\s-:|]+\|$/.test(trimmed)) tableLines.push(trimmed);
    } else if (inTable && tableLines.length >= 2) break;
  }
  if (tableLines.length >= 3) return tableLines.slice(0, 7).join('\n');
  const numbered = lines.filter(l => /^\s*\d+[.)]\s+/.test(l)).slice(0, 5);
  if (numbered.length >= 3) return numbered.join('\n');
  const idx = text.toLowerCase().indexOf('dream 5');
  if (idx >= 0) return text.slice(idx, idx + 400).split('\n').slice(0, 8).join('\n');
  return text.slice(0, 500);
}

function buildContextForPhase(phaseId, phaseResults) {
  const parts = [];
  if (phaseResults['1'] && [2, 3, 4, 5, 6, 7].includes(phaseId)) {
    const triggers = extractSection(phaseResults['1'], 'trigger', 5);
    if (triggers) parts.push('TOP LIFECYCLE TRIGGERS IDENTIFIED (from Phase 1):\n' + triggers);
  }
  if (phaseResults['2'] && [3, 4, 5, 6, 7].includes(phaseId)) {
    const partners = extractSection(phaseResults['2'], 'upstream', 8);
    if (partners) parts.push('KEY PARTNER TYPES IDENTIFIED (from Phase 2):\n' + partners);
  }
  if (phaseResults['3'] && [4, 5, 6, 7].includes(phaseId)) {
    const dream5 = extractDream5(phaseResults['3']);
    if (dream5) parts.push('THE DREAM 5 PARTNER LIST (from Phase 3):\n' + dream5);
  }
  if (phaseResults['4'] && [5, 6, 7].includes(phaseId)) {
    const value = extractSection(phaseResults['4'], 'value gift', 3);
    if (value) parts.push('VALUE GIFTS IDENTIFIED (from Phase 4):\n' + value);
  }
  if (parts.length === 0) return '';
  return '\n\n' + '='.repeat(50) + '\n' +
    'CONTEXT FROM COMPLETED PHASES -- Use this to maintain consistency:\n' +
    '='.repeat(50) + '\n\n' +
    parts.join('\n\n---\n\n') +
    '\n\n' + '='.repeat(50) + '\n' +
    'IMPORTANT: Reference the specific partner types, triggers, and strategies above. ' +
    'Do NOT reinvent or contradict them. Build on what was already established.\n' +
    '='.repeat(50);
}

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { jobId, phaseId } = body;

    if (!jobId || !phaseId) {
      return Response.json({ error: 'Missing jobId or phaseId' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole.entities.GenerationJob;

    // ── Load job ─────────────────────────────────────────────────────────────
    const jobs = await db.filter({ id: jobId });
    const job = jobs[0];

    if (!job) {
      console.error(`[runGenerationPhase] Job ${jobId} not found`);
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status === 'complete' || job.status === 'failed' || job.status === 'cancelled') {
      console.log(`[runGenerationPhase] Job ${jobId} already ${job.status}, skipping phase ${phaseId}`);
      return Response.json({ success: true, skipped: true });
    }

    // ── Record phase start time and update status ─────────────────────────────
    const phaseStartedAt = new Date().toISOString();
    const existingTiming = job.phaseTiming || {};
    const timingWithStart = {
      ...existingTiming,
      [String(phaseId)]: { startedAt: phaseStartedAt },
    };

    await db.update(jobId, {
      status: 'running',
      currentPhase: phaseId,
      phaseTiming: timingWithStart,
    });

    console.log(`[runGenerationPhase] Job ${jobId} starting phase ${phaseId}`);

    // ── Get the prompt for this phase ────────────────────────────────────────
    const basePrompt = job.basePrompts.find(p => p.id === phaseId);
    if (!basePrompt) {
      await db.update(jobId, {
        status: 'failed',
        errorPhase: phaseId,
        errorMessage: 'No base prompt found for phase ' + phaseId,
      });
      return Response.json({ error: 'No base prompt for phase ' + phaseId }, { status: 400 });
    }

    // ── Build context from completed phases ──────────────────────────────────
    const phaseResults = job.phaseResults || {};
    const context = buildContextForPhase(phaseId, phaseResults);
    const fullPrompt = basePrompt.prompt + context;

    // ── Call Anthropic API ───────────────────────────────────────────────────
    const apiKey = Deno.env.get('CLAUDE_THINGY');
    if (!apiKey) {
      await db.update(jobId, {
        status: 'failed',
        errorPhase: phaseId,
        errorMessage: 'Anthropic API key not configured (CLAUDE_THINGY)',
      });
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const config = PHASE_MODEL_CONFIG[phaseId] || DEFAULT_MODEL_CONFIG;
    let result;

    const attemptStartedAt = new Date().toISOString();
    const attemptLog = {
      phaseId,
      model: config.model,
      maxTokens: config.max_tokens,
      thinkingDisabled: !!config.disableThinking,
      promptChars: fullPrompt.length,
      startedAt: attemptStartedAt,
      endedAt: null,
      outcome: 'in_progress',
      note: '',
    };

    async function logAttempt(outcome, note) {
      attemptLog.endedAt = new Date().toISOString();
      attemptLog.outcome = outcome;
      attemptLog.note = String(note || '').slice(0, 500);
      try {
        const fresh = await db.filter({ id: jobId });
        const priorAttempts = (fresh[0] && fresh[0].phaseAttempts) || [];
        await db.update(jobId, { phaseAttempts: [...priorAttempts, attemptLog].slice(-40) });
      } catch (logErr) {
        console.error('[runGenerationPhase] Failed to write attempt log:', logErr.message);
      }
    }

    const PHASE_TIMEOUT_MS = 110000;
    const abortController = new AbortController();
    const timeoutHandle = setTimeout(() => abortController.abort(), PHASE_TIMEOUT_MS);

    try {
      const requestBody = {
        model: config.model,
        max_tokens: config.max_tokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: fullPrompt }],
      };
      if (config.disableThinking) {
        requestBody.thinking = { type: 'disabled' };
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data.error?.message || JSON.stringify(data);
        throw new Error('Claude API ' + response.status + ': ' + errMsg);
      }

      if (!Array.isArray(data.content) || data.content.length === 0) {
        throw new Error('Empty response from Claude');
      }

      const textBlocks = data.content.filter(b => b && b.type === 'text' && typeof b.text === 'string');
      result = textBlocks.map(b => b.text).join('\n\n').trim();

      if (!result) {
        const kinds = data.content.map(b => (b && b.type) || 'unknown').join(', ');
        throw new Error(
          `No text content returned from ${config.model} (blocks: ${kinds}, stop_reason: ${data.stop_reason || 'none'})`
        );
      }

      if (data.stop_reason === 'max_tokens') {
        console.warn(`[runGenerationPhase] Phase ${phaseId} was truncated at ${config.max_tokens} tokens`);
      }

      result = appendStaticContent(phaseId, result);

      clearTimeout(timeoutHandle);
      await logAttempt('success', `${result.length} chars, stop_reason=${data.stop_reason || 'none'}`);

      console.log(`[runGenerationPhase] Phase ${phaseId} complete, ${result.length} chars, model=${config.model}`);

    } catch (apiError) {
      clearTimeout(timeoutHandle);
      const timedOut = apiError && (apiError.name === 'AbortError');
      const message = timedOut
        ? `Timed out after ${PHASE_TIMEOUT_MS / 1000}s waiting on ${config.model}. The request never returned.`
        : apiError.message;

      console.error(`[runGenerationPhase] Phase ${phaseId} API error:`, message);
      await logAttempt(timedOut ? 'timeout' : 'error', message);

      await db.update(jobId, {
        status: 'failed',
        errorPhase: phaseId,
        errorMessage: message,
      });
      return Response.json({ error: message }, { status: 500 });
    }

    // ── Save result, timing, and validation warning ───────────────────────────
    const updatedPhaseResults = { ...phaseResults, [String(phaseId)]: result };
    const timingWithComplete = {
      ...timingWithStart,
      [String(phaseId)]: { startedAt: phaseStartedAt, completedAt: new Date().toISOString() },
    };

    const warning = validatePhaseOutput(phaseId, result);
    const existingWarnings = job.phaseWarnings || {};
    const updatedWarnings = warning
      ? { ...existingWarnings, [String(phaseId)]: warning }
      : existingWarnings;

    if (warning) {
      console.warn(`[runGenerationPhase] Phase ${phaseId} validation warning: ${warning}`);
    }

    await db.update(jobId, {
      phaseResults: updatedPhaseResults,
      phaseTiming: timingWithComplete,
      phaseWarnings: updatedWarnings,
    });

    // ── Chain to next phase or complete ──────────────────────────────────────
    if (phaseId < 7) {
      base44.functions.invoke('runGenerationPhase', { jobId, phaseId: phaseId + 1 })
        .catch(err => console.error(`[runGenerationPhase] Phase ${phaseId + 1} trigger failed:`, err));

      await new Promise(r => setTimeout(r, 500));

      console.log(`[runGenerationPhase] Triggered phase ${phaseId + 1}`);

    } else {
      await db.update(jobId, {
        status: 'complete',
        currentPhase: 8,
        completedAt: new Date().toISOString(),
      });

      console.log(`[runGenerationPhase] Job ${jobId} COMPLETE`);

      if (job.userEmail) {
        try {
          await sendDeliveryEmail(job.userEmail, jobId);
        } catch (emailErr) {
          console.error('[runGenerationPhase] Delivery email failed:', emailErr.message);
        }
      }
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('[runGenerationPhase] Exception:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ── Resend email helper ───────────────────────────────────────────────────────

async function sendDeliveryEmail(toEmail, jobId) {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    console.warn('[runGenerationPhase] RESEND_API_KEY not set, skipping delivery email');
    return;
  }

  const blueprintUrl = 'https://pipeline.nurturink.com/RunBlueprint?jobId=' + jobId;

  const htmlBody = `
    <div style="font-family: 'Sora', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 28px; font-weight: 800; color: #1B2A4A;">Your Dream Partner Blueprint is Ready</div>
      </div>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Your personalized Dream Partner Blueprint is complete. Click the button below to view
        your full report and download it.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${blueprintUrl}" style="display: inline-block; background: #C9973A; color: #1B2A4A; text-decoration: none; font-weight: 800; font-size: 16px; padding: 14px 32px; border-radius: 10px;">
          View My Blueprint
        </a>
      </div>
      <p style="font-size: 13px; color: #888; text-align: center; line-height: 1.5;">
        Your report is available at this link. Bookmark it to come back later.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        This email was sent by the Dream Partner Blueprint tool, powered by Write Because.
      </p>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + resendKey,
    },
    body: JSON.stringify({
      from: Deno.env.get('RESEND_FROM_ADDRESS') || 'blueprint@pipeline.nurturink.com',
      to: [toEmail],
      subject: 'Your Dream Partner Blueprint is ready',
      html: htmlBody,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error('Resend ' + response.status + ': ' + (errData.message || 'unknown error'));
  }

  console.log('[runGenerationPhase] Delivery email sent to', toEmail);
}