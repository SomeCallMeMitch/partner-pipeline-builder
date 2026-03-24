import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { buildPhasePrompts } from "@/components/engine/phasePromptBuilder";
import { buildPrompts } from "@/components/dream100/promptBuilder";

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

function buildContextForPhase(phaseId, completedResults) {
  const parts = [];
  if (completedResults["1"] && [2, 3, 4, 5, 6, 7].includes(phaseId)) {
    const triggers = extractSection(completedResults["1"], "trigger", 5);
    if (triggers) parts.push(`TOP LIFECYCLE TRIGGERS IDENTIFIED (from Phase 1):\n${triggers}`);
  }
  if (completedResults["2"] && [3, 4, 5, 6, 7].includes(phaseId)) {
    const partners = extractSection(completedResults["2"], "upstream", 8);
    if (partners) parts.push(`KEY PARTNER TYPES IDENTIFIED (from Phase 2):\n${partners}`);
  }
  if (completedResults["3"] && [4, 5, 6, 7].includes(phaseId)) {
    const dream5 = extractDream5(completedResults["3"]);
    if (dream5) parts.push(`THE DREAM 5 PARTNER LIST (from Phase 3 — use these exact partner types):\n${dream5}`);
  }
  if (completedResults["4"] && [5, 6, 7].includes(phaseId)) {
    const valueApproach = extractSection(completedResults["4"], "value gift", 3);
    if (valueApproach) parts.push(`VALUE GIFTS IDENTIFIED (from Phase 4 — reference these in scripts):\n${valueApproach}`);
  }
  if (parts.length === 0) return "";
  return "\n\n" + "=".repeat(50) + "\n" +
    "CONTEXT FROM COMPLETED PHASES — Use this to maintain consistency:\n" +
    "=".repeat(50) + "\n\n" +
    parts.join("\n\n---\n\n") +
    "\n\n" + "=".repeat(50) + "\n" +
    "IMPORTANT: Reference the specific partner types, triggers, and strategies above. " +
    "Do NOT reinvent or contradict them. Build on what was already established.\n" +
    "=".repeat(50);
}

function extractDream5(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const tableLines = [];
  let inTable = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      if (!/^\|[\s-:|]+\|$/.test(trimmed)) tableLines.push(trimmed);
    } else if (inTable && tableLines.length >= 2) break;
  }
  if (tableLines.length >= 3) return tableLines.slice(0, 7).join('\n');
  const numbered = lines.filter(l => /^\s*\d+[\.\)]\s+/.test(l)).slice(0, 5);
  if (numbered.length >= 3) return numbered.join('\n');
  const idx = text.toLowerCase().indexOf('dream 5');
  if (idx >= 0) return text.slice(idx, idx + 400).split('\n').slice(0, 8).join('\n');
  return text.slice(0, 500);
}

function extractSection(text, keyword, maxLines = 5) {
  if (!text) return null;
  const lines = text.split('\n');
  const keyLines = [];
  const kw = keyword.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes(kw) && line.length > 15) {
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        if (lines[j].trim()) keyLines.push(lines[j].trim());
      }
    }
    if (keyLines.length >= maxLines * 2) break;
  }
  return keyLines.length > 0 ? keyLines.slice(0, maxLines * 2).join('\n') : null;
}

function PhaseCard({ phase, status, result, isActive, errorMessage, onRetry, retrying, usage, finalTime }) {
  const [expanded, setExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
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
      background: C.white, borderRadius: 12,
      border: `1px solid ${isActive ? C.gold : isDone ? C.border : isError ? "#FECACA" : C.border}`,
      borderLeft: `4px solid ${borderLeft}`, overflow: "hidden",
      boxShadow: isActive ? `0 0 0 3px rgba(201,151,58,0.15)` : "0 2px 8px rgba(27,42,74,0.05)",
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
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: isPending ? C.muted : C.text, fontFamily: font }}>{phase.title}</span>
        {isActive && <span style={{ fontSize: 14, color: "#000000", fontWeight: 700, fontFamily: "monospace" }}>{fmt(elapsed)}</span>}
        {isDone && <span style={{ fontSize: 12, color: C.success, fontWeight: 600, fontFamily: font }}>Complete{finalTime ? ` · ${Math.floor(finalTime/60)}:${String(finalTime%60).padStart(2,'0')}` : ''}{usage?.wordCount ? ` · ${usage.wordCount.toLocaleString()} words` : ''}</span>}
        {isError && !retrying && (
          <button onClick={(e) => { e.stopPropagation(); onRetry && onRetry(phase.id); }}
            style={{ background: C.errorBg, border: `1px solid ${C.error}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: C.error, fontWeight: 700, fontFamily: font, cursor: "pointer" }}>↺ Retry</button>
        )}
        {isError && retrying && <span style={{ fontSize: 12, color: C.gold, fontWeight: 600, fontFamily: font }}>Retrying...</span>}
        {isDone && <span style={{ color: C.muted, fontSize: 16, lineHeight: 1, marginLeft: 4, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>}
      </div>
      {isError && errorMessage && (
        <div style={{ padding: "8px 18px", fontSize: 12, fontFamily: "monospace", color: C.error, background: C.errorBg, borderTop: `1px solid #FECACA` }}>{errorMessage}</div>
      )}
      {isDone && !expanded && (
        <div onClick={() => setExpanded(true)} style={{ borderTop: `1px solid ${C.border}`, padding: "7px 18px", fontSize: 11, color: C.muted, fontFamily: font, cursor: "pointer", textAlign: "center", background: C.cream }}>Click to expand result</div>
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
  const [retryingPhase, setRetryingPhase] = useState(null);
  const [usageData, setUsageData]       = useState({});
  const [finalTimes, setFinalTimes]     = useState({});
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [engine, setEngine]             = useState("claude");
  const hasAutoRun = useRef(false);
  const resultsRef = useRef({});
  const phaseStartRef = useRef({});
  const phasesTopRef = useRef(null);

  const phases = landingData
    ? buildPrompts(landingData).map(p => ({ id: p.id, title: p.title, prompt: p.prompt }))
    : build ? buildPhasePrompts(build) : [];

  const displayName = landingData
    ? `${landingData.niche || landingData.nicheBase} — ${landingData.geo}`
    : build ? `${build.niche} — ${build.geography}` : "";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Auto-run on mobile only — desktop waits for user to pick engine and click Run
  useEffect(() => {
    if (loading || hasAutoRun.current || phases.length === 0) return;
    hasAutoRun.current = true;
    if (window.innerWidth <= 768) setShowMobileWarning(true);
  }, [loading, phases.length]);

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

  useEffect(() => {
    if (!allDone || running) return;
    const config = landingData
      ? { agentName: landingData.name, niche: landingData.niche || landingData.nicheBase, market: landingData.geo }
      : build ? { agentName: build.name, niche: build.niche, market: build.geography } : {};
    const completedPhases = Object.entries(status).filter(([, s]) => s === "done").map(([id]) => id);
    const failedPhases = Object.entries(status).filter(([, s]) => s === "error").map(([id]) => id);
    const totalWords = Object.values(usageData).reduce((sum, u) => sum + (u?.wordCount || 0), 0);
    try {
      base44.analytics.track("blueprint_run_completed", {
        agent_name: config.agentName || "Unknown", niche: config.niche || "Unknown",
        market: config.market || "Unknown", phases_completed: completedPhases.length,
        phases_failed: failedPhases.length, failed_phase_ids: failedPhases,
        total_words_generated: totalWords, timestamp: new Date().toISOString(),
      });
    } catch (e) { console.warn("Analytics tracking failed:", e); }
  }, [allDone]);

  const SYSTEM_PROMPT = `You are a Strategic Alliances Director specializing in referral partner systems for high-performing real estate professionals. You use the Dream 100 methodology to build systematic referral networks.

Your output style:
- Use markdown formatting with clear headers, tables, and bullet points
- Be specific to the agent's niche and market — never generic
- Prioritize strategic depth and actionable specificity
- Every recommendation should be something the agent can act on this week
- When referencing partner types, use the EXACT types established in earlier phases
- Deliver exactly the deliverables described in the task`;

  async function callClaude(prompt, maxRetries = 1) {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await base44.functions.invoke("invokeClaude", {
          prompt, systemPrompt: SYSTEM_PROMPT, model: "claude-sonnet-4-6", max_tokens: 16000
        });
        const result = response.data?.result;
        if (!result) throw new Error("Empty response from Claude");
        const usage = response.data?.usage || null;
        const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0;
        return { result, usage, wordCount };
      } catch (e) {
        lastError = e;
        if (attempt < maxRetries) await new Promise(r => setTimeout(r, 5000));
      }
    }
    throw lastError;
  }

  async function callAgent(prompt, maxRetries = 1) {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await base44.functions.invoke("invokeAgent", {
          prompt, systemPrompt: SYSTEM_PROMPT,
        });
        const result = response.data?.result;
        if (!result) throw new Error("Empty response from Superagent");
        const usage = response.data?.usage || null;
        const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0;
        return { result, usage, wordCount };
      } catch (e) {
        lastError = e;
        if (attempt < maxRetries) await new Promise(r => setTimeout(r, 5000));
      }
    }
    throw lastError;
  }

  async function callEngine(prompt, maxRetries = 1) {
    return engine === "agent" ? callAgent(prompt, maxRetries) : callClaude(prompt, maxRetries);
  }

  async function runAll() {
    setRunning(true); setResults({}); setStatus({}); setErrors({});
    setAllDone(false); setUsageData({}); setFinalTimes({}); resultsRef.current = {};
    setTimeout(() => {
      if (phasesTopRef.current && window.innerWidth <= 768)
        phasesTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    for (const phase of phases) {
      setActivePhase(phase.id);
      setStatus(s => ({ ...s, [phase.id]: "running" }));
      phaseStartRef.current[phase.id] = Date.now();
      try {
        const context = buildContextForPhase(phase.id, resultsRef.current);
        const fullPrompt = phase.prompt + context;
        const { result, usage, wordCount } = await callEngine(fullPrompt);
        const elapsedSec = Math.round((Date.now() - phaseStartRef.current[phase.id]) / 1000);
        setFinalTimes(ft => ({ ...ft, [phase.id]: elapsedSec }));
        resultsRef.current[phase.id] = result;
        setResults(r => ({ ...r, [phase.id]: result }));
        setUsageData(u => ({ ...u, [phase.id]: { usage, wordCount } }));
        setStatus(s => ({ ...s, [phase.id]: "done" }));
      } catch (e) {
        const elapsedSec = Math.round((Date.now() - phaseStartRef.current[phase.id]) / 1000);
        setFinalTimes(ft => ({ ...ft, [phase.id]: elapsedSec }));
        const msg = e?.response?.data?.error || e?.message || String(e);
        setErrors(err => ({ ...err, [phase.id]: msg }));
        setStatus(s => ({ ...s, [phase.id]: "error" }));
      }
    }
    setActivePhase(null); setRunning(false); setAllDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function retryPhase(phaseId) {
    setRetryingPhase(phaseId); setActivePhase(phaseId);
    setStatus(s => ({ ...s, [phaseId]: "running" }));
    setErrors(err => { const copy = { ...err }; delete copy[phaseId]; return copy; });
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) { setRetryingPhase(null); return; }
    phaseStartRef.current[phaseId] = Date.now();
    try {
      const context = buildContextForPhase(phase.id, resultsRef.current);
      const fullPrompt = phase.prompt + context;
      const { result, usage, wordCount } = await callEngine(fullPrompt, 2);
      const elapsedSec = Math.round((Date.now() - phaseStartRef.current[phaseId]) / 1000);
      setFinalTimes(ft => ({ ...ft, [phaseId]: elapsedSec }));
      resultsRef.current[phase.id] = result;
      setResults(r => ({ ...r, [phase.id]: result }));
      setUsageData(u => ({ ...u, [phase.id]: { usage, wordCount } }));
      setStatus(s => ({ ...s, [phase.id]: "done" }));
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || String(e);
      setErrors(err => ({ ...err, [phaseId]: msg }));
      setStatus(s => ({ ...s, [phaseId]: "error" }));
    }
    setActivePhase(null); setRetryingPhase(null);
    const updatedStatus = { ...status, [phaseId]: resultsRef.current[phaseId] ? "done" : "error" };
    if (phases.every(p => updatedStatus[p.id] === "done" || updatedStatus[p.id] === "error")) setAllDone(true);
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
      if (!res.ok) throw new Error(`Document generation failed (${res.status}): ${await res.text()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Dream100_Blueprint_${(config.agentName || "Blueprint").replace(/\s+/g, "_")}.docx`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch(e) {
      console.error("Word export error:", e);
      alert("Document export failed: " + (e?.message || "Unknown error") + "\n\nTry the Markdown download instead.");
    }
    setExportingWord(false);
  }

  function downloadMarkdown() {
    let full = `# DREAM 100 PARTNER BLUEPRINT\n${displayName}\nGenerated by NurturInk\n\n`;
    for (const phase of phases) {
      if (resultsRef.current[phase.id])
        full += `\n\n${"=".repeat(60)}\n## ${phase.title}\n${"=".repeat(60)}\n\n${resultsRef.current[phase.id]}`;
    }
    const blob = new Blob([full], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Dream100_${(displayName || "Blueprint").replace(/[^a-z0-9]/gi, "_")}.md`;
    a.click(); URL.revokeObjectURL(url);
  }

  const completedCount = Object.values(status).filter(s => s === "done").length;
  const errorCount = Object.values(status).filter(s => s === "error").length;
  const progress = phases.length ? (completedCount / phases.length) * 100 : 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${C.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

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
          .bp-desktop-msg { display: none; }
          .bp-mobile-msg { display: inline; }
        }
        @media (min-width: 769px) { .bp-desktop-msg { display: inline; } .bp-mobile-msg { display: none; } }
        @media (max-width: 480px) { .bp-nav-actions { flex-wrap: wrap; justify-content: center; } }
      `}</style>

      {/* MOBILE WARNING MODAL */}
      {showMobileWarning && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: C.white, borderRadius: 16, padding: "28px 24px", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", fontFamily: font }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gold, marginBottom: 12 }}>Heads Up</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 12, lineHeight: 1.3 }}>This works best on a computer</div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, marginBottom: 8 }}>Your blueprint takes <strong>7–12 minutes</strong> to build. During that time, your phone's browser must stay open — you can't switch to other apps or it may stop.</p>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>For the best experience, try this on your laptop or desktop. You can email yourself the link right now.</p>
            <a href={`mailto:?subject=My%20Dream%20100%20Blueprint&body=Here%E2%80%99s%20the%20link%3A%0A%0Ahttps%3A%2F%2Fpipeline.nurturink.com`}
              style={{ display: "block", textAlign: "center", textDecoration: "none", background: C.navy, color: C.white, borderRadius: 10, padding: "14px 20px", fontWeight: 700, fontSize: 15, fontFamily: font, marginBottom: 10 }}>
              ✉ Email Myself the Link
            </a>
            <button onClick={() => { setShowMobileWarning(false); runAll(); }}
              style={{ display: "block", width: "100%", textAlign: "center", background: C.gold, color: C.navy, border: "none", borderRadius: 10, padding: "14px 20px", fontWeight: 700, fontSize: 15, fontFamily: font, cursor: "pointer", marginBottom: 10 }}>
              Continue on My Phone →
            </button>
            <div style={{ fontSize: 11, color: C.muted, textAlign: "center" }}>We don't collect your email or send you anything.</div>
          </div>
        </div>
      )}

      {/* COMPLETION DOWNLOAD BANNER */}
      {allDone && !running && (
        <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`, padding: "20px 24px", textAlign: "center", borderBottom: `3px solid ${C.gold}` }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: font, marginBottom: 6 }}>✓ Your Blueprint is Ready!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontFamily: font, marginBottom: 16 }}>
              {errorCount > 0 ? `${completedCount} of ${phases.length} phases completed.` : `All ${phases.length} phases complete. Download your personalized Dream 100 strategy below.`}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={downloadWord} disabled={exportingWord} style={{ background: C.gold, color: C.navy, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 800, fontSize: 16, fontFamily: font, cursor: exportingWord ? "not-allowed" : "pointer" }}>
                {exportingWord ? "Building Document..." : "📄 Download Word Doc"}
              </button>
              <button onClick={downloadMarkdown} style={{ background: "transparent", border: `1.5px solid rgba(255,255,255,0.3)`, borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 14, fontFamily: font, color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>
                ↓ Download Markdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP NAV */}
      <div style={{ background: C.navy, boxShadow: "0 2px 20px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="bp-nav-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => navigate(-1)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 15, fontFamily: font }}>AI Blueprint Runner</div>
          </div>

          <div className="bp-nav-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>

            {/* Engine toggle — visible before run starts */}
            {!running && !allDone && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "3px" }}>
                  <button onClick={() => setEngine("claude")} style={{
                    padding: "5px 11px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, fontFamily: font,
                    background: engine === "claude" ? C.gold : "transparent",
                    color: engine === "claude" ? C.navy : "rgba(255,255,255,0.5)",
                    transition: "all 0.2s",
                  }}>Claude</button>
                  <button onClick={() => setEngine("agent")} style={{
                    padding: "5px 11px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, fontFamily: font,
                    background: engine === "agent" ? "#4F8EF7" : "transparent",
                    color: engine === "agent" ? C.white : "rgba(255,255,255,0.5)",
                    transition: "all 0.2s",
                  }}>⚡ Superagent</button>
                </div>
                <button onClick={runAll} style={{
                  background: C.gold, color: C.navy, border: "none", borderRadius: 8,
                  padding: "8px 18px", fontFamily: font, fontWeight: 900, fontSize: 15, cursor: "pointer",
                }}>▶ Run Blueprint</button>
              </>
            )}

            {/* Engine badge while running or done */}
            {(running || allDone) && (
              <div style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: font,
                background: engine === "agent" ? "rgba(79,142,247,0.25)" : "rgba(201,151,58,0.25)",
                color: engine === "agent" ? "#7BB3FF" : C.goldLight,
              }}>
                {engine === "agent" ? "⚡ Superagent" : "Claude"}
              </div>
            )}

            {(running || allDone) && (
              <span style={{ fontSize: 15, color: C.white, fontWeight: 600, fontFamily: font, marginRight: 4 }}>
                {completedCount} of {phases.length} phases{errorCount > 0 && ` · ${errorCount} failed`}
              </span>
            )}
            {allDone && (
              <>
                <button onClick={downloadMarkdown} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.8)", fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>↓ Markdown</button>
                <button onClick={downloadWord} disabled={exportingWord} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.8)", fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  {exportingWord ? "Building..." : "📄 Word Doc"}
                </button>
              </>
            )}
            {running && (
              <div style={{ background: "rgba(201,151,58,0.5)", color: C.navy, border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: font, fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(27,42,74,0.4)", borderTopColor: C.navy, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Running Phase {activePhase}...
              </div>
            )}
            {allDone && (
              <button onClick={() => { setAllDone(false); runAll(); }}
                style={{ background: C.gold, color: C.navy, border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: font, fontWeight: 900, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>↺ Run Again</button>
            )}
          </div>
        </div>

        <div style={{ height: 3, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`, width: `${progress}%`, transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bp-main">
        {running && (
          <div className="bp-warning" style={{ background: C.goldPale, border: `1.5px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16, fontSize: 16, color: "#000000", fontWeight: 600, fontFamily: font }}>
            ⏳ <strong>Your blueprint is building.</strong>{" "}
            <span className="bp-desktop-msg">You can use other windows and tabs — just don't close or navigate away from this one.</span>
            <span className="bp-mobile-msg">Keep this browser tab open and active. Don't switch to other apps until complete.</span>
          </div>
        )}

        {/* Ready state — shown before run starts on desktop */}
        {!running && !allDone && phases.length > 0 && (
          <div style={{ background: C.navy, borderRadius: 14, padding: "20px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "radial-gradient(circle, rgba(201,151,58,0.12), transparent 65%)", pointerEvents: "none" }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.goldLight, marginBottom: 6, fontFamily: font }}>NurturInk · Dream 100 Blueprint</div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 17, fontFamily: font, marginBottom: 4 }}>{displayName}</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, fontFamily: font }}>
              7 phases, each building on the last. Select your AI engine above, then click <strong style={{ color: C.gold }}>▶ Run Blueprint</strong> to begin. Takes approximately <strong style={{ color: C.white }}>7–12 minutes</strong>.
            </div>
          </div>
        )}

        <div className="bp-grid">
          {/* LEFT: Phase cards */}
          <div>
            {(running || allDone) && (
              <div style={{ background: C.navy, borderRadius: 14, padding: "20px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "radial-gradient(circle, rgba(201,151,58,0.12), transparent 65%)", pointerEvents: "none" }} />
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.goldLight, marginBottom: 6, fontFamily: font }}>NurturInk · Dream 100 Blueprint</div>
                <div style={{ color: C.white, fontWeight: 800, fontSize: 17, fontFamily: font, marginBottom: 4 }}>{displayName}</div>
                <div style={{ color: C.white, fontSize: 16, fontFamily: font }}>7 phases, each building on the last. <strong>Total time: approximately 7–12 minutes.</strong></div>
              </div>
            )}

            <div ref={phasesTopRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phases.map(phase => (
                <PhaseCard key={phase.id} phase={phase} status={status[phase.id]} result={results[phase.id]}
                  isActive={activePhase === phase.id} errorMessage={errors[phase.id]}
                  onRetry={retryPhase} retrying={retryingPhase === phase.id}
                  usage={usageData[phase.id]} finalTime={finalTimes[phase.id]} />
              ))}
            </div>

            {allDone && (
              <div style={{ marginTop: 24, background: C.successBg, border: `1.5px solid ${C.success}`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.success, fontFamily: font, marginBottom: 4 }}>
                  ✓ {errorCount === 0 ? `All ${phases.length} Phases Complete` : `${completedCount} of ${phases.length} Phases Complete`}
                </div>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: font }}>
                  {errorCount > 0 ? `${errorCount} phase${errorCount > 1 ? 's' : ''} failed — click "Retry" on any failed phase.` : "Scroll up to download your blueprint, or expand any phase above to review."}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="bp-sidebar">
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
                    <span style={{ fontSize: 22, fontWeight: 800, color: C.navy, fontFamily: font, lineHeight: 1 }}>{allDone && !running ? "✓" : completedCount}</span>
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: font }}>{allDone && !running ? "Done" : `of ${phases.length}`}</span>
                  </div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: allDone ? C.success : running ? C.gold : C.muted, fontFamily: font, marginTop: 8 }}>
                  {allDone ? (errorCount > 0 ? `${completedCount} complete, ${errorCount} failed` : "All phases complete") : running ? `Running phase ${activePhase}...` : "Ready to Run"}
                </div>
                {!running && !allDone && <div style={{ fontSize: 14, color: C.muted, fontFamily: font, marginTop: 2 }}>Select engine and click Run above.</div>}
              </div>
              {phases.map((phase, i) => (
                <div key={phase.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < phases.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: status[phase.id] === "done" ? C.success : status[phase.id] === "error" ? C.error : activePhase === phase.id ? C.gold : C.creamDark,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: (status[phase.id] || activePhase === phase.id) ? C.white : C.muted, fontWeight: 700,
                  }}>
                    {status[phase.id] === "done" ? "✓" : status[phase.id] === "error" ? "✗" : activePhase === phase.id ? "…" : ""}
                  </div>
                  <span style={{ fontSize: 14, fontFamily: font, lineHeight: 1.4, color: !status[phase.id] && activePhase !== phase.id ? C.muted : C.text, fontWeight: activePhase === phase.id ? 700 : 400 }}>{phase.title}</span>
                </div>
              ))}
            </div>

            <div style={{ background: C.navy, borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(201,151,58,0.2), transparent 65%)" }} />
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.goldLight, marginBottom: 8, fontFamily: font, position: "relative" }}>While you wait...</div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", fontFamily: font, lineHeight: 1.6, margin: "0 0 12px", position: "relative" }}>
                When your blueprint is ready, send a handwritten card to your top 3 partners <em style={{ color: C.white }}>before</em> you email or call. It's the move that gets you remembered.
              </p>
              <a href="https://nurturink.com" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: C.gold, color: C.navy, textDecoration: "none", fontWeight: 800, fontSize: 15, padding: "10px 14px", borderRadius: 8, fontFamily: font, position: "relative" }}>See How NurturInk Works →</a>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: C.navy, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "18px 24px", fontSize: 12, fontFamily: font }}>
        Sponsored by{" "}
        <a href="https://nurturink.com" style={{ color: "rgba(201,151,58,0.75)", textDecoration: "none", fontWeight: 600 }}>NurturInk.com</a>
        {" "}· the handwritten follow-up system for relationship-driven sales professionals
      </footer>
    </div>
  );
}
