import React from "react";
import { Zap, Layers, CheckCircle } from "lucide-react";

const modes = [
  {
    id: "simple",
    icon: Zap,
    label: "Simple",
    badge: "Free",
    badgeColor: "rgba(34,197,94,0.15)",
    badgeText: "#4ade80",
    desc: "3-phase prompt blueprint. Strategic mapping, partner identification, and outreach scripts.",
    features: ["Strategic Mapping Prompt", "Partner Identification Prompt", "Outreach Script Prompt", "Single LLM optimized"],
  },
  {
    id: "advanced",
    icon: Layers,
    label: "Advanced",
    badge: "Beta — Free Now",
    badgeColor: "rgba(139,92,246,0.15)",
    badgeText: "#a78bfa",
    desc: "7-phase full system. Lifecycle mapping, tier ranking, objection handling, script suite, and quarterly reinforcement.",
    features: ["All 7 prompt phases", "Multi-model LLM routing", "Objection Anticipation Playbook", "Quarterly Reinforcement System"],
  },
];

export default function StepMode({ value, onChange, couponCode, onCouponChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Select Your Mode</h2>
        <p className="text-slate-400 text-sm">Simple gets you running in minutes. Advanced unlocks the full Dream 100 system.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modes.map(({ id, icon: Icon, label, badge, badgeColor, badgeText, desc, features }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`card-surface rounded-2xl p-6 text-left transition-all ${value === id ? "card-selected" : ""}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: value === id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)" }}>
                <Icon className={`w-5 h-5 ${value === id ? "text-indigo-400" : "text-slate-400"}`} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: badgeColor, color: badgeText }}>
                {badge}
              </span>
            </div>
            <h3 className={`font-semibold mb-2 text-sm ${value === id ? "text-white" : "text-slate-300"}`}>{label}</h3>
            <p className="text-xs text-slate-500 mb-4">{desc}</p>
            <ul className="space-y-1.5">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${value === id ? "text-indigo-400" : "text-slate-600"}`} />
                  <span className="text-xs text-slate-400">{f}</span>
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {value === "advanced" && (
        <div className="pt-1">
          <label className="text-xs text-slate-400 block mb-2">Coupon Code <span className="text-slate-600">(optional)</span></label>
          <input
            type="text"
            value={couponCode}
            onChange={e => onCouponChange(e.target.value)}
            placeholder="Enter code if you have one"
            className="input-dark w-full px-4 py-2.5 text-sm"
            style={{ borderRadius: 8, maxWidth: 280 }}
          />
        </div>
      )}
    </div>
  );
}