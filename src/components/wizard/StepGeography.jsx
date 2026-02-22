import React from "react";
import { MapPin } from "lucide-react";

export default function StepGeography({ value, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Define Your Geography</h2>
        <p className="text-slate-400 text-sm">Your market area shapes partner density, naming, and local market context within each prompt.</p>
      </div>

      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. Austin, TX · South Florida · Pacific Northwest · National"
          className="input-dark w-full pl-10 pr-4 py-3 text-sm"
          style={{ borderRadius: 10 }}
        />
      </div>

      <div>
        <p className="text-xs text-slate-500 mb-2.5">Quick select:</p>
        <div className="flex flex-wrap gap-2">
          {["City-specific", "Metro area", "Statewide", "Regional", "National"].map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt === value ? "" : opt)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${value === opt ? "text-indigo-300" : "text-slate-400 hover:text-slate-200"}`}
              style={{
                background: value === opt ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${value === opt ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}