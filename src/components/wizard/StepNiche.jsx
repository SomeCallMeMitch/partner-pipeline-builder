import React from "react";

const PLACEHOLDERS = {
  "Real Estate": "e.g. luxury residential, first-time buyers, multi-family investment, 1031 exchanges, relocation...",
  "Insurance": "e.g. Medicare supplement, key-person life insurance, commercial P&C, group benefits...",
};

const EXAMPLES = {
  "Real Estate": ["Luxury Residential", "First-Time Buyers", "Multi-Family Investment", "Commercial Leasing", "New Construction", "1031 Exchanges"],
  "Insurance": ["Life Insurance", "Medicare Supplement", "Commercial P&C", "Group Benefits", "Disability Income", "Key-Person Coverage"],
};

export default function StepNiche({ value, onChange, industry }) {
  const examples = EXAMPLES[industry] || [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Define Your Niche</h2>
        <p className="text-slate-400 text-sm">Your niche determines which partner types, triggers, and scripts are generated. Be specific — the more precise, the better the output.</p>
        <p className="text-slate-400 text-sm mt-2">You can build as many of these as you'd like — create one for first-time buyers today, then come back and build another for commercial sales later.</p>
      </div>

      <div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={PLACEHOLDERS[industry] || "Describe your specific niche or specialization..."}
          rows={3}
          className="input-dark w-full px-4 py-3 text-sm resize-none"
          style={{ borderRadius: 10 }}
        />
      </div>

      {examples.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2.5">Common niches for {industry}:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map(ex => (
              <button
                key={ex}
                onClick={() => onChange(ex)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${value === ex ? "text-indigo-300" : "text-slate-400 hover:text-slate-200"}`}
                style={{
                  background: value === ex ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${value === ex ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}