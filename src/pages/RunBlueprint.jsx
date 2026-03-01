import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { buildPhasePrompts } from "@/components/engine/phasePromptBuilder";
import { buildPrompts } from "@/components/dream100/promptBuilder";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  navy:      "#1B2A4A",
  navyLight: "#243659",
  navyDeep:  "#111D33",
  gold:      "#C9973A",
  goldLight: "#E8B55A",
  goldPale:  "#F5E9D0",
  cream:     "#FAF8F4",
  creamDark: "#F0EBE1",
  text:      "#1A1A2E",
  muted:     "#5A6278",
  border:    "#DDD5C5",
  white:     "#FFFFFF",
  success:   "#2D6A4F",
  successBg: "#EAF4EE",
  error:     "#B91C1C",
  errorBg:   "#FEF2F2",
};
const font = "'Sora', -apple-system, sans-serif";

// ─── PHASE CARD ───────────────────────────────────────────────────────────────
function PhaseCard({ phase, status, result, isActive, errorMessage }) {
  const [expanded, setExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      setElapsed(0);
      intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const fmt = s => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const isDone    = status === "done";
  const isError   = status === "error";
  const isPending = !status && !isActive;

  const borderLeft = isDone ? C.success : isActive ? C.gold : isError ? C.error : C.border;
  const dotBg      = isDone ? C.success : isActive ? C.gold : isError ? C.error : C.creamDark;
  const dotColor   = (isDone || isActive || isError) ? C.white : C.muted;

  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      border: `1px solid ${isActive ? C.gold : isDone ? C.border : isError ? "#FECACA" : C.border}`,
      borderLeft: `4px solid ${borderLeft}`,
      overflow: "hidden",
      boxShadow: isActive ? `0 0 0 3px rgba(201,151,58,0.15)` : "0 2px 8px rgba(27,42,74,0.05)",
      transition: "all 0.3s",
      opacity: isPending ? 0.55 : 1,
    }}>
      {/* Header row */}
      <div
        style={{
          padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
          cursor: isDone ? "pointer" : "default",
          background: isActive ? "rgba(201,151,58,0.04)" : C.white,
        }}
        onClick={() => isDone && setExpanded(e => !e)}
      >
        {/* Status dot */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: dotBg, color: dotColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isDone ? 12 : 11, fontWeight: 700, fontFamily: font,
        }}>
          {isDone ? "✓" : isError ? "✗" : isActive ? (
            <div style={{
              width: 12, height: 12,
              border: "2px solid rgba(255,255,255,0.4)",
              borderTopColor: "white", borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
          ) : phase.id}
        </div>

        <span style={{
          flex: 1, fontWeight: 600, fontSize: 14,
          color: isPending ? C.muted : C.text, fontFamily: font,
        }}>{phase.title}</span>

        {isActive && (
          <span style={{ fontSize: 12, color: C.gold, fontWeight: 700, fontFamily: "monospace" }}>
            {fmt(elapsed)}
          </span>
        )}
        {isDone && <span style={{ fontSize: 12, color: C.success, fontWeight: 600, fontFamily: font }}>Complete</span>}
        {isError && <span style={{ fontSize: 12, color: C.error, fontWeight: 600, fontFamily: font }}>Error</span>}
        {isDone && (
          <span style={{
            color: C.muted, fontSize: 16, lineHeight: 1, marginLeft: 4,
            transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s",
          }}>⌄</span>
        )}
      </div>

      {/* Error detail */}
      {isError && errorMessage && (
        <div style={{
          padding: "8px 18px", fontSize: 12, fontFamily: "monospace",
          color: C.error, background: C.errorBg,
          borderTop: `1px solid #FECACA`,
        }}>{errorMessage}</div>
      )}

      {/* Expand prompt */}
      {isDone && !expanded && (
        <div onClick={() => setExpanded(true)} style={{
          borderTop: `1px solid ${C.border}`, padding: "7px 18px",
          fontSize: 11, color: C.muted, fontFamily: font,
          cursor: "pointer", textAlign: "center", background: C.cream,
        }}>Click to expand result</div>
      )}

      {/* Result content */}
      {isDone && expanded && (
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: "16px 18px", background: C.cream,
          fontSize: 13, lineHeight: 1.75, color: C.text, fontFamily: font,
          maxHeight: 400, overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}>{result}</div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RunBlueprint() {
  const navigate = useNavigate();
  const [build, setBuild]               = useState(null);
  const [landingData, setLandingData]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [running, setRunning]           = useState(false);
  const [activePhase, setActivePhase]   = useState(null);
  const [status, setStatus]             = useState({});
  const [results, setResults]           = useState({});
  const [errors, setErrors]             = useState({});
  const [allDone, setAllDone]           = useState(false);
  const [exportingWord, setExportingWord] = useState(false);
  const resultsRef = useRef({});

  useEffect(() => {
    const stored = sessionStorage.getItem("d100_run_formData");
    if (stored) { setLandingData(JSON.parse(stored)); setLoading(false); return; }
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) { navigate(createPageUrl("Landing")); return; }
    base44.entities.Build.filter({ id }).then(res => {
      if (res[0]) setBuild(res[0]);
      setLoading(false);
    });
  }, []);

  const phases = landingData
    ? buildPrompts(landingData).map(p => ({ id: p.id, title: p.title, prompt: p.prompt }))
    : build ? buildPhasePrompts(build) : [];

  const displayName = landingData
    ? `${landingData.niche || landingData.nicheBase} — ${landingData.geo}`
    : build ? build.name : "";

  async function runAll() {
    setRunning(true); setResults({}); setStatus({}); setErrors({});
    setAllDone(false); resultsRef.current = {};
    for (const phase of phases) {
      setActivePhase(phase.id);
      setStatus(s => ({ ...s, [phase.id]: "running" }));
      try {
        const response = await base44.functions.invoke("invokeClaude", {
          prompt: phase.prompt, model: "claude-sonnet-4-6"
        });
        const result = response.data?.result;
        resultsRef.current[phase.id] = result;
        setResults(r => ({ ...r, [phase.id]: result }));
        setStatus(s => ({ ...s, [phase.id]: "done" }));
      } catch (e) {
        const msg = e?.response?.data?.error || e?.message || String(e);
        setErrors(err => ({ ...err, [phase.id]: msg }));
        setStatus(s => ({ ...s, [phase.id]: "error" }));
      }
    }
    setActivePhase(null); setRunning(false); setAllDone(true);
  }

  async function downloadWord() {
    setExportingWord(true);
    const config = landingData
      ? { agentName: landingData.name || "Agent", niche: landingData.niche || landingData.nicheBase || "Real Estate", subniche: "", market: landingData.geo || "My Market", idealClient: landingData.client || "" }
      : build ? { agentName: build.name, niche: build.niche, subniche: "", market: build.geography, idealClient: "" } : {};
    try {
      const res = await fetch("/functions/exportToWord", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, phaseResults: resultsRef.current }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Dream100_Blueprint_${(config.agentName || "Blueprint").replace(/\s+/g, "_")}.docx`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch(e) { console.error(e); }
    setExportingWord(false);
  }

  function downloadMarkdown() {
    let full = `# DREAM 100 PARTNER BLUEPRINT\n${displayName}\nGenerated by NurturInk\n\n`;
    for (const phase of phases) {
      if (resultsRef.current[phase.id]) {
        full += `\n\n${"=".repeat(60)}\n## ${phase.title}\n${"=".repeat(60)}\n\n${resultsRef.current[phase.id]}`;
      }
    }
    const blob = new Blob([full], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Dream100_${(displayName || "Blueprint").replace(/[^a-z0-9]/gi, "_")}.md`;
    a.click(); URL.revokeObjectURL(url);
  }

  const completedCount = Object.values(status).filter(s => s === "done").length;
  const progress = phases.length ? (completedCount / phases.length) * 100 : 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${C.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: font }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── TOP NAV ── */}
      <div style={{ background: C.navy, boxShadow: "0 2px 20px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => navigate(-1)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
            >←</button>
            <div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 15, fontFamily: font }}>AI Blueprint Runner</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: font }}>{displayName}</div>
            </div>
          </div>

          {/* Nav actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {(running || allDone) && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: font, marginRight: 4 }}>
                {completedCount} of {phases.length} phases
              </span>
            )}
            {allDone && (
              <>
                <button onClick={downloadMarkdown} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.8)", fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  ↓ Markdown
                </button>
                <button onClick={downloadWord} disabled={exportingWord} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.8)", fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  {exportingWord ? "Building..." : "📄 Word Doc"}
                </button>
              </>
            )}
            <button
              onClick={allDone ? () => { setAllDone(false); runAll(); } : runAll}
              disabled={running}
              style={{
                background: running ? "rgba(201,151,58,0.5)" : C.gold,
                color: C.navy, border: "none", borderRadius: 8,
                padding: "8px 18px", fontFamily: font, fontWeight: 800, fontSize: 14,
                cursor: running ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {running ? (
                <><div style={{ width: 14, height: 14, border: "2px solid rgba(27,42,74,0.4)", borderTopColor: C.navy, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Running Phase {activePhase}...</>
              ) : allDone ? "↺ Run Again" : `▶ Run All ${phases.length} Phases`}
            </button>
          </div>
        </div>

        {/* Gold progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`, width: `${progress}%`, transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>

          {/* ── LEFT: Phase cards ── */}
          <div>
            {/* Info banner */}
            <div style={{
              background: C.navy, borderRadius: 14, padding: "20px 24px", marginBottom: 24,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "radial-gradient(circle, rgba(201,151,58,0.12), transparent 65%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.goldLight, marginBottom: 6, fontFamily: font }}>NurturInk · Dream 100 Blueprint</div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 17, fontFamily: font, marginBottom: 4 }}>{displayName}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: font }}>
                Sending each of the {phases.length} phases to Claude AI one at a time. <strong style={{ color: "rgba(255,255,255,0.8)" }}>Each phase takes 1–6 minutes.</strong>
              </div>
            </div>

            {/* Warning */}
            {running && (
              <div style={{ background: C.goldPale, border: `1.5px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#7A5800", fontFamily: font }}>
                ⏳ <strong>Don't navigate away while running.</strong> Each phase builds on the last. If interrupted, use Run Again to restart.
              </div>
            )}

            {/* Phase cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phases.map(phase => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  status={status[phase.id]}
                  result={results[phase.id]}
                  isActive={activePhase === phase.id}
                  errorMessage={errors[phase.id]}
                />
              ))}
            </div>

            {/* All done banner */}
            {allDone && (
              <div style={{ marginTop: 24, background: C.successBg, border: `1.5px solid ${C.success}`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.success, fontFamily: font, marginBottom: 4 }}>✓ All {phases.length} Phases Complete</div>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: font }}>Download your blueprint using the buttons in the nav bar above.</div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Progress card */}
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px", boxShadow: "0 2px 12px rgba(27,42,74,0.06)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 14, fontFamily: font }}>Run Progress</div>

              {/* Circular progress */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={C.creamDark} strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={C.gold} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.5s ease" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: C.navy, fontFamily: font, lineHeight: 1 }}>
                      {allDone && !running ? "✓" : completedCount}
                    </span>
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: font }}>
                      {allDone && !running ? "Done" : `of ${phases.length}`}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: allDone ? C.success : running ? C.gold : C.muted, fontFamily: font, marginTop: 8 }}>
                  {allDone ? "All phases complete" : running ? `Running phase ${activePhase}...` : "Ready to Run"}
                </div>
                {!running && !allDone && (
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: font, marginTop: 2 }}>Click Run to begin all phases.</div>
                )}
              </div>

              {/* Phase checklist */}
              {phases.map((phase, i) => (
                <div key={phase.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < phases.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: status[phase.id] === "done" ? C.success : status[phase.id] === "error" ? C.error : activePhase === phase.id ? C.gold : C.creamDark,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: (status[phase.id] || activePhase === phase.id) ? C.white : C.muted, fontWeight: 700,
                  }}>
                    {status[phase.id] === "done" ? "✓" : status[phase.id] === "error" ? "✗" : activePhase === phase.id ? "…" : ""}
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: font, lineHeight: 1.3,
                    color: !status[phase.id] && activePhase !== phase.id ? C.muted : C.text,
                    fontWeight: activePhase === phase.id ? 700 : 400,
                  }}>{phase.title}</span>
                </div>
              ))}
            </div>

            {/* While you wait CTA */}
            <div style={{ background: C.navy, borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(201,151,58,0.2), transparent 65%)" }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.goldLight, marginBottom: 8, fontFamily: font, position: "relative" }}>While you wait...</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: font, lineHeight: 1.6, margin: "0 0 12px", position: "relative" }}>
                When your blueprint is ready, send a handwritten card to your top 3 partners <em style={{ color: C.white }}>before</em> you email or call. It's the move that gets you remembered.
              </p>
              <a href="https://nurturink.com" target="_blank" rel="noreferrer" style={{
                display: "block", textAlign: "center",
                background: C.gold, color: C.navy, textDecoration: "none",
                fontWeight: 800, fontSize: 13, padding: "10px 14px", borderRadius: 8,
                fontFamily: font, position: "relative",
              }}>See How NurturInk Works →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: C.navy, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "18px 24px", fontSize: 12, fontFamily: font }}>
        <a href="https://nurturink.com" style={{ color: "rgba(201,151,58,0.75)", textDecoration: "none", fontWeight: 600 }}>NurturInk</a>
        {" "}· the handwritten follow-up system for relationship-driven sales professionals
      </footer>
    </div>
  );
}