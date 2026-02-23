import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Zap, Target, Users, FileText, CheckCircle, TrendingUp, Shield, RefreshCw } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) navigate(createPageUrl("Dashboard"));
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A12" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-lg">Partner Pipeline Builder</span>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white hover:text-white text-base" onClick={() => base44.auth.redirectToLogin()}>Sign In</Button>
            <Button size="sm" className="btn-gradient text-base px-5" onClick={() => base44.auth.redirectToLogin(window.location.href + '?signup=true')}>Create an Account</Button>
          </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
          <Zap className="w-4 h-4 text-indigo-300" />
          <span className="text-base text-white font-medium">AI-Optimized · Built for Real Estate & Insurance Pros</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          The Most Stable Growth Channel<br />
          <span className="gradient-text">You Haven't Systematized Yet</span>
        </h1>

        <p className="text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed" style={{ opacity: 0.85 }}>
          Partner Pipeline Builder helps you design an intentional referral partner system — using AI — built on the Dream 100 methodology.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={createPageUrl("Wizard")}>
            <Button className="btn-gradient gap-2 h-14 px-10 text-lg font-semibold">
              Build My Partner System <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-lg text-white" style={{ opacity: 0.7 }}>Free to start · No credit card required</p>
        </div>
      </section>

      {/* Problem / Contrast Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-2xl p-10 sm:p-14" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="text-base font-semibold uppercase tracking-widest text-indigo-300 mb-6 text-center">You're Already Using These</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: TrendingUp, label: "Advertising", desc: "A proven way to generate awareness and inbound interest at scale." },
              { icon: Users, label: "Networking", desc: "Relationship-driven and effective for building visibility in your market." },
              { icon: RefreshCw, label: "Purchased Leads", desc: "A consistent source of volume to keep your pipeline moving." },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center p-6 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <Icon className="w-5 h-5 text-indigo-300" />
                </div>
                <p className="font-semibold text-white mb-2">{label}</p>
                <p className="text-sm text-white leading-relaxed" style={{ opacity: 0.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2.5rem" }}>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-4">But there's one channel most reps never systematize</p>
            <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed max-w-2xl mx-auto" style={{ opacity: 0.9 }}>
              Referral partnerships with trusted professionals who{" "}
              <span className="text-blue-400 font-semibold">already see your ideal clients — before you do.</span>
            </p>
            <p className="mt-5 text-lg text-white" style={{ opacity: 0.65 }}>
              It's additive to everything you're already doing — and it's the most stable, compounding growth channel available to you. Partner Pipeline Builder helps you build it intentionally.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-center text-lg font-semibold uppercase tracking-widest text-indigo-300 mb-12">How It Works</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: FileText, step: "01", title: "Answer 6 Questions", desc: "Tell us your industry, niche, geography, and sales profile. Takes under 3 minutes." },
            { icon: Target, step: "02", title: "Select Your AI Model", desc: "Choose from ChatGPT, Claude, Perplexity, or Manus. Prompts are optimized per LLM's strengths." },
            { icon: Shield, step: "03", title: "Get Your Prompt Blueprint", desc: "Receive a copy-paste ready markdown file with structured Dream 100 prompts, ready to run." },
          ].map((item, i) => (
            <div key={i} className="card-surface rounded-2xl p-8 relative">
              <span className="absolute top-6 right-6 text-3xl font-bold" style={{ color: "rgba(99,102,241,0.12)" }}>{item.step}</span>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(99,102,241,0.15)" }}>
                <item.icon className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="font-semibold text-white mb-3 text-xl">{item.title}</h3>
              <p className="text-white text-lg leading-relaxed" style={{ opacity: 0.75 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="max-w-5xl mx-auto px-6 py-8 pb-16">
        <p className="text-center text-lg font-semibold uppercase tracking-widest text-indigo-300 mb-12">What You Get</p>
        <div className="card-surface rounded-2xl p-10 sm:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-base font-semibold uppercase tracking-widest text-indigo-300 mb-4">Simple Mode</p>
              <h3 className="text-2xl font-bold text-white mb-5">Your 3-Phase Prompt Blueprint</h3>
              <ul className="space-y-4">
                {["Strategic Mapping Prompt", "Partner Identification Prompt", "Outreach Script Prompt"].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span className="text-white text-lg">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-base font-semibold uppercase tracking-widest text-purple-300 mb-4">Advanced Mode · Beta</p>
              <h3 className="text-2xl font-bold text-white mb-5">Full 7-Phase Multi-Model System</h3>
              <ul className="space-y-4">
                {[
                  "Lifecycle Trigger Mapping",
                  "Upstream + Side-stream Mapping",
                  "Tier Ranking & Influence Prioritization",
                  "Gap & Value-Add Design",
                  "Objection Anticipation",
                  "Script Suite Generator",
                  "Quarterly Reinforcement System",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-white text-lg">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
          Ready to build the growth channel<br className="hidden sm:block" /> that compounds over time?
        </h2>
        <p className="text-white text-xl mb-10" style={{ opacity: 0.8 }}>Create your first Partner Blueprint in under 10 minutes.</p>
        <Link to={createPageUrl("Wizard")}>
          <Button className="btn-gradient gap-2 h-14 px-12 text-lg font-semibold">
            Start Building <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>

      <footer className="border-t py-8 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-white text-base" style={{ opacity: 0.5 }}>© 2026 Partner Pipeline Builder</p>
      </footer>
    </div>
  );
}