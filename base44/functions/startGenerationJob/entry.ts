import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { formData, basePrompts, userEmail } = body;

    // ── Validate ──────────────────────────────────────────────────────────────
    if (!formData || typeof formData !== 'object') {
      return Response.json({ error: 'Missing or invalid formData' }, { status: 400 });
    }
    if (!Array.isArray(basePrompts) || basePrompts.length !== 7) {
      return Response.json({ error: 'basePrompts must be an array with exactly 7 items' }, { status: 400 });
    }

    // ── Create the job record ─────────────────────────────────────────────────
    const base44 = createClientFromRequest(req);

    const newJob = await base44.asServiceRole.entities.GenerationJob.create({
      formData,
      basePrompts,
      userEmail: (userEmail || '').trim(),
      status: 'queued',
      currentPhase: 0,
      phaseResults: {},
    });

    console.log(`[startGenerationJob] Created job ${newJob.id} for ${formData.name || 'unknown'}`);

    // ── Fire-and-forget: trigger Phase 1 ──────────────────────────────────────
    const triggerUrl = Deno.env.get('BASE44_API_URL') + '/functions/runGenerationPhase';

    fetch(triggerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: newJob.id, phaseId: 1 }),
    }).catch(err => console.error('[startGenerationJob] Phase 1 trigger failed:', err));

    // ── Return immediately ────────────────────────────────────────────────────
    return Response.json({ success: true, jobId: newJob.id });

  } catch (error) {
    console.error('[startGenerationJob] Exception:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});