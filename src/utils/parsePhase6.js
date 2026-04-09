// src/utils/parsePhase6.js
//
// Extracts the 5 partner-specific handwritten note versions from Phase 6 output.
// Phase 6 always contains a section "SCRIPT 4 — Handwritten Note Introduction"
// followed by 5 labeled versions (VERSION 1, Version 1, or numbered variants).
//
// Returns an array of up to 5 objects: { partnerType, noteText }
// If parsing fails or finds fewer than 2 notes, returns null (caller shows fallback).

export function parsePhase6Notes(phase6Text) {
  if (!phase6Text || typeof phase6Text !== 'string') return null;

  // ── Step 1: Isolate the SCRIPT 4 section ─────────────────────────────────
  const script4Match = phase6Text.match(
    /SCRIPT\s+4\s*[—\-–]*\s*Handwritten\s+Note\s+Introduction([\s\S]*?)(?=SCRIPT\s+5|HANDWRITTEN\s+NOTE\s+PROTOCOL|##\s+Script\s+5|$)/i
  );

  if (!script4Match) return null;
  const script4Block = script4Match[1];

  // ── Step 2: Split into individual versions ────────────────────────────────
  // Versions are labeled: VERSION 1, Version 1 —, **VERSION 1**, etc.
  const versionSplitRegex = /(?:^|\n)\s*\*{0,2}(?:VERSION|Version)\s+\d+\s*[—\-–]*/gm;
  const splits = script4Block.split(versionSplitRegex).filter(s => s.trim().length > 10);

  if (splits.length < 2) {
    // Fallback: try numbered list style (1. Partner Type\n...)
    return parseNumberedStyle(script4Block);
  }

  const notes = [];

  for (const block of splits) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // First non-empty line is usually the partner type label
    const partnerType = lines[0]
      .replace(/^\*+/, '').replace(/\*+$/, '')   // strip bold markers
      .replace(/^[—\-–]+/, '').trim();

    // Everything after the first line is the note body (stop at next structural element)
    const bodyLines = lines.slice(1).filter(l =>
      !l.match(/^Handwritten\s+Note\s+Protocol/i) &&
      !l.match(/^\|\s*Step/) &&
      !l.match(/^SCRIPT\s+[56]/i)
    );

    const noteText = bodyLines.join(' ').replace(/\s+/g, ' ').trim();

    if (partnerType && noteText && noteText.length > 20) {
      notes.push({ partnerType, noteText });
    }

    if (notes.length >= 5) break;
  }

  return notes.length >= 2 ? notes : null;
}

// Handles edge case where versions are numbered differently
function parseNumberedStyle(block) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const notes = [];
  let currentPartner = null;
  let currentLines = [];

  for (const line of lines) {
    const isHeader = /^\d+[\.\)]\s+/.test(line) || /^[A-Z][a-z]+.*\s+(Advisor|Attorney|Broker|Agent|Manager|Planner|Strategist|Coach|Officer|Counsel|Recruiter|Director)/.test(line);

    if (isHeader && currentPartner && currentLines.length > 0) {
      notes.push({ partnerType: currentPartner, noteText: currentLines.join(' ').trim() });
      currentLines = [];
    }

    if (isHeader) {
      currentPartner = line.replace(/^\d+[\.\)]\s+/, '').trim();
    } else if (currentPartner) {
      currentLines.push(line);
    }

    if (notes.length >= 5) break;
  }

  if (currentPartner && currentLines.length > 0) {
    notes.push({ partnerType: currentPartner, noteText: currentLines.join(' ').trim() });
  }

  return notes.length >= 2 ? notes : null;
}