import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PhaseRunnerCard({ phase, status, result, isActive }) {
  const [expanded, setExpanded] = useState(false);

  const isRunning = isActive;
  const isDone = status === "done";
  const isError = status === "error";
  const isPending = !isRunning && !isDone && !isError;

  const borderLeft = isRunning ? "4px solid var(--gold)" :
    isDone    ? "4px solid var(--success)" :
    isError   ? "4px solid #DC2626" :
                "4px solid var(--d100-border)";

  const dotBg = isRunning ? "var(--gold)" :
    isDone    ? "var(--success)" :
    isError   ? "#DC2626" :
                "var(--cream-dark)";

  const dotColor = isPending ? "var(--text-muted)" : "white";
  const dotLabel = isDone ? "✓" : isError ? "✗" : isRunning ? "…" : phase.id;

  return (
    <div className="d100-phase-card" style={{ borderLeft, marginBottom: 0 }}>

      {/* Header */}
      <div
        className="d100-phase-header"
        onClick={() => result && setExpanded(e => !e)}
        style={{ cursor: result ? "pointer" : "default" }}
      >
        {/* Status dot */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: dotBg, color: dotColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isRunning ? 0 : 12, fontWeight: 800,
            flexShrink: 0, marginTop: 2, position: "relative"
          }}>
            {isRunning ? (
              <div style={{ width: 14, height: 14, border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "d100spin 0.8s linear infinite" }} />
            ) : dotLabel}
          </div>

          {/* Title */}
          <div style={{ minWidth: 0 }}>
            <div className="d100-phase-title" style={{ color: isPending ? "var(--text-muted)" : "var(--navy)" }}>
              {phase.title}
            </div>
            {/* Status label */}
            {isRunning && <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, marginTop: 3 }}>Generating...</div>}
            {isDone    && <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginTop: 3 }}>Complete</div>}
            {isError   && <div style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, marginTop: 3 }}>Error</div>}
          </div>
        </div>

        {/* Expand toggle */}
        {result && (
          <div className={`d100-phase-toggle${expanded ? " open" : ""}`} style={{ color: "var(--text-muted)" }}>⌄</div>
        )}
      </div>

      {/* Collapsed hint */}
      {result && !expanded && isDone && (
        <div style={{ padding: "0 18px 14px" }}>
          <button
            onClick={() => setExpanded(true)}
            style={{ width: "100%", padding: "10px", background: "var(--cream)", border: "1.5px solid var(--d100-border)", borderRadius: 8, fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: "var(--navy)", cursor: "pointer" }}
          >Click to expand result</button>
        </div>
      )}

      {/* Expanded result */}
      {result && expanded && (
        <div className="d100-phase-body">
          <div className="d100-prompt-text" style={{ maxHeight: 480, background: "var(--cream)" }}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}