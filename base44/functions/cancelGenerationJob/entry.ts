import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Lets the person running a blueprint stop it cleanly instead of closing the
// tab and leaving the job at status "running" forever. Marking it cancelled
// also stops the self-heal logic in getGenerationJobStatus from resurrecting
// it, and stops any in-flight phase from being retried once it fails.

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const jobId = String(body?.jobId || '').trim();
    if (!jobId) {
      return Response.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole.entities.GenerationJob;

    const jobs = await db.filter({ id: jobId });
    const job = jobs[0];
    if (!job) {
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status === 'complete' || job.status === 'failed' || job.status === 'cancelled') {
      return Response.json({ success: true, alreadyFinished: true, status: job.status });
    }

    await db.update(jobId, {
      status: 'cancelled',
      errorMessage: 'Cancelled by user while running.',
    });

    console.log(`[cancelGenerationJob] Job ${jobId} cancelled at phase ${job.currentPhase || 0}`);

    return Response.json({ success: true });

  } catch (error) {
    console.error('[cancelGenerationJob] Exception:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
