import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Stall detection ───────────────────────────────────────────────────────
// runGenerationPhase chains phases with a fire-and-forget invoke plus a
// 500ms grace window. That trigger occasionally drops -- the completed
// phase's result is saved but the next phase never starts, and the job
// sits at status "running" indefinitely. This page is polled every 5s by
// the frontend, so we use that same poll to notice and self-heal.
//
// A job is "stalled" when: still running, the current phase's result is
// already saved, the next phase exists (currentPhase < 7), and enough
// time has passed since that phase completed that a healthy trigger
// would have already started the next one.
const STALL_THRESHOLD_MS = 12000;
const HEAL_COOLDOWN_MS = 15000;

function msSince(iso) {
  if (!iso) return Infinity;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? Infinity : Date.now() - t;
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return Response.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole.entities.GenerationJob;

    const jobs = await db.filter({ id: jobId });
    let job = jobs[0];

    if (!job) {
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    // ── Self-heal a dropped phase trigger ────────────────────────────────
    // Two distinct drop points share one cooldown gate:
    // 1. Mid-chain: a phase completed and saved its result, but the next
    //    phase's invoke never arrived. Detected via phaseTiming.
    // 2. Startup: startGenerationJob's own fire-and-forget invoke for
    //    phase 1 dropped, so the job never left 'queued' and has no
    //    phaseTiming at all -- the mid-chain check can't see this case,
    //    since it requires a completed phase to compare against.
    const cooledDown = msSince(job.lastHealTriggerAt) > HEAL_COOLDOWN_MS;

    if (job.status === 'queued' && cooledDown && msSince(job.created_date) > STALL_THRESHOLD_MS) {
      console.warn(`[getGenerationJobStatus] Job ${jobId} still queued after ${msSince(job.created_date)}ms with no phase 1 result. Re-triggering phase 1.`);

      await db.update(jobId, { lastHealTriggerAt: new Date().toISOString() });

      base44.functions.invoke('runGenerationPhase', { jobId, phaseId: 1 })
        .catch(err => console.error('[getGenerationJobStatus] Heal trigger for phase 1 failed:', err));

      await new Promise(r => setTimeout(r, 500));

      const refreshed = await db.filter({ id: jobId });
      if (refreshed[0]) job = refreshed[0];

    } else if (job.status === 'running' && job.currentPhase && job.currentPhase < 7 && cooledDown) {
      const currentPhase = job.currentPhase;
      const phaseResults = job.phaseResults || {};
      const phaseTiming = job.phaseTiming || {};
      const currentTiming = phaseTiming[String(currentPhase)];

      const resultSaved = !!phaseResults[String(currentPhase)];
      const completedAt = currentTiming && currentTiming.completedAt;
      const idleLongEnough = resultSaved && completedAt && msSince(completedAt) > STALL_THRESHOLD_MS;

      if (idleLongEnough) {
        const nextPhase = currentPhase + 1;
        console.warn(`[getGenerationJobStatus] Job ${jobId} looks stalled after phase ${currentPhase} (idle ${msSince(completedAt)}ms). Re-triggering phase ${nextPhase}.`);

        await db.update(jobId, { lastHealTriggerAt: new Date().toISOString() });

        base44.functions.invoke('runGenerationPhase', { jobId, phaseId: nextPhase })
          .catch(err => console.error(`[getGenerationJobStatus] Heal trigger for phase ${nextPhase} failed:`, err));

        // Brief delay so the invoke has a chance to initiate before this
        // isolate returns -- same pattern used everywhere else in this app.
        await new Promise(r => setTimeout(r, 500));

        const refreshed = await db.filter({ id: jobId });
        if (refreshed[0]) job = refreshed[0];
      }
    }

    return Response.json({
      status: job.status,
      currentPhase: job.currentPhase,
      phaseResults: job.phaseResults || {},
      phaseTiming: job.phaseTiming || {},
      phaseWarnings: job.phaseWarnings || {},
      phaseAttempts: job.phaseAttempts || [],
      formData: job.formData,
      userEmail: job.userEmail || '',
      errorPhase: job.errorPhase || null,
      errorMessage: job.errorMessage || null,
      completedAt: job.completedAt || null,
    });

  } catch (error) {
    console.error('[getGenerationJobStatus] Exception:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
