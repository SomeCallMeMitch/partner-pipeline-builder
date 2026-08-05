// src/utils/renderMarkdown.jsx
//
// A small, purpose-built markdown renderer for blueprint report content.
//
// Why not react-markdown: the reports are full of GFM tables, and GFM table
// support requires remark-gfm, which is not installed. Rather than add a
// dependency into the Base44 build, this handles exactly the subset the
// generator actually produces: headings, tables, bullets, numbered lists,
// bold/italic, horizontal rules, and paragraphs. Full control of table styling
// matters here because the tables are where the report either looks like a
// document or looks like a data dump.

import React from "react";

const C = {
  navy: "#1B2A4A",
  gold: "#C9973A",
  text: "#1A1A2E",
  muted: "#5A6278",
  border: "#DDD5C5",
  cream: "#FAF8F4",
  creamDark: "#F0EBE1",
  white: "#FFFFFF",
};

// ── Inline formatting: **bold**, *italic*, `code` ───────────────────────────
function inline(text, keyPrefix) {
  const out = [];
  let remaining = String(text ?? "");
  let k = 0;
  // Order matters: bold (**) before italic (*)
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;
  let lastIndex = 0;
  let m;
  while ((m = pattern.exec(remaining)) !== null) {
    if (m.index > lastIndex) out.push(remaining.slice(lastIndex, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(<strong key={`${keyPrefix}-b${k++}`} style={{ color: C.navy, fontWeight: 700 }}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      out.push(
        <code key={`${keyPrefix}-c${k++}`} style={{ background: C.creamDark, padding: "1px 5px", borderRadius: 4, fontSize: "0.92em" }}>
          {tok.slice(1, -1)}
        </code>
      );
    } else {
      out.push(<em key={`${keyPrefix}-i${k++}`}>{tok.slice(1, -1)}</em>);
    }
    lastIndex = m.index + tok.length;
  }
  if (lastIndex < remaining.length) out.push(remaining.slice(lastIndex));
  return out;
}

function splitRow(line) {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map(c => c.trim());
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every(c => /^:?-{2,}:?$/.test(c.trim()));
}

export default function Markdown({ text }) {
  if (!text) return null;
  const lines = String(text).split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;

  const flushParagraph = (buf) => {
    if (!buf.length) return;
    const joined = buf.join(" ").trim();
    if (joined) {
      blocks.push(
        <p key={`p${key++}`} style={{ fontSize: 15, lineHeight: 1.75, color: C.text, margin: "0 0 14px" }}>
          {inline(joined, `p${key}`)}
        </p>
      );
    }
    buf.length = 0;
  };

  let paraBuf = [];

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // Blank line ends a paragraph
    if (!line) { flushParagraph(paraBuf); i++; continue; }

    // Horizontal rule / separator bars the generator emits
    if (/^[-=]{3,}$/.test(line)) {
      flushParagraph(paraBuf);
      blocks.push(<hr key={`hr${key++}`} style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "22px 0" }} />);
      i++; continue;
    }

    // Heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushParagraph(paraBuf);
      const level = h[1].length;
      const sizes = { 1: 22, 2: 19, 3: 17, 4: 15.5, 5: 14.5, 6: 14 };
      blocks.push(
        <div key={`h${key++}`} style={{
          fontSize: sizes[level] || 15,
          fontWeight: 800,
          color: C.navy,
          lineHeight: 1.35,
          margin: level <= 2 ? "26px 0 12px" : "20px 0 10px",
        }}>
          {inline(h[2], `h${key}`)}
        </div>
      );
      i++; continue;
    }

    // Table: a run of lines beginning with |
    if (line.startsWith("|")) {
      flushParagraph(paraBuf);
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const rows = tableLines.map(splitRow).filter(r => !isSeparatorRow(r));
      if (rows.length) {
        const header = rows[0];
        const body = rows.slice(1);
        blocks.push(
          <div key={`t${key++}`} style={{ overflowX: "auto", margin: "0 0 18px", border: `1px solid ${C.border}`, borderRadius: 10 }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520 }}>
              <thead>
                <tr>
                  {header.map((cell, ci) => (
                    <th key={ci} style={{
                      textAlign: "left", padding: "10px 12px", fontSize: 12.5, fontWeight: 800,
                      color: C.white, background: C.navy, whiteSpace: "nowrap",
                    }}>
                      {inline(cell, `th${ci}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((r, ri) => (
                  <tr key={ri} style={{ background: ri % 2 ? C.cream : C.white }}>
                    {header.map((_, ci) => (
                      <td key={ci} style={{
                        padding: "10px 12px", fontSize: 13.5, lineHeight: 1.6,
                        color: C.text, borderTop: `1px solid ${C.border}`, verticalAlign: "top",
                      }}>
                        {inline(r[ci] ?? "", `td${ri}-${ci}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Bullet list
    if (/^[-*+]\s+/.test(line)) {
      flushParagraph(paraBuf);
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul${key++}`} style={{ margin: "0 0 16px", paddingLeft: 22 }}>
          {items.map((it, ii) => (
            <li key={ii} style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 6 }}>
              {inline(it, `li${ii}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+[.)]\s+/.test(line)) {
      flushParagraph(paraBuf);
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol${key++}`} style={{ margin: "0 0 16px", paddingLeft: 24 }}>
          {items.map((it, ii) => (
            <li key={ii} style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 6 }}>
              {inline(it, `oli${ii}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      flushParagraph(paraBuf);
      const quoted = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoted.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <div key={`q${key++}`} style={{
          borderLeft: `3px solid ${C.gold}`, paddingLeft: 16, margin: "0 0 16px",
          fontSize: 15, lineHeight: 1.75, color: C.muted, fontStyle: "italic",
        }}>
          {inline(quoted.join(" "), `qq${key}`)}
        </div>
      );
      continue;
    }

    paraBuf.push(line);
    i++;
  }
  flushParagraph(paraBuf);

  return <div>{blocks}</div>;
}
