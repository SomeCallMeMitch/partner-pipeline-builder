import React from "react";
import { useNavigate } from "react-router-dom";

const C = {
  navy: "#1B2A4A",
  gold: "#C9973A",
  goldLight: "#E8B55A",
  white: "#FFFFFF",
};
const font = "'Sora', -apple-system, sans-serif";

export default function TrackerCTA({ jobId }) {
  const navigate = useNavigate();
  if (!jobId) return null;

  return (
    <div style={{
      marginTop: 24, background: C.navy, borderRadius: 14,
      padding: "24px 26px", position: "relative", overflow: "hidden", fontFamily: font,
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40, width: 180, height: 180,
        background: "radial-gradient(circle, rgba(201,151,58,0.16), transparent 65%)", pointerEvents: "none",
      }} />
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        color: C.goldLight, marginBottom: 10, position: "relative",
      }}>
        The part almost everyone skips
      </div>
      <div style={{
        color: C.white, fontWeight: 800, fontSize: 20, lineHeight: 1.35,
        marginBottom: 12, position: "relative",
      }}>
        Your blueprint names partner types. It becomes real when actual people are on it.
      </div>
      <p style={{
        color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.7,
        margin: "0 0 18px", position: "relative",
      }}>
        Free, and it takes about three minutes. We keep the list, tell you the one next step for each person,
        and hold your notes so you are not starting cold every time. Nothing here is behind a paywall.
      </p>
      <button
        onClick={() => navigate(`/ClaimBlueprint?jobId=${jobId}`)}
        style={{
          position: "relative", background: C.gold, color: C.navy, border: "none",
          fontFamily: font, fontWeight: 800, fontSize: 15, padding: "13px 26px",
          borderRadius: 9, cursor: "pointer",
        }}
      >
        Name My Five →
      </button>
      <div style={{
        color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 12, position: "relative",
      }}>
        Your report stays here either way. Bookmark this page.
      </div>
    </div>
  );
}
