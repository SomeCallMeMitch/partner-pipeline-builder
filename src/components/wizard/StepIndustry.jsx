import React from "react";
import { Building2, ShieldCheck } from "lucide-react";

const industries = [
  {
    id: "Real Estate",
    icon: Building2,
    label: "Real Estate",
    desc: "Residential, commercial, investment, relocation",
    examples: "Luxury homes, first-time buyers, multi-family, 1031 exchanges",
  },
  {
    id: "Insurance",
    icon: ShieldCheck,
    label: "Insurance",
    desc: "Life, P&C, Commercial, Medicare, Group Benefits",
    examples: "Life insurance, P&C personal lines, commercial, Medicare supplement",
  },
];

export default function StepIndustry({ value, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Select Your Industry</h2>
        <p className="text-slate-400 text-sm">Your industry shapes every prompt, partner type, and script tone generated.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {industries.map(({ id, icon: Icon, label, desc, examples }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`card-surface rounded-2xl p-6 text-left transition-all ${value === id ? "card-selected" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: value === id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)" }}>
              <Icon className={`w-5 h-5 ${value === id ? "text-indigo-400" : "text-slate-400"}`} />
            </div>
            <h3 className={`font-semibold mb-1 text-sm ${value === id ? "text-white" : "text-slate-300"}`}>{label}</h3>
            <p className="text-xs text-slate-500 mb-2">{desc}</p>
            <p className="text-xs text-slate-600 italic">{examples}</p>
          </button>
        ))}
      </div>
    </div>
  );
}