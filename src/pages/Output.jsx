import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, Loader2, ArrowLeft, Edit2 } from "lucide-react";

export default function Output() {
  const navigate = useNavigate();
  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) { navigate(createPageUrl("Dashboard")); return; }
    base44.entities.Build.filter({ id }).then(results => {
      if (results[0]) { setBuild(results[0]); setNameVal(results[0].name); }
      setLoading(false);
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(build.generated_output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([build.generated_output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${build.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRename = async () => {
    await base44.entities.Build.update(build.id, { name: nameVal });
    setBuild(b => ({ ...b, name: nameVal }));
    setEditingName(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0A12" }}>
      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
    </div>
  );

  if (!build) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400" style={{ backgroundColor: "#0A0A12" }}>
      Build not found.
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A12" }}>
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white h-8 w-8"
              onClick={() => navigate(createPageUrl("Dashboard"))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  className="input-dark px-3 py-1.5 text-sm"
                  style={{ borderRadius: 8, minWidth: 200 }}
                  autoFocus
                  onKeyDown={e => e.key === "Enter" && handleRename()}
                />
                <Button size="sm" className="btn-gradient h-7 px-3 text-xs" onClick={handleRename}>Save</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-slate-400" onClick={() => setEditingName(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-white">{build.name}</h1>
                <button onClick={() => setEditingName(true)} className="text-slate-600 hover:text-slate-300 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
              {build.mode === "advanced" ? "Advanced" : "Simple"} · {build.model_selection}
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs h-8" style={{ borderColor: "rgba(255,255,255,0.25)", color: "#cbd5e1", backgroundColor: "transparent" }}>
              {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </Button>
            <Button size="sm" className="btn-gradient gap-1.5 text-xs h-8" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" /> Download .md
            </Button>
          </div>
        </div>

        {/* Execution Note */}
        <div className="rounded-xl p-4 mb-6 text-xs leading-relaxed text-slate-400" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <span className="text-indigo-300 font-semibold">How to use this blueprint: </span>
          Each section is a standalone prompt. Run them in the order shown. Copy each prompt into your chosen AI model and complete it fully before running the next. The output of one phase informs the next.
        </div>

        {/* Output */}
        <div
          className="rounded-2xl p-6 sm:p-8 font-mono text-xs leading-relaxed text-slate-300 overflow-auto scrollbar-dark"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: "70vh",
            lineHeight: 1.8,
          }}
        >
          {build.generated_output}
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" className="text-slate-500 hover:text-white text-xs gap-2" onClick={() => navigate(createPageUrl("Dashboard"))}>
            <ArrowLeft className="w-3.5 h-3.5" /> My Builds
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs h-8 border-slate-700 text-slate-300 hover:text-white">
              {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
            </Button>
            <Button size="sm" className="btn-gradient gap-1.5 text-xs h-8" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" /> Download .md
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}