import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { buildPrompts } from "@/components/dream100/promptBuilder";
import PartnerNotesCTA from "@/components/dream100/PartnerNotesCTA";

// ── NurturInk RE Clone URL (Workstream 3 uses this for the CTA redirect) ────
const NURTURINK_RE_URL = 'https://nurturink-for-real-estate-mortgage.base44.app';

// ── Known model config (matches backend -- used for display only) ────────────
const PHASE_MODEL_CONFIG = {
  1: { model: 'claude-haiku-4-5-20251001' },
  2: { model: 'claude-haiku-4-5-20251001' },
  3: { model: 'claude-haiku-4-5-20251001' },
  4: { model: 'claude-sonnet-4-6' },
  5: { model: 'claude-haiku-4-5-20251001' },
  6: { model: 'claude-sonnet-4-6' },
  7: { model: 'claude-haiku-4-5-20251001' },
};

const getModelLabel = (phaseId) => {
  const config = PHASE_MODEL_CONFIG[phaseId];
  if (!config) return '';
  return config.model.includes('haiku') ? 'Haiku' : 'Sonnet';
};

// ── Design tokens ───────────────────────────────────────────────────────────
const C = {
  navy: "#1B2A4A", navyLight: "#243659", navyDeep: "#111D33",
  gold: "#C9973A", goldLight: "#E8B55A", goldPale: "#F5E9D0",
  cream: "#FAF8F4", creamDark: "#F0EBE1",
  text: "#1A1A2E", muted: "#5A6278", border: "#DDD5C5", white: "#FFFFFF",
  success: "#2D6A4F", successBg: "#EAF4EE",
  error: "#B91C1C", errorBg: "#FEF2F2",
};
const font = "'Sora', -apple-system, sans-serif";

// ── PhaseCard ───────────────────────────────────────────────────────────────
// serverTiming = { startedAt: ISO string, completedAt: ISO string } | null
// Elapsed for active phases is seeded from serverTiming.startedAt for accuracy.
// Final time for done phases is computed from server timestamps, not poll guesses.

function PhaseCard({ phase, phaseStatus, result, serverTiming, modelLabel }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const isActive  = phaseStatus === "running";
  const isDone    = phaseStatus === "done";
  const isError   = phaseStatus === "error";
  const isPending = !phaseStatus || phaseStatus === "pending";

  // Accurate duration from server timestamps
  const computedFinalTime = (() => {
    if (!serverTiming?.completedAt || !serverTiming?.startedAt) return null;
    return Math.round(
      (new Date(serverTiming.completedAt).getTime() - new Date(serverTiming.startedAt).getTime()) / 1000
    );
  })();

  useEffect(() => {
    if (isActive) {
      // Seed from server's recorded start time so elapsed is accurate even after a poll delay
      const seed = serverTiming?.startedAt
        ? Math.max(0, Math.round((Date.now() - new Date(serverTiming.startedAt).getTime()) / 1000))
        : 0;
      setElapsed(seed);
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

  const wordCount = isDone && result ? result.split(/\s+/).filter(Boolean).length : 0;

  const borderLeft = isDone ? C.success : isActive ? C.gold : isError ? C.error : C.border;
  const dotBg = isDone ? C.success : isActive ? C.gold : isError ? C.error : C.creamDark;
  const dotColor = (isDone || isActive || isError) ? C.white : C.muted;

  return (
    <div style={{
      background: C.white, borderRadius: 12,
      border: `1px solid ${isActive ? C.gold : isDone ? C.border : isError ? "#FECACA" : C.border}`,
      borderLeft: `4px solid ${borderLeft}`, overflow: "hidden",
      boxShadow: isActive ? "0 0 0 3px rgba(201,151,58,0.15)" : "0 2px 8px rgba(27,42,74,0.05)",
      transition: "all 0.3s", opacity: isPending ? 0.55 : 1,
    }}>
      <div style={{
        padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
        cursor: isDone ? "pointer" : "default",
        background: isActive ? "rgba(201,151,58,0.04)" : C.white,
      }} onClick={() => isDone && setExpanded(e => !e)}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: dotBg, color: dotColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isDone ? 12 : 11, fontWeight: 700, fontFamily: font,
        }}>
          {isDone ? "✓" : isError ? "✗" : isActive ? (
            <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          ) : phase.id}
        </div>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: isPending ? C.muted : C.text, fontFamily: font }}>
          {phase.title}
        </span>
        {isActive && <span style={{ fontSize: 14, color: "#000", fontWeight: 700, fontFamily: "monospace" }}>{fmt(elapsed)}</span>}
        {isDone && (
          <span style={{ fontSize: 12, color: C.success, fontWeight: 600, fontFamily: font }}>
            Complete{computedFinalTime ? ` · ${fmt(computedFinalTime)}` : ''}
            {wordCount > 0 ? ` · ${wordCount.toLocaleString()} words` : ''}
            {modelLabel ? ` · ${modelLabel}` : ''}
          </span>
        )}
        {isError && <span style={{ fontSize: 12, color: C.error, fontWeight: 600, fontFamily: font }}>Failed</span>}
        {isDone && <span style={{ color: C.muted, fontSize: 16, lineHeight: 1, marginLeft: 4, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>}
      </div>
      {isDone && !expanded && (
        <div onClick={() => setExpanded(true)} style={{ borderTop: `1px solid ${C.border}`, padding: "7px 18px", fontSize: 11, color: C.muted, fontFamily: font, cursor: "pointer", textAlign: "center", background: C.cream }}>
          Click to expand result
        </div>
      )}
      {isDone && expanded && (
        <div style={{ borderTop: `1px solid ${C.border}`, background: C.cream }}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 18px 0" }}>
            <button onClick={() => { navigator.clipboard.writeText(result || "").then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
              style={{ background: copied ? C.successBg : C.white, border: `1px solid ${copied ? C.success : C.border}`, borderRadius: 6, padding: "4px 12px", fontSize: 11, color: copied ? C.success : C.text, fontWeight: 600, fontFamily: font, cursor: "pointer" }}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <div style={{ padding: "8px 18px 16px", fontSize: 13, lineHeight: 1.75, color: C.text, fontFamily: font, maxHeight: 400, overflowY: "auto", whiteSpace: "pre-wrap" }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function RunBlueprint() {
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollError, setPollError] = useState(null);
  const [exportingWord, setExportingWord] = useState(false);

  const pollRef = useRef(null);
  const resultsRef = useRef({});

  // ── Read jobId from URL ─────────────────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('jobId');

  // ── Derived state from job ──────────────────────────────────────────────
  const allDone = job?.status === 'complete';
  const isFailed = job?.status === 'failed';
  const phaseResults = job?.phaseResults || {};
  const currentPhase = job?.currentPhase || 0;
  const phaseTiming = job?.phaseTiming || {};

  const phases = job?.formData
    ? buildPrompts(job.formData).map(p => ({ id: p.id, title: p.title }))
    : [];

  const completedCount = Object.keys(phaseResults).length;
  const progress = phases.length ? (completedCount / phases.length) * 100 : 0;

  const displayName = job?.formData
    ? `${job.formData.niche || job.formData.nicheBase || ''} -- ${job.formData.geo || ''}`
    : '';

  // ── Polling ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!jobId) {
      navigate('/Landing');
      return;
    }

    const poll = async () => {
      try {
        const response = await base44.functions.invoke("getGenerationJobStatus", { jobId });
        const data = response.data;
        if (data.error) { setPollError(data.error); return; }
        setJob(data);
        resultsRef.current = data.phaseResults || {};
        setPollError(null);
        if (data.status === 'complete' || data.status === 'failed') {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        if (loading) setLoading(false);
      } catch (err) {
        console.error('Poll error:', err);
        setPollError(err.message || 'Failed to check status');
        if (loading) setLoading(false);
      }
    };

    poll();
    pollRef.current = setInterval(poll, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [jobId]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── Phase status helper ─────────────────────────────────────────────────
  const getPhaseStatus = (phaseId) => {
    if (phaseResults[String(phaseId)]) return "done";
    if (isFailed && job?.errorPhase === phaseId) return "error";
    if (currentPhase === phaseId && !allDone && !isFailed) return "running";
    return "pending";
  };

  // ── Downloads ─────────────────────────────────────────────────────────
  async function downloadWord() {
    setExportingWord(true);
    const fd = job?.formData || {};
    const config = {
      agentName: fd.name || "Agent",
      niche: fd.niche || fd.nicheBase || "Real Estate",
      subniche: "",
      market: fd.geo || "My Market",
      idealClient: fd.client || "",
    };
    try {
      const res = await fetch("/functions/exportToWord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, phaseResults: resultsRef.current }),
      });
      if (!res.ok) throw new Error(`Document generation failed (${res.status}): ${await res.text()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Dream100_Blueprint_${(config.agentName).replace(/\s+/g, "_")}.docx`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Word export error:", e);
      alert("Document export failed: " + (e?.message || "Unknown error") + "\n\nTry the Markdown download instead.");
    }
    setExportingWord(false);
  }

  function downloadMarkdown() {
    let full = `# DREAM PARTNER BLUEPRINT\n${displayName}\nGenerated by NurturInk\n\n`;
    for (const phase of phases) {
      const result = resultsRef.current[String(phase.id)];
      if (result) full += `\n\n${"=".repeat(60)}\n## ${phase.title}\n${"=".repeat(60)}\n\n${result}`;
    }
    const blob = new Blob([full], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Dream100_${(displayName || "Blueprint").replace(/[^a-z0-9]/gi, "_")}.md`;
    a.click(); URL.revokeObjectURL(url);
  }

  // ── Loading / error states ────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${C.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (pollError && !job) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream, fontFamily: font, flexDirection: "column", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.error }}>Unable to load blueprint</div>
      <div style={{ fontSize: 14, color: C.muted, textAlign: "center", maxWidth: 400 }}>{pollError}</div>
      <button onClick={() => navigate('/Landing')} style={{ background: C.navy, color: C.white, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, fontFamily: font, cursor: "pointer" }}>
        Start a New Blueprint
      </button>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: font }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .bp-grid { display: grid; grid-template-columns: 1fr 420px; gap: 36px; align-items: start; }
        .bp-sidebar { position: sticky; top: 80px; display: flex; flex-direction: column; gap: 16px; }
        .bp-nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 40px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
        .bp-main { max-width: 1400px; margin: 0 auto; padding: 36px 40px 80px; }
        @media (max-width: 768px) {
          .bp-grid { grid-template-columns: 1fr !important; }
          .bp-sidebar { position: static !important; order: -1; }
          .bp-nav-inner { padding: 0 16px !important; flex-wrap: wrap; height: auto !important; padding-top: 10px; padding-bottom: 10px; gap: 8px; }
          .bp-main { padding: 20px 16px 60px !important; }
        }
      `}</style>

      {/* COMPLETION BANNER */}
      {allDone && (
        <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`, padding: "20px 24px", textAlign: "center", borderBottom: `3px solid ${C.gold}` }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: font, marginBottom: 6 }}>✓ Your Blueprint is Ready!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontFamily: font, marginBottom: 16 }}>
              All {phases.length} phases complete. Download your personalized Dream Partner strategy below.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={downloadWord} disabled={exportingWord} style={{ background: C.gold, color: C.navy, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 800, fontSize: 16, fontFamily: font, cursor: exportingWord ? "not-allowed" : "pointer" }}>
                {exportingWord ? "Building Document..." : "📄 Download Word Doc"}
              </button>
              <button onClick={downloadMarkdown} style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 14, fontFamily: font, color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>
                ↓ Download Markdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAILURE BANNER */}
      {isFailed && (
        <div style={{ background: C.errorBg, padding: "16px 24px", textAlign: "center", borderBottom: `2px solid ${C.error}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.error, fontFamily: font, marginBottom: 4 }}>
            Generation stopped at Phase {job.errorPhase || '?'}
          </div>
          <div style={{ fontSize: 13, color: C.muted, fontFamily: font }}>
            {job.errorMessage || 'An unexpected error occurred.'}
            {completedCount > 0 && ` ${completedCount} phase${completedCount > 1 ? 's' : ''} completed successfully.`}
          </div>
        </div>
      )}

      {/* TOP NAV */}
      <div style={{ background: C.navy, boxShadow: "0 2px 20px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="bp-nav-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => navigate('/Landing')}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ←
            </button>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 15, fontFamily: font }}>Dream Partner Blueprint</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bp-main">
        <div className="bp-grid">

          {/* LEFT: Phase cards */}
          <div>
            <div style={{ background: C.navy, borderRadius: 14, padding: "20px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "radial-gradient(circle, rgba(201,151,58,0.12), transparent 65%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.goldLight, marginBottom: 6, fontFamily: font }}>
                NurturInk · Dream Partner Blueprint
              </div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 17, fontFamily: font, marginBottom: 4 }}>{displayName}</div>
              <div style={{ color: C.white, fontSize: 16, fontFamily: font }}>
                7 phases, each building on the last. <strong>Total time: approximately 7-12 minutes.</strong>
              </div>
              {!allDone && !isFailed && (
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: font, marginTop: 8 }}>
                  You can close this tab. {job?.userEmail ? "We'll email you when it's done." : "Come back to this URL to check progress."}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phases.map(phase => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  phaseStatus={getPhaseStatus(phase.id)}
                  result={phaseResults[String(phase.id)]}
                  serverTiming={phaseTiming[String(phase.id)] || null}
                  modelLabel={getPhaseStatus(phase.id) === 'done' ? getModelLabel(phase.id) : ''}
                />
              ))}
            </div>

            {allDone && (
              <div style={{ marginTop: 24, background: C.successBg, border: `1.5px solid ${C.success}`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.success, fontFamily: font, marginBottom: 4 }}>
                  ✓ All {phases.length} Phases Complete
                </div>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: font }}>
                  Scroll up to download your blueprint, or expand any phase above to review.
                </div>
              </div>
            )}

            {allDone && (
              <PartnerNotesCTA
                phase6Text={phaseResults['6'] || null}
                formData={job?.formData || null}
              />
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="bp-sidebar">

            {/* Progress tracker */}
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px", boxShadow: "0 2px 12px rgba(27,42,74,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 14, fontFamily: font }}>Run Progress</div>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={C.creamDark} strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={C.gold} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: C.navy, fontFamily: font, lineHeight: 1 }}>{allDone ? "✓" : completedCount}</span>
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: font }}>{allDone ? "Done" : `of ${phases.length}`}</span>
                  </div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: allDone ? C.success : isFailed ? C.error : C.gold, fontFamily: font, marginTop: 8 }}>
                  {allDone ? "All phases complete" : isFailed ? "Generation stopped" : `Running phase ${currentPhase}...`}
                </div>
              </div>
              {phases.map((phase, i) => {
                const ps = getPhaseStatus(phase.id);
                return (
                  <div key={phase.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < phases.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      background: ps === "done" ? C.success : ps === "error" ? C.error : ps === "running" ? C.gold : C.creamDark,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: ps !== "pending" ? C.white : C.muted, fontWeight: 700,
                    }}>
                      {ps === "done" ? "✓" : ps === "error" ? "✗" : ps === "running" ? "…" : ""}
                    </div>
                    <span style={{ fontSize: 14, fontFamily: font, lineHeight: 1.4, color: ps === "pending" ? C.muted : C.text, fontWeight: ps === "running" ? 700 : 400 }}>
                      {phase.title}
                    </span>
                    {ps === "done" && (
                      <span style={{
                        marginLeft: "auto", fontSize: 9, fontWeight: 700, fontFamily: font,
                        padding: "2px 5px", borderRadius: 4,
                        background: getModelLabel(phase.id) === 'Haiku' ? "rgba(45,106,79,0.12)" : "rgba(201,151,58,0.15)",
                        color: getModelLabel(phase.id) === 'Haiku' ? C.success : C.gold,
                      }}>
                        {getModelLabel(phase.id)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Educational block 1: Why handwritten notes */}
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px", boxShadow: "0 2px 12px rgba(27,42,74,0.06)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: 10, fontFamily: font }}>
                While you wait
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: font, marginBottom: 10, lineHeight: 1.4 }}>
                The one move that cuts through the noise
              </div>
              <p style={{ fontSize: 13, color: C.muted, fontFamily: font, lineHeight: 1.7, margin: "0 0 10px" }}>
                Most agents reach out to referral partners by email or phone. Which means every financial advisor, estate attorney, and mortgage broker in your market already has a pile of agent intros in their inbox.
              </p>
              <p style={{ fontSize: 13, color: C.muted, fontFamily: font, lineHeight: 1.7, margin: "0 0 10px" }}>
                A handwritten note lands differently. Before you've asked for anything, before you've mentioned referrals, before a single follow-up call — a physical note on their desk signals that you're the kind of person who does things others don't bother to do.
              </p>
              <p style={{ fontSize: 13, color: C.text, fontFamily: font, lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
                Your blueprint gives you exactly what to write. Send the note first. Then follow up.
              </p>
            </div>

            {/* Educational block 2: NurturInk soft intro */}
            <div style={{ background: C.navy, borderRadius: 14, padding: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(201,151,58,0.2), transparent 65%)" }} />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.goldLight, marginBottom: 10, fontFamily: font, position: "relative" }}>
                The tedious part
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: font, marginBottom: 10, lineHeight: 1.4, position: "relative" }}>
                Writing 20-30 individual notes by hand takes more time than most agents stick with
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontFamily: font, lineHeight: 1.7, margin: "0 0 16px", position: "relative" }}>
                NurturInk automates it. Real handwritten notes, real pen on paper, mailed to your list. From $2.50 a card including postage.
              </p>
              <a href="https://nurturink.com" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: C.gold, color: C.navy, textDecoration: "none", fontWeight: 800, fontSize: 15, padding: "10px 14px", borderRadius: 8, fontFamily: font, position: "relative" }}>
                See How NurturInk Works →
              </a>
            </div>

          </div>
        </div>
      </div>

      <footer style={{ background: C.navy, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "18px 24px", fontSize: 12, fontFamily: font }}>
        Powered by{" "}
        <a href="https://nurturink.com" style={{ color: "rgba(201,151,58,0.75)", textDecoration: "none", fontWeight: 600 }}>NurturInk.com</a>
        {" "}· the handwritten follow-up system for relationship-driven sales professionals
      </footer>
    </div>
  );
}