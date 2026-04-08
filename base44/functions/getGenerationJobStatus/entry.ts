import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return Response.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const jobs = await base44.asServiceRole.entities.GenerationJob.filter({ id: jobId });
    const job = jobs[0];

    if (!job) {
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    return Response.json({
      status: job.status,
      currentPhase: job.currentPhase,
      phaseResults: job.phaseResults || {},
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