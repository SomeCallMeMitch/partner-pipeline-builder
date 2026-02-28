import React from "react";

export default function RunnerNurturInkCTA() {
  return (
    <div style={{
      background: "#1B2A4A", borderRadius: 16, padding: 24,
      position: "relative", overflow: "hidden",
    }}>
      {/* glow */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 140, height: 140,
        background: "radial-gradient(circle, rgba(201,151,58,0.18), transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "#E8B55A",
        marginBottom: 10, position: "relative",
      }}>
        While You Wait...
      </div>

      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.65,
        marginBottom: 16, position: "relative",
      }}>
        When your blueprint is ready, send a handwritten card to your top 3 partners{" "}
        <strong style={{ color: "#fff" }}>before</strong> you email or call.
        It's the move that gets you remembered.
      </p>

      <a
        href="https://nurturink.com/realestate"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", textAlign: "center",
          background: "#C9973A", color: "#1B2A4A",
          textDecoration: "none", fontWeight: 800, fontSize: 14,
          padding: "12px 16px", borderRadius: 10, position: "relative",
          fontFamily: "'Sora', sans-serif",
        }}
      >
        See How NurturInk Works →
      </a>
    </div>
  );
}