import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Zap, Target, Users, FileText, CheckCircle, TrendingUp, Shield, RefreshCw } from "lucide-react";
import SignupInfoDialog from "@/components/SignupInfoDialog";

export default function Landing() {
  const navigate = useNavigate();
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) navigate(createPageUrl("Dashboard"));
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B1220", color: "#FFFFFF", lineHeight: "1.7" }}>

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
          <Button size="sm" className="btn-gradient text-base px-5" onClick={() => setShowSignupDialog(true)}>Create an Account</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}>
          <Zap className="w-4 h-4 text-indigo-300" />
          <span className="text-base text-white font-semibold">AI-Optimized · Built for Real Estate & Insurance Pros</span>
        </div>

        <h1 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(2.6rem, 6vw, 4rem)" }}>
          The Most Stable Growth Channel<br />
          <span style={{ background: "linear-gradient(90deg, #3B82F6, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            You Haven't Systematized Yet
          </span>
        </h1>

        <p className="text-lg text-white font-medium mb-3" style={{ opacity: 0.75, letterSpacing: "0.01em" }}>
          Referral partnerships compound. Most reps never systematize them.
        </p>

        <p className="text-xl text-white max-w-2xl mx-auto mb-12 leading-relaxed" style={{ opacity: 0.9, lineHeight: "1.75" }}>
          Partner Pipeline Builder helps you design an intentional referral partner system — using AI — built on the Dream 100 methodology.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-4px", borderRadius: "14px", background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", filter: "blur(16px)", opacity: 0.5, zIndex: 0 }} />
            <Button className="btn-gradient gap-2 h-14 px-10 text-lg font-semibold" style={{ position: "relative", zIndex: 1 }} onClick={() => base44.auth.redirectToLogin(createPageUrl("Wizard"))}>
              Build My Partner System <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-base text-white" style={{ opacity: 0.7 }}>Free to start · No credit card required</p>
        </div>
      </section>

      {/* Problem / Contrast Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl p-10 sm:p-14" style={{ background: "#0F1B2E", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
          <p className="text-base font-bold uppercase tracking-widest text-indigo-300 mb-8 text-center" style={{ letterSpacing: "0.12em" }}>You're Already Using These</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: TrendingUp, label: "Advertising", desc: "A proven way to generate awareness and inbound interest at scale." },
              { icon: Users, label: "Networking", desc: "Relationship-driven and effective for building visibility in your market." },
              { icon: RefreshCw, label: "Purchased Leads", desc: "A consistent source of volume to keep your pipeline moving." },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center p-6 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(99,102,241,0.15)" }}>
                  <Icon className="w-5 h-5 text-indigo-300" />
                </div>
                <p className="font-bold text-white mb-2 text-lg">{label}</p>
                <p className="text-white leading-relaxed" style={{ opacity: 0.85, fontSize: "1rem", lineHeight: "1.7" }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2.5rem" }}>
            <p className="font-bold uppercase tracking-widest text-blue-400 mb-5" style={{ fontSize: "0.9rem", letterSpacing: "0.1em" }}>But there's one channel most reps never systematize</p>
            <p className="text-white font-medium leading-relaxed max-w-2xl mx-auto" style={{ fontSize: "1.25rem", lineHeight: "1.75", opacity: 1 }}>
              Referral partnerships with trusted professionals who{" "}
              <span className="text-blue-400 font-semibold">already see your ideal clients — before you do.</span>
            </p>
            <p className="mt-6 text-white max-w-2xl mx-auto" style={{ opacity: 0.9, fontSize: "1.05rem", lineHeight: "1.7" }}>
              It's additive to everything you're already doing — and it's the most stable, compounding growth channel available to you. Partner Pipeline Builder helps you build it intentionally.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-center font-bold uppercase tracking-widest text-indigo-300 mb-14" style={{ fontSize: "0.9rem", letterSpacing: "0.12em" }}>How It Works</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FileText, step: "01", title: "Answer 6 Questions", desc: "Tell us your industry, niche, geography, and sales profile. Takes under 3 minutes." },
            { icon: Target, step: "02", title: "Select Your AI Model", desc: "Choose from ChatGPT, Claude, Perplexity, or Manus. Prompts are optimized per LLM's strengths." },
            { icon: Shield, step: "03", title: "Get Your Prompt Blueprint", desc: "Receive a copy-paste ready markdown file with structured Dream 100 prompts, ready to run." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-8 relative" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
              <span className="absolute top-6 right-6 text-3xl font-bold" style={{ color: "rgba(99,102,241,0.15)" }}>{item.step}</span>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(99,102,241,0.15)" }}>
                <item.icon className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="font-bold text-white mb-3" style={{ fontSize: "1.2rem" }}>{item.title}</h3>
              <p className="text-white leading-relaxed" style={{ opacity: 0.9, fontSize: "1rem", lineHeight: "1.7" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="text-center font-bold uppercase tracking-widest text-indigo-300 mb-14" style={{ fontSize: "0.9rem", letterSpacing: "0.12em" }}>What You Get</p>
        <div className="rounded-2xl p-10 sm:p-14" style={{ background: "#0F1B2E", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="font-bold uppercase tracking-widest text-indigo-300 mb-4" style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}>Simple Mode</p>
              <h3 className="font-bold text-white mb-6" style={{ fontSize: "1.4rem" }}>Your 3-Phase Prompt Blueprint</h3>
              <ul className="space-y-4">
                {["Strategic Mapping Prompt", "Partner Identification Prompt", "Outreach Script Prompt"].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.2)" }}>
                      <CheckCircle className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-white" style={{ fontSize: "1.05rem" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold uppercase tracking-widest text-purple-300 mb-4" style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}>Advanced Mode · Beta</p>
              <h3 className="font-bold text-white mb-6" style={{ fontSize: "1.4rem" }}>Full 7-Phase Multi-Model System</h3>
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
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,92,246,0.2)" }}>
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-white" style={{ fontSize: "1.05rem" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
        <h2 className="font-bold text-white mb-5 leading-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Ready to build the growth channel<br className="hidden sm:block" /> that compounds over time?
        </h2>
        <p className="text-white mb-12" style={{ opacity: 0.9, fontSize: "1.15rem", lineHeight: "1.7" }}>Create your first Partner Blueprint in under 10 minutes.</p>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ position: "absolute", inset: "-4px", borderRadius: "14px", background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", filter: "blur(16px)", opacity: 0.5, zIndex: 0 }} />
          <Button className="btn-gradient gap-2 h-14 px-12 text-lg font-semibold" style={{ position: "relative", zIndex: 1 }} onClick={() => base44.auth.redirectToLogin(createPageUrl("Wizard"))}>
            Start Building <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <footer className="border-t py-10 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-white" style={{ opacity: 0.6, fontSize: "1rem" }}>© 2026 Partner Pipeline Builder</p>
      </footer>
    </div>
  );
}