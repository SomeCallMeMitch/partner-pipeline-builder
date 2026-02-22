import React from "react";
import { LLM_PROFILES, PHASE_MODEL_MAP } from "@/components/engine/promptEngine";
import { Sparkles } from "lucide-react";

const MODEL_KEYS = Object.keys(LLM_PROFILES);

export default function StepModel({ mode, selectedModel, optimizePerPhase, onModelChange, onOptimizeChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Select Your AI Model</h2>
        <p className="text-slate-400 text-sm">Every prompt is tuned to the specific strengths and formatting expectations of your chosen model.</p>
      </div>

      {mode === "advanced" && (
        <button
          onClick={() => onOptimizeChange(!optimizePerPhase)}
          className={`w-full rounded-2xl p-5 text-left transition-all ${optimizePerPhase ? "card-selected" : "card-surface"}`}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: optimizePerPhase ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)" }}>
              <Sparkles className={`w-5 h-5 ${optimizePerPhase ? "text-indigo-400" : "text-slate-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold text-sm ${optimizePerPhase ? "text-white" : "text-slate-300"}`}>Optimize Each Phase</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>Recommended</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Auto-assigns the best LLM to each of the 7 phases based on task type.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {Object.entries(PHASE_MODEL_MAP).map(([phase, model]) => (
                  <div key={phase} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{phase}:</span>
                    <span className="text-xs text-indigo-300 font-medium">{model}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </button>
      )}

      {mode === "advanced" && optimizePerPhase ? null : (
        <div>
          {mode === "advanced" && (
            <p className="text-xs text-slate-500 mb-3">Or select a single model for all phases:</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODEL_KEYS.map(key => {
              const llm = LLM_PROFILES[key];
              const selected = selectedModel === key && !optimizePerPhase;
              return (
                <button
                  key={key}
                  onClick={() => { onModelChange(key); if (optimizePerPhase) onOptimizeChange(false); }}
                  className={`card-surface rounded-xl p-4 text-left transition-all ${selected ? "card-selected" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-sm ${selected ? "text-white" : "text-slate-300"}`}>{llm.label}</span>
                    {selected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{llm.strengths}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}