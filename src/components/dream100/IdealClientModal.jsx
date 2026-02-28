import React, { useEffect } from "react";

const examples = [
  {
    icon: "🔨",
    label: "Investor / Fix-and-Flip",
    text: "Men 35–55, high net worth, doing 5–10 flips per year. Self-made, data-driven, moves fast. Values an agent who speaks investor language. Usually referred by their hard money lender or CPA.",
  },
  {
    icon: "🏡",
    label: "Luxury Downsizer",
    text: "Couples 55–70, empty nesters, $3M+ home, ready to right-size into a gated community or luxury condo. Emotionally attached to their current home. Need patience and a clear financial case.",
  },
  {
    icon: "✨",
    label: "First-Time Luxury Buyer",
    text: "Tech professionals 30–45, dual income $400K+, buying their forever home in a top school district. Overwhelmed by the market, need guidance. Often referred by their financial advisor.",
  },
  {
    icon: "✈️",
    label: "Relocation Executive",
    text: "Corporate executives relocating from out of state, 45–60, company-assisted move, $1.5–$3M budget. Time-pressed and decisive. Want an agent who makes fast, confident decisions on their behalf.",
  },
  {
    icon: "🌅",
    label: "55+ Active Adult",
    text: "Active retirees 60–75, downsizing from a large family home. Want community amenities, single-story living, low maintenance. Often have significant equity and are paying cash or close to it.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    label: "Move-Up Family Buyer",
    text: "Growing families 35–50, outgrowing their starter home, $800K–$1.5M budget. Prioritize school district, yard, safety. Both partners in the decision. Usually 60–90 days before school starts.",
  },
];

export default function IdealClientModal({ isOpen, onClose, onSelect }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10,18,35,0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%", maxWidth: 860,
          maxHeight: "min(640px, 88vh)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #111D33, #243659)",
          padding: "20px 28px 18px",
          flexShrink: 0, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 200, height: 200,
            background: "radial-gradient(circle, rgba(240,164,34,0.15), transparent 65%)",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F0A422", marginBottom: 5 }}>
                NurturInk · Ideal Client Guide
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 6px" }}>
                Describing Your Ideal Client
              </h2>
              <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.55, maxWidth: 500, margin: 0 }}>
                The more specific you are, the more targeted your blueprint.
                Think about who you{" "}
                <em style={{ color: "#F0A422", fontStyle: "normal", fontWeight: 600 }}>actually</em>{" "}
                love working with — not a generic buyer, but the person who makes your best deals happen.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 16 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", lineHeight: 1.4, textAlign: "right" }}>
                Tap any card for<br />inspiration, then<br />write your own.
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 10, color: "#fff", cursor: "pointer",
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0, lineHeight: 1,
                }}
              >×</button>
            </div>
          </div>
        </div>

        {/* Body — 2-col grid */}
        <div style={{
          overflowY: "auto", padding: "18px 24px", flex: 1,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 10, alignContent: "start",
        }}>
          {examples.map((ex) => (
            <div
              key={ex.label}
              style={{
                border: "1.5px solid #DDD5C5", borderRadius: 12,
                padding: "13px 15px", background: "#F4F1EC",
                transition: "all 0.15s",
              }}
              onClick={() => onSelect && onSelect(ex.text)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#1B2A4A"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(27,42,74,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDD5C5"; e.currentTarget.style.background = "#F4F1EC"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{
                  fontSize: 17, width: 28, height: 28,
                  background: "#ECEAE4", borderRadius: 7,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{ex.icon}</div>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#1B2A4A", lineHeight: 1.3 }}>{ex.label}</span>
              </div>
              <p style={{ fontSize: 12, color: "#5A6278", lineHeight: 1.55, margin: 0 }}>{ex.text}</p>
            </div>
          ))}

          {/* Gold tip — full width */}
          <div style={{
            gridColumn: "1 / -1",
            border: "1.5px solid #F0A422", borderLeft: "4px solid #F0A422",
            borderRadius: 10, padding: "12px 16px", background: "#FDF0D5",
          }}>
            <p style={{ fontSize: 13, color: "#5A4200", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "#7A5800" }}>You don't need to match an example exactly.</strong>{" "}
              Use your own words. Even two or three sentences helps the AI understand who you're targeting and generate a much more relevant blueprint.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 24px", borderTop: "1px solid #DDD5C5",
          display: "flex", justifyContent: "flex-end", alignItems: "center",
          background: "#F4F1EC", flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              background: "#1B2A4A", color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
            }}
          >Got it →</button>
        </div>
      </div>
    </div>
  );
}