import React from "react";
import { DollarSign, Clock, Percent, Users } from "lucide-react";

const fields = [
  { key: "avg_deal_size", label: "Average Deal Size", placeholder: "e.g. 450000", icon: DollarSign, prefix: "$", desc: "Avg transaction value" },
  { key: "sales_cycle_months", label: "Sales Cycle Length", placeholder: "e.g. 3", icon: Clock, suffix: "months", desc: "Avg months from contact to close" },
  { key: "referral_revenue_pct", label: "Current Referral Revenue", placeholder: "e.g. 25", icon: Percent, suffix: "%", desc: "% of revenue currently from referrals" },
  { key: "team_size", label: "Team Size", placeholder: "e.g. 4", icon: Users, suffix: "people", desc: "Including yourself" },
];

export default function StepSalesProfile({ values, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Your Sales Profile</h2>
        <p className="text-slate-400 text-sm">These numbers calibrate partner prioritization, reciprocity framing, and volume targets inside your prompts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, icon: Icon, prefix, suffix, desc }) => (
          <div key={key} className="card-surface rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-slate-300">{label}</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{desc}</p>
            <div className="relative flex items-center">
              {prefix && <span className="absolute left-3 text-slate-400 text-sm">{prefix}</span>}
              <input
                type="number"
                value={values[key] || ""}
                onChange={e => onChange(key, e.target.value)}
                placeholder={placeholder}
                className={`input-dark w-full py-2 text-sm ${prefix ? "pl-7 pr-4" : suffix ? "pl-4 pr-16" : "px-4"}`}
                style={{ borderRadius: 8 }}
              />
              {suffix && (
                <span className="absolute right-3 text-slate-500 text-xs">{suffix}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}