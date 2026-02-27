/**
 * NurturInk Dream 100 Blueprint — DOCX Builder (Deno / Base44)
 * File: functions/exportToWord.js
 */

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, LevelFormat,
  TabStopType, TabStopPosition
} from "npm:docx@9.5.3";

// ── Color palette ─────────────────────────────────────────────────────────
const NAVY      = "1B2A4A";
const STEEL     = "3A6B9F";
const GOLD      = "C9952A";
const DARK_GOLD = "9A6E14";
const WHITE     = "FFFFFF";
const BODY_TEXT = "2C2C2C";
const MID_GRAY  = "AAAAAA";
const LIGHT_GRAY= "F5F5F5";

// ═════════════════════════════════════════════════════════════════════════
// SECTION 1 — LOW-LEVEL FORMATTING HELPERS
// ═════════════════════════════════════════════════════════════════════════

const cellBorder = (color = MID_GRAY) => ({
  top:    { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left:   { style: BorderStyle.SINGLE, size: 1, color },
  right:  { style: BorderStyle.SINGLE, size: 1, color },
});

const noBorder = () => ({
  top:    { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right:  { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
});

const spacer = (pts = 6) => new Paragraph({
  children: [],
  spacing: { before: pts * 20, after: 0 }
});

const body = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Arial", size: 21, color: BODY_TEXT })],
  spacing: { before: 60, after: 60 }
});

const subhead = (text, color = NAVY) => new Paragraph({
  children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color })],
  spacing: { before: 240, after: 80 }
});

const subhead2 = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: STEEL })],
  spacing: { before: 200, after: 60 }
});

const bullet = (text, bold = false) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text, font: "Arial", size: 21, color: BODY_TEXT, bold })]
});

// ═════════════════════════════════════════════════════════════════════════
// SECTION 2 — STRUCTURAL COMPONENTS
// ═════════════════════════════════════════════════════════════════════════

function sectionHeader(title, subtitle = "") {
  const items = [
    new Paragraph({
      shading: { fill: NAVY, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: "  " + title, font: "Arial", size: 32, bold: true, color: WHITE })]
    })
  ];
  if (subtitle) {
    items.push(new Paragraph({
      shading: { fill: STEEL, type: ShadingType.CLEAR },
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: "  " + subtitle, font: "Arial", size: 20, color: WHITE, italics: true })]
    }));
  } else {
    items.push(spacer(12));
  }
  return items;
}

function calloutBox(label, text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 4, color: GOLD },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
          left:   { style: BorderStyle.SINGLE, size: 12, color: GOLD },
          right:  { style: BorderStyle.NONE, size: 0, color: WHITE },
        },
        shading: { fill: "FFFDF0", type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        width: { size: 9360, type: WidthType.DXA },
        children: [
          new Paragraph({ children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: DARK_GOLD })] }),
          new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20, color: BODY_TEXT })] })
        ]
      })]
    })]
  });
}

function infoBox(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: cellBorder(STEEL),
        shading: { fill: "EEF4FB", type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        width: { size: 9360, type: WidthType.DXA },
        children: [new Paragraph({
          children: [new TextRun({ text, font: "Arial", size: 20, color: NAVY, italics: true })]
        })]
      })]
    })]
  });
}

function dataTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      shading: { fill: NAVY, type: ShadingType.CLEAR },
      borders: cellBorder(STEEL),
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      width: { size: colWidths[i], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: h, font: "Arial", size: 18, bold: true, color: WHITE })]
      })]
    }))
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      shading: { fill: ri % 2 === 0 ? WHITE : LIGHT_GRAY, type: ShadingType.CLEAR },
      borders: cellBorder(),
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      width: { size: colWidths[ci], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: String(cell), font: "Arial", size: 18, color: BODY_TEXT })]
      })]
    }))
  }));

  return new Table({
    width: { size: colWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows]
  });
}

function scriptCard(title, lines) {
  const bodyLines = lines.map(line => new Paragraph({
    spacing: line === "" ? { before: 80, after: 0 } : { before: 0, after: 0 },
    children: line === ""
      ? []
      : [new TextRun({ text: line, font: "Arial", size: 20, color: BODY_TEXT })]
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [new TableCell({
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          borders: noBorder(),
          margins: { top: 80, bottom: 80, left: 160, right: 160 },
          width: { size: 9360, type: WidthType.DXA },
          children: [new Paragraph({
            children: [new TextRun({ text: title, font: "Arial", size: 22, bold: true, color: WHITE })]
          })]
        })]
      }),
      new TableRow({
        children: [new TableCell({
          shading: { fill: "F8F8F8", type: ShadingType.CLEAR },
          borders: {
            top:    { style: BorderStyle.NONE, size: 0, color: WHITE },
            bottom: cellBorder().bottom,
            left:   { style: BorderStyle.SINGLE, size: 8, color: STEEL },
            right:  cellBorder().right,
          },
          margins: { top: 120, bottom: 120, left: 200, right: 200 },
          width: { size: 9360, type: WidthType.DXA },
          children: bodyLines
        })]
      })
    ]
  });
}

function starItem(label, text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [600, 8760],
    rows: [new TableRow({
      children: [
        new TableCell({
          borders: noBorder(),
          shading: { fill: GOLD, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 600, type: WidthType.DXA },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "★", font: "Arial", size: 24, color: WHITE, bold: true })]
          })]
        }),
        new TableCell({
          borders: { top: noBorder().top, bottom: cellBorder().bottom, left: noBorder().left, right: noBorder().right },
          shading: { fill: "FFFDF0", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 160, right: 120 },
          width: { size: 8760, type: WidthType.DXA },
          children: [
            new Paragraph({ children: [new TextRun({ text: label, font: "Arial", size: 21, bold: true, color: DARK_GOLD })] }),
            new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20, color: BODY_TEXT })] })
          ]
        })
      ]
    })]
  });
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 3 — MARKDOWN → DOCX PARSER
// ═════════════════════════════════════════════════════════════════════════

function parseInlineBold(text) {
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      runs.push(new TextRun({ text: part.slice(2, -2), font: "Arial", size: 21, bold: true, color: NAVY }));
    } else if (part) {
      runs.push(new TextRun({ text: part, font: "Arial", size: 21, color: BODY_TEXT }));
    }
  }
  return runs.length > 0 ? runs : [new TextRun({ text, font: "Arial", size: 21, color: BODY_TEXT })];
}

function parseMarkdown(text) {
  if (!text) return [body("No content generated for this phase.")];

  const elements = [];
  const lines = text.split('\n');
  let i = 0;
  let tableBuffer = [];
  let inTable = false;

  function flushTable() {
    if (tableBuffer.length < 2) { tableBuffer = []; inTable = false; return; }
    const headerCells = tableBuffer[0].split('|').map(c => c.trim()).filter(Boolean);
    const dataRows = tableBuffer
      .slice(2)
      .filter(r => r.trim())
      .map(r => r.split('|').map(c => c.trim()).filter(Boolean));
    if (headerCells.length === 0) { tableBuffer = []; inTable = false; return; }
    const total = 9360;
    const colW = Math.floor(total / headerCells.length);
    const colWidths = headerCells.map((_, idx) =>
      idx === headerCells.length - 1 ? total - colW * (headerCells.length - 1) : colW
    );
    const paddedRows = dataRows.map(row => {
      while (row.length < headerCells.length) row.push('');
      return row.slice(0, headerCells.length);
    });
    if (paddedRows.length > 0) elements.push(dataTable(headerCells, paddedRows, colWidths));
    tableBuffer = [];
    inTable = false;
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      tableBuffer.push(trimmed);
      i++; continue;
    }
    if (inTable) { flushTable(); elements.push(spacer(6)); }

    if (/^---+$/.test(trimmed) || /^═+$/.test(trimmed)) {
      elements.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY, space: 1 } },
        children: [], spacing: { before: 120, after: 120 }
      }));
      i++; continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(subhead2(trimmed.slice(4).replace(/\*\*/g, '').trim()));
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(subhead(trimmed.slice(3).replace(/\*\*/g, '').trim()));
      i++; continue;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(new Paragraph({
        children: [new TextRun({ text: trimmed.slice(2).replace(/\*\*/g, '').trim(), font: "Arial", size: 28, bold: true, color: NAVY })],
        spacing: { before: 280, after: 120 }
      }));
      i++; continue;
    }

    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.slice(2).trim();
      elements.push(new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({
          children: [new TableCell({
            borders: { top: noBorder().top, bottom: noBorder().bottom, right: noBorder().right, left: { style: BorderStyle.SINGLE, size: 12, color: STEEL } },
            shading: { fill: "F0F4FA", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 200, right: 200 },
            width: { size: 9360, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: quoteText, font: "Arial", size: 20, color: BODY_TEXT, italics: true })] })]
          })]
        })]
      }));
      i++; continue;
    }

    if (trimmed.startsWith('★') || trimmed.startsWith('**★')) {
      const cleaned = trimmed.replace(/\*\*/g, '').replace(/^★\s*\d*\.?\s*/, '').trim();
      const colonIdx = cleaned.indexOf(':');
      if (colonIdx > 0) {
        elements.push(starItem(cleaned.slice(0, colonIdx).trim(), cleaned.slice(colonIdx + 1).trim()));
      } else {
        elements.push(new Paragraph({
          children: [
            new TextRun({ text: "★  ", font: "Arial", size: 21, bold: true, color: GOLD }),
            new TextRun({ text: cleaned, font: "Arial", size: 21, bold: true, color: NAVY })
          ],
          spacing: { before: 120, after: 60 }
        }));
      }
      i++; continue;
    }

    if (trimmed.match(/^[-—•*]\s+/)) {
      const txt = trimmed.replace(/^[-—•*]\s+/, '').replace(/\*\*/g, '').trim();
      const isBoldTitle = trimmed.includes('**') && trimmed.indexOf('**', 2) > 2;
      if (isBoldTitle) {
        elements.push(new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { before: 120, after: 40 },
          children: [new TextRun({ text: txt.replace(/\*\*(.+?)\*\*/g, '$1'), font: "Arial", size: 21, bold: true, color: NAVY })]
        }));
      } else {
        elements.push(bullet(txt));
      }
      i++; continue;
    }

    if (trimmed.match(/^\d+\.\s+/)) {
      const txt = trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim();
      elements.push(new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: txt, font: "Arial", size: 21, color: BODY_TEXT })]
      }));
      i++; continue;
    }

    if (trimmed === '') { elements.push(spacer(4)); i++; continue; }

    if (trimmed) {
      elements.push(new Paragraph({ children: parseInlineBold(trimmed), spacing: { before: 60, after: 60 } }));
    }
    i++;
  }

  if (inTable) flushTable();
  return elements;
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 4 — FIXED PAGES
// ═════════════════════════════════════════════════════════════════════════

function coverPage(config) {
  const { agentName, niche, subniche, market, idealClient } = config;
  return [
    new Paragraph({ children: [], spacing: { before: 1800, after: 0 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "NURTURINK  ·  pipeline.nurturink.com", font: "Arial", size: 20, color: "888888", allCaps: true, characterSpacing: 80 })] }),
    spacer(20),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "DREAM 100", font: "Arial", size: 72, bold: true, color: NAVY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PARTNER BLUEPRINT", font: "Arial", size: 44, bold: true, color: STEEL })] }),
    spacer(16),
    new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 1 } }, children: [], spacing: { before: 0, after: 200 } }),
    spacer(8),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: niche, font: "Arial", size: 28, bold: true, color: NAVY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subniche, font: "Arial", size: 24, color: BODY_TEXT })] }),
    spacer(6),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: market, font: "Arial", size: 26, bold: true, color: STEEL })] }),
    spacer(32),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Prepared for: ${agentName}`, font: "Arial", size: 22, italics: true, color: BODY_TEXT })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Ideal Client: ${idealClient}`, font: "Arial", size: 20, color: "666666" })] }),
    spacer(48),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D5E8F0", space: 1 } },
      spacing: { before: 200, after: 0 },
      children: [new TextRun({ text: "7 Phases  ·  Dream 10 Partners  ·  90-Day Launch System  ·  Complete Script Suite", font: "Arial", size: 18, color: "888888" })]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

function disclaimerPage() {
  return [
    new Paragraph({ children: [], spacing: { before: 600, after: 0 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "IMPORTANT NOTICE", font: "Arial", size: 28, bold: true, color: NAVY, allCaps: true, characterSpacing: 60 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Before You Use This Report", font: "Arial", size: 22, italics: true, color: STEEL })] }),
    spacer(12),
    new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 1 } }, children: [], spacing: { before: 0, after: 200 } }),
    spacer(12),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({
        children: [new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 8, color: NAVY }, bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY }, left: { style: BorderStyle.SINGLE, size: 8, color: NAVY }, right: { style: BorderStyle.SINGLE, size: 8, color: NAVY } },
          shading: { fill: "F0F4F9", type: ShadingType.CLEAR },
          margins: { top: 280, bottom: 280, left: 400, right: 400 },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 }, children: [new TextRun({ text: "AI-Assisted Research — Your Judgment Comes First", font: "Arial", size: 24, bold: true, color: NAVY })] }),
            new Paragraph({ spacing: { before: 0, after: 160 }, children: [new TextRun({ text: "This report was generated with the assistance of artificial intelligence and is designed to give you a strategic head start — not a finished plan you can follow without thinking.", font: "Arial", size: 21, color: BODY_TEXT })] }),
            new Paragraph({ children: [new TextRun({ text: "Before taking any action based on this report, please:", font: "Arial", size: 21, bold: true, color: NAVY })] }),
          ]
        })]
      })]
    }),
    spacer(8),
    ...[
      ["Verify every business name and contact", "Companies move, close, rebrand, and change focus. Any specific business named in this report should be independently verified as currently active before you invest time in outreach."],
      ["Trust your local knowledge over the report", "You know your market. If a partner type or strategy doesn't fit the way your local market actually works right now, trust what you know. This report is a framework — not a mandate."],
      ["Apply your professional judgment to every recommendation", "The strategies and approaches in this report are grounded in proven referral-building principles. But every relationship is different. Adapt accordingly."],
      ["Use the scripts as starting points, not scripts", "The outreach scripts and email templates are guides. Read each one, extract the idea behind it, and rewrite it the way you would actually say it."],
      ["The production math is illustrative, not a guarantee", "The financial projections are based on reasonable assumptions. They are meant to show you what's possible with consistent execution — not to predict your income."],
    ].flatMap(([title, desc]) => [
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 120, after: 40 }, children: [new TextRun({ text: title, font: "Arial", size: 21, bold: true, color: NAVY })] }),
      new Paragraph({ spacing: { before: 0, after: 100 }, indent: { left: 540 }, children: [new TextRun({ text: desc, font: "Arial", size: 21, color: BODY_TEXT })] }),
    ]),
    spacer(16),
    new Paragraph({ alignment: AlignmentType.CENTER, shading: { fill: NAVY, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "  The best tool in any referral system is still you.  ", font: "Arial", size: 22, bold: true, color: WHITE, italics: true })] }),
    spacer(6),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "This report gives you a map. You still have to make the calls, write the notes, show up to the meetings, and do the work that no AI can do for you.", font: "Arial", size: 20, color: "666666", italics: true })] }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

function howToUsePage() {
  return [
    ...sectionHeader("How to Use This Blueprint"),
    spacer(8),
    body("This document is your complete system for building a consistent, self-sustaining referral network. Everything you need — the partners, the strategy, the scripts, and the calendar — is inside."),
    ...[
      "This blueprint is organized into 7 phases. Read it once end-to-end before taking any action.",
      "Phase 3 contains your Dream 10 priority list. Start there after reading.",
      "Phases 4 and 5 give you your conversation strategy. Study them before your first outreach.",
      "Phase 6 contains your complete script suite — customize each script with the specific partner's name and details before sending.",
      "Phase 7 gives you the week-by-week 90-day execution plan. Print Part A and put it on your desk.",
      "The handwritten note (Script 4, Phase 6) always goes first — before email, before calls. Never skip it.",
      "One new Tier 1 partner every 2 weeks is a sustainable pace. Don't rush the trust-building.",
    ].map(t => new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: t, font: "Arial", size: 21, color: BODY_TEXT })] })),
    spacer(16),
    calloutBox("The Core Principle", "Give value first — every time, without exception. The goal of every touchpoint in this system is to make your referral partner look good to their clients. Referrals follow naturally when people trust that you'll make them proud."),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

function researchPromptPage(config) {
  const { market, niche } = config;
  return [
    ...sectionHeader("Go Deeper", "Your Local Research Prompt"),
    spacer(8),
    body(`The partner types in this report are proven. The next step is finding the specific people in ${market} who fill those roles right now.`),
    spacer(10),
    calloutBox("Why do this research yourself?", "AI-generated reports identify the categories and strategies. But the actual names — the lender who just funded a flip in your target neighborhood, the CPA who spoke at last month's investor meeting — those require live web research."),
    spacer(12),
    subhead("Copy and run this prompt in Perplexity, Claude, or ChatGPT:"),
    spacer(6),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({
        children: [new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 6, color: STEEL }, bottom: { style: BorderStyle.SINGLE, size: 6, color: STEEL }, left: { style: BorderStyle.SINGLE, size: 12, color: GOLD }, right: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY } },
          shading: { fill: "F8F8F8", type: ShadingType.CLEAR },
          margins: { top: 200, bottom: 200, left: 240, right: 240 },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            body(`I am a ${niche} specialist in ${market}. I am building a Dream 100 referral partner network and need help finding currently active, real local businesses and professionals in each of the following categories.`),
            ...["Currently active (verified via website, LinkedIn, or recent online activity)", "Known to work with real estate investors or high-net-worth clients", "Reachable through professional outreach (website, LinkedIn, or business listing)"].map(t => bullet(t)),
            spacer(8),
            new Paragraph({ children: [new TextRun({ text: "Categories to research:", font: "Arial", size: 20, bold: true, color: NAVY })] }),
            ...["Hard money / private money lenders", "CPAs or tax strategists specializing in real estate investors", "Real estate attorneys", "Title and escrow officers with high investor transaction volume", "General contractors active on fix-and-flip projects", "Probate and estate attorneys", "Wholesale real estate operators", "Property managers serving investor portfolios", "Commercial or business bankers", "Insurance brokers writing builder's risk policies"]
              .map(t => new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: t, font: "Arial", size: 20, color: BODY_TEXT })] })),
            spacer(8),
            body("For each result: business name, website or LinkedIn URL, area served, and one sentence on why they are relevant."),
          ]
        })]
      })]
    }),
    spacer(16),
    subhead2("Tips for best results:"),
    ...["Use Perplexity — it searches the live web and cites sources.", "Cross-reference on BiggerPockets for stronger local signals.", "LinkedIn is your best verification tool."].map(t => bullet(t)),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 5 — PHASE SECTION BUILDERS
// ═════════════════════════════════════════════════════════════════════════

function buildPhaseSection(phaseNum, _title, subtitle, intro, markdownText) {
  return [
    ...sectionHeader(phaseNum, subtitle),
    body(intro),
    spacer(10),
    ...parseMarkdown(markdownText),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

function buildSearchSection(searchText) {
  return [
    ...sectionHeader("Phase 3.5", "Local Partner Research — Live Web Results"),
    body("The following businesses were identified through live web research based on your market and the Dream 10 partner categories. Verify each before outreach — details change."),
    spacer(10),
    infoBox("Confidence levels: High = verified active via website/LinkedIn. Medium = appears active. Low = verify before outreach."),
    spacer(10),
    ...parseMarkdown(searchText),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 6 — DOCUMENT ASSEMBLY
// ═════════════════════════════════════════════════════════════════════════

function assembleDocument(config, phaseResults) {
  const p = phaseResults;

  const phaseIntros = {
    "1": "Your ideal client has a predictable business lifecycle. Every major event below represents a window where a trusted professional sees them before they contact a real estate agent. These are your entry points.",
    "2": "Upstream partners see your client 3–12 months before a transaction. Side-stream partners interact during the transaction itself. Both create referral opportunities — but upstream partners are your highest-priority targets.",
    "3": "Your Dream 10 is the prioritized shortlist of partner types to target. Work through them in order. Build one solid Tier 1 relationship at a time before moving to the next.",
    "4a": "The fastest way to build a referral relationship is to give value before you ever ask for anything. Each Value Strategy Card below identifies the gap in your partner's client service and gives you a specific, tangible asset to lead with.",
    "4b": "Continuing your Value Strategy Cards for partners 4–6, plus the Value Manifesto — your positioning statement when meeting new referral partners in person.",
    "5": "You will encounter resistance when building referral partnerships. The objections below are not personal — they are predictable. Each one has a specific fear underneath it. Know the fear, and your response becomes natural.",
    "6": "These scripts are your full communication toolkit. Customize the bracketed fields with each specific partner's name, business, and details before sending.",
    "7a": "This is your execution system. Part A is your week-by-week 90-day sequence for activating a new Tier 1 partner. Part B is your relationship tracker template.",
    "7b": "Part C is your quarterly 12-month calendar. Part D is the production math — showing you what consistent execution actually translates to in closed volume.",
  };

  return [
    ...coverPage(config),
    ...disclaimerPage(),
    ...howToUsePage(),
    ...(p["1"]   ? buildPhaseSection("Phase 1",  "", "Lifecycle Trigger Mapping",                        phaseIntros["1"],  p["1"])  : []),
    ...(p["2"]   ? buildPhaseSection("Phase 2",  "", "Upstream & Side-stream Partner Mapping",            phaseIntros["2"],  p["2"])  : []),
    ...(p["3"]   ? buildPhaseSection("Phase 3",  "", "Dream 10 Tier Ranking & Shortlist",                 phaseIntros["3"],  p["3"])  : []),
    ...(p["3.5"] ? buildSearchSection(p["3.5"]) : []),
    ...(p["4a"]  ? buildPhaseSection("Phase 4a", "", "Value Strategy Cards — Partners 1–3",               phaseIntros["4a"], p["4a"]) : []),
    ...(p["4b"]  ? buildPhaseSection("Phase 4b", "", "Value Strategy Cards — Partners 4–6 + Manifesto",   phaseIntros["4b"], p["4b"]) : []),
    ...(p["5"]   ? buildPhaseSection("Phase 5",  "", "Objection Anticipation & Response Prep",            phaseIntros["5"],  p["5"])  : []),
    ...(p["6"]   ? buildPhaseSection("Phase 6",  "", "Complete Outreach Script Suite",                    phaseIntros["6"],  p["6"])  : []),
    ...(p["7a"]  ? buildPhaseSection("Phase 7a", "", "90-Day Plan + Relationship Tracker",                phaseIntros["7a"], p["7a"]) : []),
    ...(p["7b"]  ? buildPhaseSection("Phase 7b", "", "12-Month Calendar + Production Math",               phaseIntros["7b"], p["7b"]) : []),
    ...researchPromptPage(config),
    spacer(16),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 }, bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } },
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: "Build the relationships. Deliver the value. Trust the system.", font: "Arial", size: 26, bold: true, color: NAVY, italics: true })]
    }),
    spacer(8),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `NurturInk  ·  pipeline.nurturink.com  ·  Generated for ${config.agentName}  ·  ${config.market}`, font: "Arial", size: 18, color: "888888" })]
    })
  ];
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 7 — DOCUMENT WRAPPER + NUMBERING/STYLES
// ═════════════════════════════════════════════════════════════════════════

function buildDocumentShell(config, children) {
  const { agentName, niche, market } = config;

  return new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 300 } } } }]
        },
        {
          reference: "numbers",
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 300 } } } }]
        }
      ]
    },
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: "Arial", color: NAVY },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Arial", color: STEEL },
          paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 } }
      ]
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D5E8F0", space: 1 } },
            spacing: { before: 0, after: 120 },
            children: [new TextRun({ text: `DREAM 100 PARTNER BLUEPRINT  ·  ${niche}  ·  ${market}  ·  ${agentName}`, font: "Arial", size: 16, color: "888888" })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D5E8F0", space: 1 } },
            spacing: { before: 120, after: 0 },
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: "NurturInk  ·  pipeline.nurturink.com", font: "Arial", size: 16, color: "888888" }),
              new TextRun({ text: "\tPage ", font: "Arial", size: 16, color: "888888" }),
            ]
          })]
        })
      },
      children
    }]
  });
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 8 — PUBLIC API
// ═════════════════════════════════════════════════════════════════════════

export async function buildReport(config, phaseResults) {
  const resolvedConfig = {
    agentName:   config.agentName   || "Agent",
    niche:       config.niche       || "Real Estate Specialist",
    subniche:    config.subniche    || "",
    market:      config.market      || "Your Market",
    idealClient: config.idealClient || "High Net Worth Investors",
  };

  const children = assembleDocument(resolvedConfig, phaseResults || {});
  const doc = buildDocumentShell(resolvedConfig, children);
  return await Packer.toBuffer(doc);
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 9 — BASE44 DENO HANDLER
// ═════════════════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { config, phaseResults } = body;

    if (!config || !phaseResults) {
      return Response.json({ error: "Missing config or phaseResults in request body" }, { status: 400 });
    }

    const buffer = await buildReport(config, phaseResults);
    const filename = `Dream100_Blueprint_${(config.agentName || "Agent").replace(/\s+/g, "_")}.docx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.byteLength.toString(),
      }
    });

  } catch (err) {
    console.error("exportToWord error:", err);
    return Response.json({ error: err.message || "Failed to build document" }, { status: 500 });
  }
});