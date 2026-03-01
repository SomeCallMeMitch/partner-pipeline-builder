import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PhaseRunnerCard({ phase, status, result, isActive, errorMessage }) {
  const [expanded, setExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  // Start timer when active, stop and reset when done or error
  useEffect(() => {
    if (isActive) {
      setElapsed(0);
      intervalRef.current = setInterval(() => {
        setElapsed(s => s + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${String(sec).padStart(2, "0")}` : `0:${String(sec).padStart(2, "0")}`;
  };

  const borderColor = isActive
    ? "#3B82F6"
    : status === "done"
    ? "#22c55e"
    : status === "error"
    ? "#ef4444"
    : "rgba(255,255,255,0.08)";

  const bgHeader = isActive
    ? "rgba(59,130,246,0.08)"
    : status === "done"
    ? "rgba(34,197,94,0.06)"
    : status === "error"
    ? "rgba(239,68,68,0.06)"
    : "rgba(255,255,255,0.03)";

  const dotBg = isActive
    ? "#3B82F6"
    : status === "done"
    ? "#22c55e"
    : status === "error"
    ? "#ef4444"
    : "rgba(255,255,255,0.15)";

  const dotLabel = status === "done" ? "✓" : status === "error" ? "✗" : isActive ? "…" : phase.id;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: bgHeader }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: dotBg }}
        >
          {isActive ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            dotLabel
          )}
        </div>

        <span className="font-semibold text-sm text-white flex-1">{phase.title}</span>

        {isActive && (
          <span className="text-xs text-blue-400 font-mono tabular-nums">
            {formatTime(elapsed)}
          </span>
        )}
        {status === "done" && (
          <span className="text-xs text-green-400">Complete</span>
        )}
        {status === "error" && (
          <span className="text-xs text-red-400">Error</span>
        )}

        {result && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-slate-500 hover:text-slate-300 transition-colors ml-2"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div
          className="px-5 py-3 text-xs font-mono text-red-300"
          style={{
            borderTop: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.05)",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Result */}
      {result && expanded && (
        <div
          className="px-5 py-4 overflow-auto prose prose-invert prose-sm max-w-none"
          style={{
            maxHeight: 500,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.2)",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}

      {/* Auto-expand when done */}
      {result && !expanded && status === "done" && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-center py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          Click to expand result
        </button>
      )}
    </div>
  );
}