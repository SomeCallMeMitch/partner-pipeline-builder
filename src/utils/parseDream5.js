// src/utils/parseDream5.js
//
// Front-end extraction of the Dream 5 partner types from Phase 3.
//
// This deliberately mirrors the table/heading extraction in
// base44/functions/claimBlueprint/entry.ts. The report's "start here" summary
// and the tracker's seeded partners must show the SAME five partner types --
// if the report says "start with the estate attorney" and the tracker seeds a
// different first partner, the whole handoff loses credibility. Keep the two
// in sync when either changes.

function clean(s) {
  return String(s || '')
    .replace(/\*\*/g, '')
    .replace(/^[\s*_#>-]+/, '')
    .replace(/[\s*_]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitRow(line) {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map(c => c.trim());
}

function looksLikeSeparator(cells) {
  return cells.every(c => /^:?-{2,}:?$/.test(c.trim()));
}

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

function fromHeadings(text) {
  if (!text) return [];
  const out = [];
  const seen = new Set();
  for (const raw of String(text).split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    let m = line.match(/^#{2,4}\s*(?:\d+[.)]\s*)?(.+)$/);
    if (!m) m = line.match(/^(?:\d+[.)]|[-*])\s*\*\*(.+?)\*\*/);
    if (!m) m = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (!m) continue;
    const label = clean(m[1]).replace(/[:.]$/, '');
    if (!label || label.length < 3 || label.length > 60) continue;
    if (/phase|tier|deliverable|task|summary|overview|table|dream|strategy|note/i.test(label)) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ partnerType: label, tier: '', rank: out.length + 1, whyPriority: '', firstContactStrategy: '' });
    if (out.length >= 5) break;
  }
  return out;
}

/**
 * Returns { rows, quality }. rows is [] when nothing usable was found, so the
 * caller can hide the summary rather than render an empty or fake one.
 */
export function parseDream5(phaseResults) {
  const p3 = phaseResults?.['3'] || '';
  const p2 = phaseResults?.['2'] || '';

  let rows = fromTable(p3);
  if (rows.length >= 3) return { rows: rows.slice(0, 5), quality: 'table' };

  rows = fromHeadings(p3);
  if (rows.length >= 3) return { rows: rows.slice(0, 5), quality: 'headings' };

  rows = fromHeadings(p2);
  if (rows.length >= 3) return { rows: rows.slice(0, 5), quality: 'phase2' };

  return { rows: [], quality: 'none' };
}

/**
 * Match a Phase 6 note to a partner type by word overlap. Labels are close but
 * rarely identical, e.g. "Financial Advisor (tech-focused)" vs "Financial Advisor".
 * Mirrors matchNote() in claimBlueprint.
 */
export function matchNoteToPartner(partnerType, notes) {
  if (!Array.isArray(notes) || !notes.length) return null;
  const words = new Set(
    String(partnerType).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3)
  );
  let best = null;
  let bestScore = 0;
  for (const n of notes) {
    const label = n.partnerType || n.label || '';
    const nw = String(label).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/);
    let score = 0;
    for (const w of nw) if (words.has(w)) score++;
    if (score > bestScore) { bestScore = score; best = n; }
  }
  return bestScore > 0 ? best : null;
}
