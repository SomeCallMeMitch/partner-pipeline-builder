import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Per-Phase Model Config ──────────────────────────────────────────────────
const PHASE_MODEL_CONFIG = {
  1: { model: 'claude-haiku-4-5-20251001', max_tokens: 3500 },
  2: { model: 'claude-haiku-4-5-20251001', max_tokens: 5000 },
  3: { model: 'claude-haiku-4-5-20251001', max_tokens: 3000 },
  4: { model: 'claude-sonnet-4-6',         max_tokens: 10000 },
  5: { model: 'claude-haiku-4-5-20251001', max_tokens: 3500 },
  6: { model: 'claude-sonnet-4-6',         max_tokens: 5000 },
  7: { model: 'claude-haiku-4-5-20251001', max_tokens: 10000 },
};

const DEFAULT_MODEL_CONFIG = { model: 'claude-haiku-4-5-20251001', max_tokens: 4000 };

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

    if (job.status === 'complete' || job.status === 'failed') {
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

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: config.max_tokens,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: fullPrompt }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data.error?.message || JSON.stringify(data);
        throw new Error('Claude API ' + response.status + ': ' + errMsg);
      }

      if (!data.content || !data.content[0]) {
        throw new Error('Empty response from Claude');
      }

      const textBlocks = data.content.filter(b => b.type === 'text');
      result = textBlocks.length > 0
        ? textBlocks.map(b => b.text).join('\n\n')
        : data.content[0].text;

      if (data.stop_reason === 'max_tokens') {
        console.warn(`[runGenerationPhase] Phase ${phaseId} was truncated at ${config.max_tokens} tokens`);
      }

      console.log(`[runGenerationPhase] Phase ${phaseId} complete, ${result.length} chars, model=${config.model}`);

    } catch (apiError) {
      console.error(`[runGenerationPhase] Phase ${phaseId} API error:`, apiError.message);
      await db.update(jobId, {
        status: 'failed',
        errorPhase: phaseId,
        errorMessage: apiError.message,
      });
      return Response.json({ error: apiError.message }, { status: 500 });
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
        This email was sent by the Dream Partner Blueprint tool, powered by NurturInk.
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