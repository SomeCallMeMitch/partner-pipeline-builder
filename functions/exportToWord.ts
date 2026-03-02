/**
 * NurturInk Dream 100 Blueprint — DOCX Builder (Deno / Base44)
 * File: functions/exportToWord.ts
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

const bodyText = (text) => new Paragraph({
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

// Smart column width calculation — proportional to content length
function calcColumnWidths(headers, rows, totalWidth = 9360) {
  const minColWidth = 900; // minimum ~0.625 inches

  // Sample content length for each column (header + first few data rows)
  const avgLengths = headers.map((h, i) => {
    const dataLens = rows.slice(0, 8).map(r => (r[i] || '').length);
    const avgData = dataLens.length > 0 ? dataLens.reduce((a, b) => a + b, 0) / dataLens.length : 0;
    return Math.max(h.length, avgData);
  });

  const totalLen = avgLengths.reduce((a, b) => a + b, 0) || 1;
  const available = totalWidth - (minColWidth * headers.length);

  if (available <= 0) {
    // All columns at minimum width
    const colW = Math.floor(totalWidth / headers.length);
    return headers.map((_, i) => i === headers.length - 1 ? totalWidth - colW * (headers.length - 1) : colW);
  }

  const widths = avgLengths.map(len => minColWidth + Math.floor((len / totalLen) * available));

  // Adjust last column to account for rounding
  const sum = widths.reduce((a, b) => a + b, 0);
  widths[widths.length - 1] += (totalWidth - sum);

  return widths;
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
            new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 21, color: BODY_TEXT })] })
          ]
        })
      ]
    })]
  });
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 3 — MARKDOWN → DOCX PARSER (IMPROVED)
// ═════════════════════════════════════════════════════════════════════════

// Parse inline formatting: **bold**, *italic*, ***bold italic***, and [links](url)
function parseInlineFormatting(text) {
  // Strip markdown links but keep the text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  const runs = [];
  // Match ***bold italic***, **bold**, *italic*, or plain text
  const pattern = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      if (plain) runs.push(new TextRun({ text: plain, font: "Arial", size: 21, color: BODY_TEXT }));
    }

    const token = match[0];
    if (token.startsWith('***') && token.endsWith('***')) {
      // Bold + italic
      runs.push(new TextRun({ text: token.slice(3, -3), font: "Arial", size: 21, bold: true, italics: true, color: NAVY }));
    } else if (token.startsWith('**') && token.endsWith('**')) {
      // Bold
      runs.push(new TextRun({ text: token.slice(2, -2), font: "Arial", size: 21, bold: true, color: NAVY }));
    } else if (token.startsWith('*') && token.endsWith('*')) {
      // Italic
      runs.push(new TextRun({ text: token.slice(1, -1), font: "Arial", size: 21, italics: true, color: BODY_TEXT }));
    }

    lastIndex = match.index + token.length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) runs.push(new TextRun({ text: remaining, font: "Arial", size: 21, color: BODY_TEXT }));
  }

  return runs.length > 0 ? runs : [new TextRun({ text, font: "Arial", size: 21, color: BODY_TEXT })];
}

function parseMarkdown(text) {
  if (!text) return [bodyText("No content generated for this phase.")];

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

    const paddedRows = dataRows.map(row => {
      while (row.length < headerCells.length) row.push('');
      return row.slice(0, headerCells.length);
    });

    // Smart column widths based on content
    const colWidths = calcColumnWidths(headerCells, paddedRows);

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

    // ── Multi-line blockquote accumulator ──────────────────────────────
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        const lineText = lines[i].trim().replace(/^>\s?/, '').trim();
        if (lineText) quoteLines.push(lineText);
        i++;
      }
      if (quoteLines.length > 0) {
        elements.push(new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: {
                top:    noBorder().top,
                bottom: noBorder().bottom,
                right:  noBorder().right,
                left:   { style: BorderStyle.SINGLE, size: 12, color: STEEL }
              },
              shading: { fill: "F0F4FA", type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 200, right: 200 },
              width: { size: 9360, type: WidthType.DXA },
              children: quoteLines.map((ql, idx) => new Paragraph({
                children: [new TextRun({ text: ql, font: "Arial", size: 20, color: BODY_TEXT, italics: true })],
                spacing: { before: idx === 0 ? 0 : 10, after: idx === quoteLines.length - 1 ? 0 : 10 }
              }))
            })]
          })]
        }));
      }
      continue;
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

    // ── Bullet points — now with proper inline formatting ──────────────
    if (trimmed.match(/^[-—•*]\s+/)) {
      const rawTxt = trimmed.replace(/^[-—•*]\s+/, '').trim();
      // Parse inline bold/italic instead of stripping them
      const inlineRuns = parseInlineFormatting(rawTxt);
      elements.push(new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { before: 40, after: 40 },
        children: inlineRuns
      }));
      i++; continue;
    }

    // ── Numbered list — now with proper inline formatting ──────────────
    if (trimmed.match(/^\d+\.\s+/)) {
      const rawTxt = trimmed.replace(/^\d+\.\s+/, '').trim();
      const inlineRuns = parseInlineFormatting(rawTxt);
      elements.push(new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: inlineRuns
      }));
      i++; continue;
    }

    if (trimmed === '') { elements.push(spacer(4)); i++; continue; }

    // ── Objection section labels — render as styled steel-blue sub-headers
    const OBJECTION_LABELS = [
      "Conversational Response",
      "Follow-Up Question",
      "Why This Objection Comes Up",
      "Response",
      "Follow-Up",
    ];
    if (OBJECTION_LABELS.some(lbl => trimmed === lbl || trimmed.startsWith(lbl + " "))) {
      elements.push(new Paragraph({
        children: [
          new TextRun({ text: "▸  ", font: "Arial", size: 19, bold: true, color: GOLD }),
          new TextRun({ text: trimmed, font: "Arial", size: 19, bold: true, color: STEEL, italics: true }),
        ],
        spacing: { before: 140, after: 16 },
      }));
      i++; continue;
    }

    // ── Default paragraph with inline formatting ──────────────────────
    if (trimmed) {
      elements.push(new Paragraph({ children: parseInlineFormatting(trimmed), spacing: { before: 60, after: 60 } }));
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
      children: [new TextRun({ text: "Quick Start Guide  ·  7 Phases  ·  Dream 10 Partners  ·  90-Day Launch System  ·  Complete Script Suite", font: "Arial", size: 18, color: "888888" })]
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
    bodyText("This document is your complete system for building a consistent, self-sustaining referral network. Everything you need — the partners, the strategy, the scripts, and the calendar — is inside."),
    ...[
      "This blueprint is organized into 7 phases. Start with the Quick Start page that follows, then read each phase when you're ready.",
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
  const { market, niche, idealClient } = config;
  return [
    ...sectionHeader("Go Deeper", "Your Local Research Prompt"),
    spacer(8),
    bodyText(`The partner types in this report are proven. The next step is finding the specific people in ${market} who fill those roles right now.`),
    spacer(10),
    calloutBox("Why do this research yourself?", "AI-generated reports identify the categories and strategies. But the actual names — the advisor who served a client last month, the attorney who spoke at a local event — those require live web research."),
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
            bodyText(`I am a ${niche} specialist in ${market}. My ideal client is: ${idealClient}. I am building a Dream 100 referral partner network and need help finding currently active, real local businesses and professionals in each of the following categories.`),
            ...["Currently active (verified via website, LinkedIn, or recent online activity)", `Relevant to the ${niche} niche and the ${idealClient} client profile`, "Reachable through professional outreach (website, LinkedIn, or business listing)"].map(t => bullet(t)),
            spacer(8),
            new Paragraph({ children: [new TextRun({ text: "Categories to research:", font: "Arial", size: 20, bold: true, color: NAVY })] }),
            ...[
              "Estate planning attorneys or trust attorneys",
              "Fee-only financial planners or wealth advisors",
              `CPAs or tax strategists serving ${niche} clients`,
              `Attorneys relevant to ${niche} transactions`,
              `Title and escrow officers experienced with ${niche} transactions`,
              `Upstream professionals who regularly see ${niche} clients before a transaction (e.g. senior care advisors, divorce attorneys, relocation specialists, concierge physicians — pick what fits this niche)`,
              "Financial advisors or wealth managers serving this demographic",
              `Insurance professionals relevant to ${niche} clients`
            ].map(t => new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text: t, font: "Arial", size: 20, color: BODY_TEXT })] })),
            spacer(8),
            bodyText("For each result: business name, website or LinkedIn URL, area served, and one sentence on why they are relevant to this niche."),
          ]
        })]
      })]
    }),
    spacer(16),
    subhead2("Tips for best results:"),
    ...[
      "Use Perplexity — it searches the live web and cites sources.",
      "LinkedIn is your best verification tool for confirming active professionals.",
      "Cross-reference with local bar associations, financial planning directories, or chamber of commerce listings.",
    ].map(t => bullet(t)),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 5 — PHASE SECTION BUILDERS
// ═════════════════════════════════════════════════════════════════════════

function buildPhaseSection(phaseNum, _title, subtitle, intro, markdownText) {
  return [
    ...sectionHeader(phaseNum, subtitle),
    bodyText(intro),
    spacer(10),
    ...parseMarkdown(markdownText),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 5B — QUICK START PAGE
// ═════════════════════════════════════════════════════════════════════════

function quickStartPage(config) {
  const { agentName } = config;
  const name = agentName || "you";
  return [
    new Paragraph({ children: [], spacing: { before: 400, after: 0 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "START HERE", font: "Arial", size: 36, bold: true, color: NAVY, allCaps: true, characterSpacing: 80 })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Your 3 Actions This Week", font: "Arial", size: 26, bold: true, color: STEEL })]
    }),
    spacer(8),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 1 } },
      children: [], spacing: { before: 0, after: 200 }
    }),
    spacer(8),
    new Paragraph({
      children: [new TextRun({
        text: "This blueprint is comprehensive — 7 phases, 50+ pages. You don't need to absorb it all at once. Here's exactly what to do with it this week.",
        font: "Arial", size: 22, color: BODY_TEXT, italics: true
      })],
      spacing: { before: 0, after: 200 }
    }),

    // ── Action 1 ──
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [800, 8560],
      rows: [new TableRow({
        children: [
          new TableCell({
            borders: noBorder(),
            shading: { fill: NAVY, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 80, right: 80 },
            verticalAlign: VerticalAlign.TOP,
            width: { size: 800, type: WidthType.DXA },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "1", font: "Arial", size: 32, bold: true, color: WHITE })]
            })]
          }),
          new TableCell({
            borders: { top: noBorder().top, bottom: { style: BorderStyle.SINGLE, size: 2, color: MID_GRAY }, left: noBorder().left, right: noBorder().right },
            margins: { top: 140, bottom: 160, left: 240, right: 120 },
            width: { size: 8560, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: "Read Phase 3 — Your Dream 10 List", font: "Arial", size: 24, bold: true, color: NAVY })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: "These are the 10 partner types that will send you the most referrals. Flip to Phase 3 now and circle your top 3. Ask yourself: ", font: "Arial", size: 21, color: BODY_TEXT }),
                new TextRun({ text: "\"Which of these do I already know someone in?\"", font: "Arial", size: 21, color: NAVY, bold: true, italics: true })]
              }),
              new Paragraph({
                spacing: { before: 60, after: 0 },
                children: [new TextRun({ text: "⏱ Time: 10 minutes", font: "Arial", size: 19, color: MID_GRAY })]
              })
            ]
          })
        ]
      })]
    }),
    spacer(10),

    // ── Action 2 ──
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [800, 8560],
      rows: [new TableRow({
        children: [
          new TableCell({
            borders: noBorder(),
            shading: { fill: GOLD, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 80, right: 80 },
            verticalAlign: VerticalAlign.TOP,
            width: { size: 800, type: WidthType.DXA },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "2", font: "Arial", size: 32, bold: true, color: WHITE })]
            })]
          }),
          new TableCell({
            borders: { top: noBorder().top, bottom: { style: BorderStyle.SINGLE, size: 2, color: MID_GRAY }, left: noBorder().left, right: noBorder().right },
            shading: { fill: "FFFDF0", type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 160, left: 240, right: 120 },
            width: { size: 8560, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: "Write One Handwritten Note", font: "Arial", size: 24, bold: true, color: DARK_GOLD })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: "Use Script 4 from Phase 6. Pick the #1 partner type from your Dream 10 list. Google a specific person in that role in your market. Write 3 sentences by hand. Mail it today.", font: "Arial", size: 21, color: BODY_TEXT })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: "This is the move that separates you from every other agent who sends an email. One real note in a real envelope — it's how every relationship in this system begins.", font: "Arial", size: 21, color: BODY_TEXT, italics: true })]
              }),
              new Paragraph({
                spacing: { before: 60, after: 0 },
                children: [new TextRun({ text: "⏱ Time: 5 minutes to write, 1 stamp to mail", font: "Arial", size: 19, color: MID_GRAY })]
              })
            ]
          })
        ]
      })]
    }),
    spacer(10),

    // ── Action 3 ──
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [800, 8560],
      rows: [new TableRow({
        children: [
          new TableCell({
            borders: noBorder(),
            shading: { fill: STEEL, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 80, right: 80 },
            verticalAlign: VerticalAlign.TOP,
            width: { size: 800, type: WidthType.DXA },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "3", font: "Arial", size: 32, bold: true, color: WHITE })]
            })]
          }),
          new TableCell({
            borders: { top: noBorder().top, bottom: { style: BorderStyle.SINGLE, size: 2, color: MID_GRAY }, left: noBorder().left, right: noBorder().right },
            margins: { top: 140, bottom: 160, left: 240, right: 120 },
            width: { size: 8560, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: "Block 30 Minutes on Friday", font: "Arial", size: 24, bold: true, color: NAVY })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: "Open Phase 7a. Print the 90-day plan. Mark Week 1 actions on your calendar. Set a recurring 30-minute Friday block labeled \"Dream 10 — Weekly Actions.\" That weekly habit is the engine.", font: "Arial", size: 21, color: BODY_TEXT })]
              }),
              new Paragraph({
                spacing: { before: 60, after: 0 },
                children: [new TextRun({ text: "⏱ Time: 30 minutes, once", font: "Arial", size: 19, color: MID_GRAY })]
              })
            ]
          })
        ]
      })]
    }),
    spacer(20),

    // ── Bottom message ──
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({
        children: [new TableCell({
          borders: {
            top:    { style: BorderStyle.SINGLE, size: 6, color: NAVY },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY },
            left:   { style: BorderStyle.SINGLE, size: 6, color: NAVY },
            right:  { style: BorderStyle.SINGLE, size: 6, color: NAVY },
          },
          shading: { fill: "F0F4F9", type: ShadingType.CLEAR },
          margins: { top: 200, bottom: 200, left: 300, right: 300 },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 100 },
              children: [new TextRun({
                text: "That's it for this week.",
                font: "Arial", size: 24, bold: true, color: NAVY
              })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 0 },
              children: [new TextRun({
                text: "Everything else in this blueprint supports these three moves. Read the phases when you're ready. But start with the note. Start today.",
                font: "Arial", size: 21, color: BODY_TEXT
              })]
            }),
          ]
        })]
      })]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 5C — NURTURINK CTA PAGE
// ═════════════════════════════════════════════════════════════════════════

function nurturInkCTAPage(config) {
  const { agentName } = config;
  return [
    new Paragraph({ children: [], spacing: { before: 600, after: 0 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "THE HANDWRITTEN ADVANTAGE", font: "Arial", size: 32, bold: true, color: NAVY, allCaps: true, characterSpacing: 60 })]
    }),
    spacer(8),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 1 } },
      children: [], spacing: { before: 0, after: 200 }
    }),
    spacer(8),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text: "Throughout this blueprint, you saw the same strategy appear again and again:",
        font: "Arial", size: 22, color: BODY_TEXT,
      })],
      spacing: { before: 0, after: 80 }
    }),
    spacer(4),

    // Repeating touchpoints callout
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({
        children: [new TableCell({
          borders: {
            top:    { style: BorderStyle.SINGLE, size: 4, color: GOLD },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD },
            left:   { style: BorderStyle.SINGLE, size: 12, color: GOLD },
            right:  { style: BorderStyle.SINGLE, size: 4, color: GOLD },
          },
          shading: { fill: "FFFDF0", type: ShadingType.CLEAR },
          margins: { top: 200, bottom: 200, left: 300, right: 300 },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 100 },
              children: [new TextRun({ text: "Where Handwritten Notes Appear in Your Blueprint", font: "Arial", size: 22, bold: true, color: DARK_GOLD })]
            }),
            ...[
              "Week 1 of your 90-day plan — the first touchpoint with every new partner",
              "Script 4 — the most important script in your entire outreach suite",
              "Referral thank-you notes — sent within 24 hours of every referral",
              "Quarterly check-ins — the gesture that keeps relationships warm",
              "Partner milestones — birthdays, business anniversaries, achievements",
            ].map(t => new Paragraph({
              numbering: { reference: "bullets", level: 0 },
              spacing: { before: 40, after: 40 },
              children: [new TextRun({ text: t, font: "Arial", size: 21, color: BODY_TEXT })]
            })),
          ]
        })]
      })]
    }),
    spacer(12),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [new TextRun({
        text: "The handwritten note is the single highest-leverage touchpoint at every stage of the referral relationship. It's what makes your outreach feel personal in a world of automated drip campaigns.",
        font: "Arial", size: 22, color: BODY_TEXT, italics: true,
      })]
    }),
    spacer(8),

    // NurturInk pitch
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({
        children: [new TableCell({
          borders: {
            top:    { style: BorderStyle.SINGLE, size: 6, color: NAVY },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY },
            left:   { style: BorderStyle.SINGLE, size: 6, color: NAVY },
            right:  { style: BorderStyle.SINGLE, size: 6, color: NAVY },
          },
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          margins: { top: 240, bottom: 240, left: 360, right: 360 },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 80 },
              children: [new TextRun({ text: "NurturInk", font: "Arial", size: 28, bold: true, color: GOLD })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 120 },
              children: [new TextRun({ text: "Handwritten notes. Real pen. Your signature. Mailed for you.", font: "Arial", size: 22, color: WHITE, italics: true })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 100 },
              children: [new TextRun({
                text: `${agentName}, this blueprint calls for dozens of handwritten touchpoints over the next 12 months. NurturInk makes that effortless — write your message once, and we handle the handwriting, envelopes, stamps, and mailing. Your partners receive a real card in a real envelope, written in real ink.`,
                font: "Arial", size: 21, color: WHITE,
              })]
            }),
            spacer(8),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 0 },
              children: [new TextRun({ text: "nurturink.com", font: "Arial", size: 24, bold: true, color: GOLD })]
            }),
          ]
        })]
      })]
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ═════════════════════════════════════════════════════════════════════════
// SECTION 6 — DOCUMENT ASSEMBLY
// ═════════════════════════════════════════════════════════════════════════

function assembleDocument(config, phaseResults) {
  const p = phaseResults;

  const { agentName, niche, market, idealClient } = config;
  const phaseIntros = {
    "1": `In the ${niche} market in ${market}, your ideal client — ${idealClient} — has a predictable lifecycle. Every major event below represents a window where a trusted professional sees them before they contact a real estate agent. These are your entry points.`,
    "2": `Upstream partners see your ${niche} client 3–12 months before a transaction. Side-stream partners interact during the transaction itself. Both create referral opportunities — but upstream partners are ${agentName}'s highest-priority targets.`,
    "3": "Your Dream 10 is the prioritized shortlist of partner types to target. Work through them in order. Build one solid Tier 1 relationship at a time before moving to the next.",
    "4a": "The fastest way to build a referral relationship is to give value before you ever ask for anything. Each Value Strategy Card below identifies the gap in your partner's client service and gives you a specific, tangible asset to lead with.",
    "4b": `Continuing your Value Strategy Cards for partners 4–6, plus ${agentName}'s Value Manifesto — your positioning statement when meeting new referral partners in person.`,
    "5": "You will encounter resistance when building referral partnerships. The objections below are not personal — they are predictable. Each one has a specific fear underneath it. Know the fear, and your response becomes natural.",
    "6": `These scripts are ${agentName}'s full communication toolkit. Customize the bracketed fields with each specific partner's name, business, and details before sending.`,
    "7a": "This is your execution system. Part A is your week-by-week 90-day sequence for activating a new Tier 1 partner. Part B is your relationship tracker template. Print Part A and put it on your desk.",
    "7b": `Part C is your quarterly 12-month calendar for maintaining active partnerships. Part D is the production math — showing what consistent execution in ${market} translates to in closed volume.`,
  };

  return [
    ...coverPage(config),
    ...disclaimerPage(),
    ...howToUsePage(),
    ...quickStartPage(config),
    ...(p["1"]   ? buildPhaseSection("Phase 1",  "", "Lifecycle Trigger Mapping",                        phaseIntros["1"],  p["1"])  : []),
    ...(p["2"]   ? buildPhaseSection("Phase 2",  "", "Upstream & Side-stream Partner Mapping",            phaseIntros["2"],  p["2"])  : []),
    ...(p["3"]   ? buildPhaseSection("Phase 3",  "", "Dream 10 Tier Ranking & Shortlist",                 phaseIntros["3"],  p["3"])  : []),
    ...(p["4a"]  ? buildPhaseSection("Phase 4a", "", "Value Strategy Cards — Partners 1–3",               phaseIntros["4a"], p["4a"]) : []),
    ...(p["4b"]  ? buildPhaseSection("Phase 4b", "", "Value Strategy Cards — Partners 4–6 + Manifesto",   phaseIntros["4b"], p["4b"]) : []),
    ...(p["5"]   ? buildPhaseSection("Phase 5",  "", "Objection Anticipation & Response Prep",            phaseIntros["5"],  p["5"])  : []),
    ...(p["6"]   ? buildPhaseSection("Phase 6",  "", "Complete Outreach Script Suite",                    phaseIntros["6"],  p["6"])  : []),
    ...(p["7a"]  ? buildPhaseSection("Phase 7a", "", "90-Day Plan + Relationship Tracker",                phaseIntros["7a"], p["7a"]) : []),
    ...(p["7b"]  ? buildPhaseSection("Phase 7b", "", "12-Month Calendar + Production Math",               phaseIntros["7b"], p["7b"]) : []),
    ...researchPromptPage(config),
    ...nurturInkCTAPage(config),
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

// Smart title case — doesn't capitalize small words like "in", "of", "and"
function smartTitleCase(str) {
  if (!str) return "";
  const smallWords = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "is", "nor", "of", "on", "or", "so", "the", "to", "up", "yet"]);
  return str.replace(/\b\w+/g, (word, index) => {
    if (index === 0 || !smallWords.has(word.toLowerCase())) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word.toLowerCase();
  });
}

export async function buildReport(config, phaseResults) {
  const resolvedConfig = {
    agentName:   config.agentName   ? smartTitleCase(config.agentName)  : "Agent",
    niche:       config.niche       ? smartTitleCase(config.niche)       : "Real Estate Specialist",
    subniche:    config.subniche    ? smartTitleCase(config.subniche)    : "",
    market:      config.market      ? smartTitleCase(config.market)      : "Your Market",
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