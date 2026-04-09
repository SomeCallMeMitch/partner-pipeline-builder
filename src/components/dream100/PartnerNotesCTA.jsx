import React, { useState } from "react";
import { parsePhase6Notes } from "@/utils/parsePhase6";

const C = {
  navy: "#1B2A4A",
  gold: "#C9973A",
  goldLight: "#E8B55A",
  white: "#FFFFFF",
  muted: "#5A6278",
  border: "#DDD5C5",
  cream: "#FAF8F4",
};
const font = "'Sora', -apple-system, sans-serif";

export default function PartnerNotesCTA({ phase6Text, formData }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const notes = parsePhase6Notes(phase6Text);

  if (!notes) return null;

  const active = notes[activeIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.noteText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "24px", boxShadow: "0 2px 12px rgba(27,42,74,0.06)", marginTop: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: 8, fontFamily: font }}>
        Your handwritten notes are ready
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: font, marginBottom: 6, lineHeight: 1.4 }}>
        5 note versions — one per partner type
      </div>
      <p style={{ fontSize: 13, color: C.muted, fontFamily: font, lineHeight: 1.6, marginBottom: 16 }}>
        Your blueprint generated a personalized handwritten note for each of your top partner categories. Copy the version for the partner you're reaching out to first.
      </p>

      {/* Tab row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {notes.map((note, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setActiveIdx(i); setCopied(false); }}
            style={{
              background: activeIdx === i ? C.navy : C.cream,
              color: activeIdx === i ? C.white : C.muted,
              border: `1px solid ${activeIdx === i ? C.navy : C.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: font,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {note.partnerType.length > 28 ? note.partnerType.slice(0, 26) + "…" : note.partnerType}
          </button>
        ))}
      </div>

      {/* Note text */}
      <div style={{ background: C.cream, borderRadius: 10, padding: "16px 18px", marginBottom: 14, fontFamily: font, fontSize: 14, color: C.navy, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
        {active.noteText}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleCopy}
          style={{ background: copied ? "#2D6A4F" : C.gold, color: copied ? C.white : C.navy, border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, fontFamily: font, cursor: "pointer" }}
        >
          {copied ? "Copied!" : "Copy this note"}
        </button>
        <a
          href="https://nurturink.com"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", background: C.navy, color: C.white, textDecoration: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, fontFamily: font }}
        >
          Send it handwritten with NurturInk →
        </a>
      </div>
    </div>
  );
}