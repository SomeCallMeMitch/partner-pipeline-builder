import React from "react";
import { DollarSign, Clock, Percent, Users, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const fields = [
  {
    key: "avg_deal_size",
    label: "Average Deal Size",
    icon: DollarSign,
    desc: "Avg transaction value",
    info: "Determines which partners are worth prioritizing and how much leverage each referral represents.",
    options: [
      { label: "Under $50K", value: "40000" },
      { label: "$50K – $100K", value: "75000" },
      { label: "$100K – $250K", value: "175000" },
      { label: "$250K – $500K", value: "375000" },
      { label: "$500K – $1M", value: "750000" },
      { label: "$1M – $2M", value: "1500000" },
      { label: "Over $2M", value: "2500000" },
    ],
  },
  {
    key: "sales_cycle_months",
    label: "Sales Cycle Length",
    icon: Clock,
    desc: "Avg time from contact to close",
    info: "Helps design the right follow-up cadence and referral timing strategy.",
    options: [
      { label: "Less than 1 month", value: "0.5" },
      { label: "1 – 2 months", value: "1.5" },
      { label: "2 – 3 months", value: "2.5" },
      { label: "3 – 6 months", value: "4.5" },
      { label: "6 – 12 months", value: "9" },
      { label: "Over 12 months", value: "14" },
    ],
  },
  {
    key: "referral_revenue_pct",
    label: "Current Referral Revenue",
    icon: Percent,
    desc: "% of revenue currently from referrals",
    info: "Calibrates whether you're building from scratch or optimizing an existing partner network.",
    options: [
      { label: "0% — Starting from scratch", value: "0" },
      { label: "1% – 10%", value: "5" },
      { label: "11% – 25%", value: "18" },
      { label: "26% – 50%", value: "38" },
      { label: "51% – 75%", value: "63" },
      { label: "Over 75%", value: "80" },
    ],
  },
  {
    key: "team_size",
    label: "Team Size",
    icon: Users,
    desc: "Including yourself",
    info: "Ensures your outreach and relationship plan matches your operational capacity.",
    options: [
      { label: "Just me (solo)", value: "1" },
      { label: "2 – 3 people", value: "2" },
      { label: "4 – 6 people", value: "5" },
      { label: "7 – 10 people", value: "8" },
      { label: "11 – 25 people", value: "18" },
      { label: "Over 25 people", value: "30" },
    ],
  },
];

export default function StepSalesProfile({ values, onChange }) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Your Sales Profile</h2>
          <p className="text-slate-400 text-sm">These numbers calibrate partner prioritization, reciprocity framing, and volume targets inside your prompts.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, icon: Icon, desc, info, options }) => (
            <div key={key} className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-slate-300">{label}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-slate-500 hover:text-slate-300 transition-colors ml-1 focus:outline-none">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={6}
                    className="max-w-[220px] text-center text-sm p-3"
                    style={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", color: "#f1f5f9" }}
                  >
                    {info}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-slate-500 mb-3">{desc}</p>
              <select
                value={values[key] || ""}
                onChange={e => onChange(key, e.target.value)}
                className="input-dark w-full py-2 px-3 text-sm appearance-none"
                style={{ borderRadius: 8, cursor: "pointer" }}
              >
                <option value="" disabled style={{ background: "#0F1B2E" }}>Select…</option>
                {options.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: "#0F1B2E" }}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}