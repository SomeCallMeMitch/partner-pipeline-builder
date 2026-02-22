import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Zap, Target, Users, FileText, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A12" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">Partner Pipeline Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs">Sign In</Button>
          </Link>
          <Link to={createPageUrl("Wizard")}>
            <Button size="sm" className="btn-gradient text-xs">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
          <Zap className="w-3 h-3 text-indigo-400" />
          <span className="text-xs text-indigo-300 font-medium">Dream 100 Methodology · AI-Optimized Prompts</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Build Your Referral<br />
          <span className="gradient-text">Partner System Using AI</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate professional, multi-stage AI prompts engineered for the Dream 100 methodology.
          Tailored to your industry, niche, and the exact LLM you're running them in.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={createPageUrl("Wizard")}>
            <Button className="btn-gradient gap-2 h-12 px-8 text-sm font-semibold">
              Build My Partner System <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-slate-500">Free to start · No credit card required</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-12">How It Works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: FileText, title: "Answer 6 Questions", desc: "Tell us your industry, niche, geography, and sales profile. Takes under 3 minutes." },
            { icon: Target, title: "Select Your AI Model", desc: "Choose from ChatGPT, Claude, Perplexity, or Manus. Prompts are optimized per LLM's strengths." },
            { icon: Users, title: "Get Your Prompt Blueprint", desc: "Receive a copy-paste ready markdown file with structured Dream 100 prompts, ready to run." },
          ].map((item, i) => (
            <div key={i} className="card-surface rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(99,102,241,0.15)" }}>
                <item.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="max-w-5xl mx-auto px-6 py-8 pb-20">
        <div className="card-surface rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">Simple Mode</p>
              <h3 className="text-xl font-bold text-white mb-4">Your 3-Phase Prompt Blueprint</h3>
              <ul className="space-y-2.5">
                {["Strategic Mapping Prompt", "Partner Identification Prompt", "Outreach Script Prompt"].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Advanced Mode · Beta</p>
              <h3 className="text-xl font-bold text-white mb-4">Full 7-Phase Multi-Model System</h3>
              <ul className="space-y-2.5">
                {[
                  "Lifecycle Trigger Mapping",
                  "Upstream + Side-stream Mapping",
                  "Tier Ranking & Influence Prioritization",
                  "Gap & Value-Add Design",
                  "Objection Anticipation",
                  "Script Suite Generator",
                  "Quarterly Reinforcement System",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to build your referral pipeline?</h2>
        <p className="text-slate-400 text-sm mb-8">Create your first Partner Blueprint in under 10 minutes.</p>
        <Link to={createPageUrl("Wizard")}>
          <Button className="btn-gradient gap-2 h-12 px-10 text-sm font-semibold">
            Start Building <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      <footer className="border-t py-6 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-slate-600 text-xs">© 2026 Partner Pipeline Builder · Dream 100 Methodology</p>
      </footer>
    </div>
  );
}