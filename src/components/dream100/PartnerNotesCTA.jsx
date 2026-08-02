// src/components/dream100/PartnerNotesCTA.jsx
//
// Shown in RunBlueprint when the job is complete and Phase 6 parsed cleanly.
// Previously this offered a fake "import into Write Because" flow that posted
// to an endpoint that was never built. It now does the real thing: the notes
// are already saved with the blueprint, so the honest next step is to claim
// the tracker, where each note is attached to the partner it was written for.

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { parsePhase6Notes } from "@/utils/parsePhase6";

const C = {
  navy: "#1B2A4A",
  gold: "#C9973A",
  text: "#1A1A2E",
  muted: "#5A6278",
  border: "#DDD5C5",
  white: "#FFFFFF",
  success: "#2D6A4F",
};
const font = "'Sora', -apple-system, sans-serif";

export default function PartnerNotesCTA({ phase6Text, formData, jobId }) {
  const navigate = useNavigate();
  const notes = useMemo(() => parsePhase6Notes(phase6Text), [phase6Text]);

  if (!notes) {
    return (
      <div style={ctaWrapStyle}>
        <div style={eyebrowStyle}>Ready to use these scripts?</div>
        <div style={headlineStyle}>Send your partner notes without writing them by hand</div>
        <p style={bodyStyle}>
          Write Because writes real handwritten notes for you, real pen on real paper, mailed
          directly to your partners. From $2.50 a card including postage.
        </p>
        <a href="https://writebecause.com" target="_blank" rel="noreferrer" style={primaryBtnStyle}>
          See how Write Because works →
        </a>
      </div>
    );
  }

  return (
    <div style={ctaWrapStyle}>
      <div style={eyebrowStyle}>Your {notes.length} partner notes are written</div>
      <div style={headlineStyle}>
        Phase 6 already wrote the hard part. Here is what goes in the mail first.
      </div>
      <p style={bodyStyle}>
        These are the introduction notes, one per partner type. They are the first thing you send,
        before any email or call, because a note on someone's desk gets read and an intro email does not.
      </p>

      <div style={{ marginBottom: 20 }}>
        {notes.map((note, i) => (
          <div key={i} style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: 12, marginBottom: 12 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: C.gold, fontFamily: font,
              marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.07em",
            }}>
              {note.partnerType}
            </div>
            <div style={{ fontSize: 13, color: C.muted, fontFamily: font, lineHeight: 1.6 }}>
              {note.noteText.length > 160 ? note.noteText.slice(0, 160) + "..." : note.noteText}
            </div>
          </div>
        ))}
      </div>

      {jobId ? (
        <>
          <button onClick={() => navigate(`/ClaimBlueprint?jobId=${jobId}`)} style={primaryBtnStyle}>
            Keep these with my partner list →
          </button>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: font, marginTop: 10, textAlign: "center", lineHeight: 1.6 }}>
            Free. Each note stays attached to the partner it was written for, so when it is time to
            send one you are not hunting through a PDF for it.
          </div>
        </>
      ) : (
        <a href="https://writebecause.com" target="_blank" rel="noreferrer" style={primaryBtnStyle}>
          See how Write Because works →
        </a>
      )}
    </div>
  );
}

const ctaWrapStyle = {
  background: "#FFFDF9",
  border: "1.5px solid #E8B55A",
  borderRadius: 14,
  padding: "24px",
  marginTop: 24,
  fontFamily: font,
};

const eyebrowStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: C.gold,
  marginBottom: 8,
  fontFamily: font,
};

const headlineStyle = {
  fontSize: 17,
  fontWeight: 800,
  color: C.navy,
  marginBottom: 12,
  lineHeight: 1.35,
  fontFamily: font,
};

const bodyStyle = {
  fontSize: 13,
  color: C.muted,
  lineHeight: 1.7,
  margin: "0 0 16px",
  fontFamily: font,
};

const primaryBtnStyle = {
  display: "block",
  textAlign: "center",
  background: C.gold,
  color: C.navy,
  border: "none",
  borderRadius: 10,
  padding: "12px 20px",
  fontWeight: 800,
  fontSize: 15,
  fontFamily: font,
  cursor: "pointer",
  textDecoration: "none",
  width: "100%",
  boxSizing: "border-box",
};
