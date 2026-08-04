import React from "react";
import { useNavigate } from "react-router-dom";

// ── Design tokens (matches RunBlueprint's C token convention) ───────────────
const C = {
  navy: "#1B2A4A",
  navyDeep: "#0F1B2E",
  gold: "#C9973A",
  goldLight: "#E8B55A",
  white: "#FFFFFF",
};
const font = "'Sora', -apple-system, sans-serif";

// Fires once on run completion (controlled by RunBlueprint via the `open`
// prop, latched with a ref there so this never reopens on a later poll tick).
// Closing must never navigate -- the report and download buttons stay
// reachable underneath either way.
export default function CompletionSignupModal({ open, onClose, jobId }) {
  const navigate = useNavigate();
  if (!open) return null;

  function handlePrimary() {
    onClose();
    navigate(`/ClaimBlueprint?jobId=${jobId}`);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 400,
          background: C.navyDeep, border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18, padding: "26px 24px 24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)", fontFamily: font,
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 14, background: "transparent",
            border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22,
            lineHeight: 1, cursor: "pointer", padding: 4,
          }}
        >
          ×
        </button>

        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: C.goldLight, marginBottom: 10, paddingRight: 20,
        }}>
          Write Because · Dream Partner Blueprint
        </div>

        <div style={{ color: C.white, fontWeight: 800, fontSize: 20, lineHeight: 1.35, marginBottom: 12 }}>
          Your blueprint is done. Here's the part almost everyone skips.
        </div>

        <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13.5, lineHeight: 1.7, margin: "0 0 14px" }}>
          The blueprint names partner types. A type can't take your call. The tracker turns them into real people, tells you the one next step for each, and holds the note already written for them so you're not hunting through a PDF when it's time to send it.
        </p>

        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 20px" }}>
          Free. About three minutes. Nothing here is behind a paywall, and your report stays available either way.
        </p>

        <button
          onClick={handlePrimary}
          style={{
            width: "100%", background: C.gold, color: C.navy, border: "none",
            fontWeight: 800, fontSize: 15, padding: "13px 20px", borderRadius: 10,
            cursor: "pointer", fontFamily: font, marginBottom: 10,
          }}
        >
          Name My Five →
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%", background: "transparent", border: "none",
            color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: font,
            cursor: "pointer", padding: "6px 0",
          }}
        >
          I'll just download for now
        </button>
      </div>
    </div>
  );
}
