import React from "react";

export default function RunnerProgressCard({ phases, status, activePhase, completedCount }) {
  const total = phases.length;
  const pct = total > 0 ? completedCount / total : 0;

  // SVG ring
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  const isRunning = !!activePhase;
  const runningPhase = phases.find(p => p.id === activePhase);

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #DDD5C5", padding: "24px 22px",
      boxShadow: "0 2px 16px rgba(27,42,74,0.07)",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "#5A6278", marginBottom: 18,
      }}>
        Run Progress
      </div>

      {/* Ring + status */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #DDD5C5" }}>
        <div style={{ position: "relative", flexShrink: 0, width: 90, height: 90 }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            {/* Track */}
            <circle cx="45" cy="45" r={r} fill="none" stroke="#EDE8E0" strokeWidth="7" />
            {/* Fill */}
            <circle
              cx="45" cy="45" r={r} fill="none"
              stroke="#C9973A" strokeWidth="7"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1B2A4A", lineHeight: 1 }}>{completedCount}</div>
            <div style={{ fontSize: 10, color: "#5A6278" }}>of {total}</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 5, lineHeight: 1.3 }}>
            {!isRunning && completedCount === 0 && "Ready to Run"}
            {isRunning && runningPhase && `Running: ${runningPhase.title.replace(/^Phase [\w.]+:\s*/i, '')}`}
            {!isRunning && completedCount === total && total > 0 && "All Done!"}
            {!isRunning && completedCount > 0 && completedCount < total && "Paused"}
          </div>
          <div style={{ fontSize: 13, color: "#5A6278", lineHeight: 1.5 }}>
            {isRunning
              ? "This phase takes 1–5 minutes.\nHang tight."
              : completedCount === total && total > 0
              ? "Download your full blueprint above."
              : "Click Run to begin all phases."}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div>
        {phases.map(phase => {
          const s = status[phase.id];
          const isDone = s === "done";
          const isRun = phase.id === activePhase;
          const shortTitle = phase.title.replace(/^Phase [\w.]+:\s*/i, '');

          return (
            <div key={phase.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 0", borderBottom: "1px solid #DDD5C5",
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                background: isDone ? "#2D6A4F" : isRun ? "#C9973A" : "#E0D9CF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#fff",
              }}>
                {isDone ? "✓" : isRun ? "●" : ""}
              </div>
              <div style={{
                fontSize: 12, lineHeight: 1.4,
                color: isDone || isRun ? "#1A1A2E" : "#5A6278",
                fontWeight: isRun ? 700 : 400,
              }}>
                {shortTitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}