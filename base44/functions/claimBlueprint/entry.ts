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

// ── Phase 6 handwritten notes ───────────────────────────────────────────────
// Phase 6 writes one introduction note per Dream 5 partner type under
// "SCRIPT 4 -- Handwritten Note Introduction". Pulling them out here means the
// tracker can show the agent the exact note for the exact partner at the moment
// it tells them to send one, instead of sending them back into a 70-page PDF.

function extractNotes(phase6Text) {
  if (!phase6Text || typeof phase6Text !== 'string') return [];

  const section = phase6Text.match(
    /SCRIPT\s+4\s*[\u2014\-\u2013]*\s*Handwritten\s+Note\s+Introduction([\s\S]*?)(?=SCRIPT\s+5|HANDWRITTEN\s+NOTE\s+PROTOCOL|$)/i
  );
  if (!section) return [];

  const blocks = section[1]
    .split(/(?:^|\n)\s*\*{0,2}(?:VERSION|Version)\s+\d+\s*[\u2014\-\u2013]*/gm)
    .filter(b => b.trim().length > 10);

  const out = [];
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;
    const label = clean(lines[0]);
    const body = lines.slice(1)
      .filter(l => !/^\|/.test(l) && !/^Handwritten\s+Note\s+Protocol/i.test(l) && !/^-{3,}$/.test(l))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (label && body.length > 20) out.push({ label, body });
    if (out.length >= 5) break;
  }
  return out;
}

// Match a note to a partner type by word overlap. The Phase 6 label and the
// Phase 3 partner name are usually close but rarely identical, e.g.
// "Financial Advisor (tech-focused wealth management)" vs "Financial Advisor".
function matchNote(partnerType, notes, usedIdx) {
  const words = new Set(
    String(partnerType).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
      .filter(w => w.length > 3)
  );
  let best = -1;
  let bestScore = 0;
  notes.forEach((n, i) => {
    if (usedIdx.has(i)) return;
    const nw = String(n.label).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/);
    let score = 0;
    for (const w of nw) if (words.has(w)) score++;
    if (score > bestScore) { bestScore = score; best = i; }
  });
  return bestScore > 0 ? best : -1;
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
