import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import StepIndustry from "@/components/wizard/StepIndustry";
import StepNiche from "@/components/wizard/StepNiche";
import StepGeography from "@/components/wizard/StepGeography";
import StepSalesProfile from "@/components/wizard/StepSalesProfile";
import StepMode from "@/components/wizard/StepMode";
import StepModel from "@/components/wizard/StepModel";
import { generatePrompt } from "@/components/engine/promptEngine";
// SignupInfoDialog no longer needed in Wizard — auth happens on Landing

const STEPS = [
  { id: "industry", label: "Industry" },
  { id: "niche", label: "Niche" },
  { id: "geography", label: "Geography" },
  { id: "profile", label: "Sales Profile" },
  { id: "mode", label: "Mode" },
  { id: "model", label: "AI Model" },
];

export default function Wizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    industry: "",
    niche: "",
    geography: "",
    avg_deal_size: "",
    sales_cycle_months: "",
    referral_revenue_pct: "",
    team_size: "",
    mode: "simple",
    coupon_code: "",
    model_selection: "Claude Sonnet",
    optimize_per_phase: false,
  });

  useEffect(() => {
    // no forced login on load — redirect only when saving
  }, []);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const updateProfile = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const canAdvance = () => {
    if (currentStep === 0) return !!form.industry;
    if (currentStep === 1) return !!form.niche.trim();
    if (currentStep === 2) return !!form.geography.trim();
    if (currentStep === 3) return true; // profile optional
    if (currentStep === 4) return !!form.mode;
    if (currentStep === 5) return !!form.model_selection;
    return true;
  };

  const doSave = async () => {
    setSaving(true);
    const output = generatePrompt(form);
    const buildName = `${form.industry} · ${form.niche} · ${new Date().toLocaleDateString()}`;
    const saved = await base44.entities.Build.create({
      name: buildName,
      industry: form.industry,
      niche: form.niche,
      geography: form.geography,
      avg_deal_size: Number(form.avg_deal_size) || null,
      sales_cycle_months: Number(form.sales_cycle_months) || null,
      referral_revenue_pct: Number(form.referral_revenue_pct) || null,
      team_size: Number(form.team_size) || null,
      mode: form.mode,
      model_selection: form.optimize_per_phase ? "Multi-Model" : form.model_selection,
      optimize_per_phase: form.optimize_per_phase,
      coupon_code: form.coupon_code,
      generated_output: output,
      status: "complete",
    });
    navigate(createPageUrl(`Output?id=${saved.id}`));
  };

  const handleLogin = async () => {
    const isAuthed = await base44.auth.isAuthenticated();
    if (isAuthed) { doSave(); return; }
    base44.auth.redirectToLogin(window.location.href);
  };

  const handleSignup = async () => {
    const isAuthed = await base44.auth.isAuthenticated();
    if (isAuthed) { doSave(); return; }
    setShowSignupDialog(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepIndustry value={form.industry} onChange={v => update("industry", v)} />;
      case 1: return <StepNiche value={form.niche} onChange={v => update("niche", v)} industry={form.industry} />;
      case 2: return <StepGeography value={form.geography} onChange={v => update("geography", v)} />;
      case 3: return <StepSalesProfile values={form} onChange={updateProfile} />;
      case 4: return <StepMode value={form.mode} onChange={v => update("mode", v)} couponCode={form.coupon_code} onCouponChange={v => update("coupon_code", v)} />;
      case 5: return <StepModel selectedModel={form.model_selection} onModelChange={v => update("model_selection", v)} />;
      default: return null;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A12" }}>
      <SignupInfoDialog
        open={showSignupDialog}
        onClose={() => setShowSignupDialog(false)}
        onContinue={() => { setShowSignupDialog(false); base44.auth.redirectToLogin(window.location.href); }}
      />
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {STEPS.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: i < currentStep ? "linear-gradient(135deg, #3B82F6, #1D4ED8)" : i === currentStep ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)",
                      color: i <= currentStep ? "#fff" : "rgba(255,255,255,0.6)",
                      border: i === currentStep ? "1px solid rgba(59,130,246,0.6)" : "1px solid transparent",
                    }}
                  >
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px w-4 sm:w-8" style={{ background: i < currentStep ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.2)" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <span className="text-xs text-slate-500">{currentStep + 1} of {STEPS.length}</span>
          </div>
          <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3B82F6, #1D4ED8)" }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-10 min-h-[320px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(s => s - 1)}
            disabled={currentStep === 0}
            className="text-slate-400 hover:text-white gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canAdvance()}
              className="btn-gradient gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleLogin}
                disabled={!canAdvance() || saving}
                variant="outline"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "#ffffff", backgroundColor: "transparent" }}
                className="gap-2 hover:bg-slate-800"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Login &amp; Generate Blueprint
              </Button>
              <Button
                onClick={handleSignup}
                disabled={!canAdvance() || saving}
                className="btn-gradient gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Create Account &amp; Generate Blueprint
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}