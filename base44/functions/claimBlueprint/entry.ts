import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Text helpers ────────────────────────────────────────────────────────────

function clean(s) {
  return String(s || '')
    .replace(/\*\*/g, '')
    .replace(/^[\s*_#>-]+/, '')
    .replace(/[\s*_]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function looksLikeSeparator(cells) {
  return cells.every(c => /^:?-{2,}:?$/.test(c.trim()));
}

function splitRow(line) {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map(c => c.trim());
}

// ── Extraction path 1: the Dream 5 markdown table in Phase 3 ────────────────

function fromTable(text) {
  if (!text) return [];
  const lines = String(text).split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 3) return [];

  let headerIdx = -1;
  let cols = null;

  for (let i = 0; i < lines.length; i++) {
    const cells = splitRow(lines[i]).map(c => c.toLowerCase());
    const typeIdx = cells.findIndex(c => c.includes('partner type') || c === 'partner' || c.includes('partner category'));
    if (typeIdx === -1) continue;
    headerIdx = i;
    cols = {
      type: typeIdx,
      rank: cells.findIndex(c => c.includes('rank')),
      tier: cells.findIndex(c => c.includes('tier')),
      why: cells.findIndex(c => c.includes('why') || c.includes('priority')),
      contact: cells.findIndex(c => c.includes('first contact') || c.includes('strategy')),
      width: cells.length,
    };
    break;
  }
  if (headerIdx === -1) return [];

  const out = [];
  for (let i = headerIdx + 1; i < lines.length && out.length < 5; i++) {
    const cells = splitRow(lines[i]);
    if (cells.length < 2) continue;
    if (looksLikeSeparator(cells)) continue;
    const type = clean(cells[cols.type]);
    if (!type) continue;
    if (/^partner type$/i.test(type)) continue;
    out.push({
      partnerType: type,
      tier: cols.tier > -1 ? clean(cells[cols.tier]) : '',
      rank: cols.rank > -1 ? (parseInt(clean(cells[cols.rank]), 10) || out.length + 1) : out.length + 1,
      whyPriority: cols.why > -1 ? clean(cells[cols.why]) : '',
      firstContactStrategy: cols.contact > -1 ? clean(cells[cols.contact]) : '',
    });
  }
  return out;
}

// ── Extraction path 2: numbered or bolded headings ──────────────────────────

function fromHeadings(text) {
  if (!text) return [];
  const out = [];
  const lines = String(text).split('\n');
  const seen = new Set();

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    let m = line.match(/^#{2,4}\s*(?:\d+[.)]\s*)?(.+)$/);
    if (!m) m = line.match(/^(?:\d+[.)]|[-*])\s*\*\*(.+?)\*\*/);
    if (!m) m = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (!m) continue;

    const label = clean(m[1]).replace(/[:.]$/, '');
    if (!label) continue;
    if (label.length < 3 || label.length > 60) continue;
    if (/phase|tier|deliverable|task|summary|overview|table|dream|strategy|note/i.test(label)) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      partnerType: label,
      tier: '',
      rank: out.length + 1,
      whyPriority: '',
      firstContactStrategy: '',
    });
    if (out.length >= 5) break;
  }
  return out;
}

function placeholders() {
  return [1, 2, 3, 4, 5].map(n => ({
    partnerType: 'Partner type ' + n,
    tier: '',
    rank: n,
    whyPriority: '',
    firstContactStrategy: '',
    needsType: true,
  }));
}

function extractPartnerTypes(phaseResults) {
  const p3 = phaseResults?.['3'] || '';
  const p2 = phaseResults?.['2'] || '';

  let rows = fromTable(p3);
  if (rows.length >= 3) return { rows: rows.slice(0, 5), quality: 'table' };

  rows = fromHeadings(p3);
  if (rows.length >= 3) return { rows: rows.slice(0, 5), quality: 'headings' };

  rows = fromHeadings(p2);
  if (rows.length >= 3) return { rows: rows.slice(0, 5), quality: 'phase2' };

  return { rows: placeholders(), quality: 'placeholder' };
}

function token() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

// ── Handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch(() => null);
    if (!user || !user.id) {
      return Response.json({ error: 'Not signed in' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const jobId = String(body?.jobId || '').trim();
    if (!jobId) {
      return Response.json({ error: 'Missing jobId' }, { status: 400 });
    }

    // Already claimed by this user? Return it, do not duplicate.
    const existing = await base44.asServiceRole.entities.TrackerBlueprint.filter(
      { ownerUserId: user.id, jobId },
      '-created_date',
      1
    );
    if (existing && existing.length > 0) {
      return Response.json({ success: true, trackerId: existing[0].id, alreadyClaimed: true });
    }

    const jobs = await base44.asServiceRole.entities.GenerationJob.filter({ id: jobId }, '-created_date', 1);
    const job = jobs && jobs[0];
    if (!job) {
      return Response.json({ error: 'Blueprint not found' }, { status: 404 });
    }
    if (job.status !== 'complete') {
      return Response.json({ error: 'Blueprint is not finished yet' }, { status: 409 });
    }

    const fd = job.formData || {};
    const { rows, quality } = extractPartnerTypes(job.phaseResults || {});

    const nowIso = new Date().toISOString();

    const tracker = await base44.asServiceRole.entities.TrackerBlueprint.create({
      ownerUserId: user.id,
      jobId,
      agentName: String(fd.name || ''),
      niche: String(fd.niche || fd.nicheBase || ''),
      geography: String(fd.geo || ''),
      claimedAt: nowIso,
      namingComplete: false,
      weeklyEmailEnabled: true,
      weeklyEmailAddress: String(fd.email || job.userEmail || user.email || ''),
      parseQuality: quality,
    });

    let created = 0;
    for (const row of rows) {
      try {
        await base44.asServiceRole.entities.Partner.create({
          ownerUserId: user.id,
          trackerId: tracker.id,
          jobId,
          partnerType: row.partnerType,
          tier: row.tier || '',
          rank: row.rank || 99,
          whyPriority: row.whyPriority || '',
          firstContactStrategy: row.firstContactStrategy || '',
          personName: '',
          company: '',
          stage: 'identified',
          stageChangedAt: nowIso,
          touchCount: 0,
          referralCount: 0,
          notes: [],
          actionToken: token(),
          archived: false,
        });
        created++;
      } catch (err) {
        console.error('[claimBlueprint] Partner create failed:', err?.message);
      }
    }

    console.log(`[claimBlueprint] user=${user.id} job=${jobId} tracker=${tracker.id} partners=${created} quality=${quality}`);

    return Response.json({
      success: true,
      trackerId: tracker.id,
      partnersCreated: created,
      parseQuality: quality,
    });

  } catch (error) {
    console.error('[claimBlueprint] Exception:', error?.message, error?.stack);
    return Response.json({ error: error?.message || 'Unexpected error' }, { status: 500 });
  }
});
