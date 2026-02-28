import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function PhaseRunnerCard({ phase, status, result, isActive, defaultExpanded, errorMessage }) {
  const [expanded, setExpanded] = useState(defaultExpanded || false);

  useEffect(() => {
    if (defaultExpanded && result) setExpanded(true);
  }, [result, defaultExpanded]);

  const isDone = status === "done";
  const isRunning = isActive || status === "running";
  const isError = status === "error";
  const isPending = !isRunning && !isDone && !isError;

  const borderLeft = isRunning ? "4px solid #C9973A"
    : isDone  ? "4px solid #2D6A4F"
    : isError ? "4px solid #DC2626"
    :           "4px solid #E2DDD4";

  const opacity = isPending ? 0.5 : 1;

  const dotBg = isDone    ? "#2D6A4F"
    : isRunning ? "#C9973A"
    : isError   ? "#DC2626"
    :             "#E0D9CF";

  const dotColor = isPending ? "#5A6278" : "#fff";

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #DDD5C5",
      borderLeft,
      overflow: "hidden",
      boxShadow: isRunning ? "0 0 0 3px rgba(201,151,58,0.12)" : "0 1px 6px rgba(27,42,74,0.05)",
      transition: "all 0.3s",
      opacity,
    }}>
      {/* Header */}
      <div
        onClick={() => isDone && result && setExpanded(e => !e)}
        style={{
          padding: "14px 18px",
          display: "flex", alignItems: "center", gap: 12,
          cursor: isDone && result ? "pointer" : "default",
        }}
      >
        {/* Dot */}
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          background: dotBg, color: dotColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700,
        }}>
          {isRunning ? (
            <div style={{
              width: 13, height: 13,
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "runnerSpin 0.8s linear infinite",
            }} />
          ) : isDone ? "✓" : isError ? "✗" : (
            <span style={{ fontSize: 11, color: "#5A6278" }}>{phase.id}</span>
          )}
        </div>

        {/* Title + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: 14, lineHeight: 1.4,
            color: isPending ? "#5A6278" : "#1A1A2E",
            fontFamily: "'Sora', sans-serif",
          }}>
            {phase.title}
          </div>
        </div>

        {/* Right: status label + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {isDone && (
            <span style={{ fontSize: 12, color: "#2D6A4F", fontWeight: 600 }}>Complete</span>
          )}
          {isRunning && (
            <span style={{
              fontSize: 12, color: "#C9973A", fontWeight: 600,
              animation: "runnerBlink 1.5s infinite",
            }}>Generating...</span>
          )}
          {isError && (
            <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>Error</span>
          )}
          {isDone && result && (
            <span style={{
              color: "#5A6278", fontSize: 18, lineHeight: 1,
              display: "inline-block",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>⌄</span>
          )}
        </div>
      </div>

      {/* Error detail */}
      {isError && errorMessage && (
        <div style={{
          borderTop: "1px solid #FCA5A5",
          padding: "10px 18px",
          background: "#FEF2F2",
          fontSize: 12.5, color: "#B91C1C",
          fontFamily: "monospace",
          lineHeight: 1.5,
        }}>
          {errorMessage}
        </div>
      )}

      {/* Peek bar for collapsed done */}
      {isDone && result && !expanded && (
        <div
          onClick={() => setExpanded(true)}
          style={{
            borderTop: "1px solid #DDD5C5",
            padding: "7px 18px",
            fontSize: 11, color: "#5A6278",
            cursor: "pointer", textAlign: "center",
            background: "#F8F5F0",
          }}
        >
          Click to expand result
        </div>
      )}

      {/* Expanded result */}
      {isDone && result && expanded && (
        <div style={{
          borderTop: "1px solid #DDD5C5",
          padding: "18px 20px",
          background: "#F8F5F0",
          fontSize: 13.5, lineHeight: 1.7,
          color: "#1A1A2E",
          maxHeight: 360, overflowY: "auto",
        }}>
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}