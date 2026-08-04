import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Longer staleness thresholds for the independent sweep ───────────────────
// getGenerationJobStatus (browser poll, runs every 5s while a tab is open)
// uses a 12s stall threshold and 15s heal cooldown -- appropriate since it's
// already checking every few seconds. This function runs unattended every
// 5 minutes, so its job is different: catch runs where the tab was closed
// (or never opened again) and nothing else is watching. A much longer
// staleness window means it never fights with the frontend's own healing on
// a run that's simply slow, not dropped -- it only steps in once that poll-based
// heal would have long since kicked in and clearly hasn't.
const STALL_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes
const HEAL_COOLDOWN_MS = 15000; // same cooldown field/window as getGenerationJobStatus

function msSince(iso) {
  if (!iso) return Infinity;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? Infinity : Date.now() - t;
}

// Mirrors the two drop points handled in getGenerationJobStatus:
// 1. Startup: startGenerationJob's fire-and-forget invoke for phase 1 dropped,
//    so the job never left 'queued' and has no phaseTiming at all.
// 2. Mid-chain: a phase completed and saved its result, but the next phase's
//    invoke never arrived.
// Returns the phase number it re-triggered, or null if nothing needed healing.
async function healJob(base44, db, job) {
  const cooledDown = msSince(job.lastHealTriggerAt) > HEAL_COOLDOWN_MS;
  if (!cooledDown) return null;

  if (job.status === 'queued') {
    if (msSince(job.created_date) <= STALL_THRESHOLD_MS) return null;

    console.warn(`[healStalledJobs] Job ${job.id} still queued after ${msSince(job.created_date)}ms with no phase 1 result. Re-triggering phase 1.`);
    await db.update(job.id, { lastHealTriggerAt: new Date().toISOString() });
    base44.functions.invoke('runGenerationPhase', { jobId: job.id, phaseId: 1 })
      .catch(err => console.error(`[healStalledJobs] Heal trigger for phase 1 failed (job ${job.id}):`, err));
    return 1;
  }

  if (job.status === 'running' && job.currentPhase && job.currentPhase < 7) {
    const currentPhase = job.currentPhase;
    const phaseResults = job.phaseResults || {};
    const phaseTiming = job.phaseTiming || {};
    const currentTiming = phaseTiming[String(currentPhase)];
    const resultSaved = !!phaseResults[String(currentPhase)];
    const completedAt = currentTiming && currentTiming.completedAt;
    const idleLongEnough = resultSaved && completedAt && msSince(completedAt) > STALL_THRESHOLD_MS;

    if (idleLongEnough) {
      const nextPhase = currentPhase + 1;
      console.warn(`[healStalledJobs] Job ${job.id} looks stalled after phase ${currentPhase} (idle ${msSince(completedAt)}ms). Re-triggering phase ${nextPhase}.`);
      await db.update(job.id, { lastHealTriggerAt: new Date().toISOString() });
      base44.functions.invoke('runGenerationPhase', { jobId: job.id, phaseId: nextPhase })
        .catch(err => console.error(`[healStalledJobs] Heal trigger for phase ${nextPhase} failed (job ${job.id}):`, err));
      return nextPhase;
    }
  }

  return null;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = base44.asServiceRole.entities.GenerationJob;

    const [queuedJobs, runningJobs] = await Promise.all([
      db.filter({ status: 'queued' }),
      db.filter({ status: 'running' }),
    ]);

    const jobs = [...queuedJobs, ...runningJobs];
    const healed = [];

    for (const job of jobs) {
      const triggeredPhase = await healJob(base44, db, job);
      if (triggeredPhase) {
        healed.push({ jobId: job.id, triggeredPhase });
        // Small stagger so a batch of stalled jobs doesn't fire simultaneous invokes.
        await new Promise(r => setTimeout(r, 300));
      }
    }

    console.log(`[healStalledJobs] Checked ${jobs.length} job(s), healed ${healed.length}.`);

    return Response.json({ checked: jobs.length, healed });

  } catch (error) {
    console.error('[healStalledJobs] Exception:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
}