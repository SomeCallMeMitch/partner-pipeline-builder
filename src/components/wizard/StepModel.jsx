import React from "react";
import { LLM_PROFILES } from "@/components/engine/promptEngine";

const MODEL_KEYS = Object.keys(LLM_PROFILES);

export default function StepModel({ selectedModel, onModelChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Select Your AI Model</h2>
        <p className="text-slate-400 text-sm">Every prompt is tuned to the specific strengths and formatting expectations of your chosen model.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODEL_KEYS.map(key => {
          const llm = LLM_PROFILES[key];
          const selected = selectedModel === key;
          return (
            <button
              key={key}
              onClick={() => onModelChange(key)}
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
  );
}