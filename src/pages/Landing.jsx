import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dream100Styles from "@/components/dream100/Dream100Styles";
import HeroSection from "@/components/dream100/HeroSection";
import StepBar from "@/components/dream100/StepBar";
import WizardStep1 from "@/components/dream100/WizardStep1";
import WizardStep2 from "@/components/dream100/WizardStep2";
import WizardStep3 from "@/components/dream100/WizardStep3";
import WizardStep4 from "@/components/dream100/WizardStep4";
import GeneratingCard from "@/components/dream100/GeneratingCard";
import { useTheme } from "@/components/ThemeContext";

export default function Landing() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [view, setView] = useState('hero'); // hero | wizard | generating | output
  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState({
    nicheBase: '',
    customNiche: '',
    geo: '',
    client: '',
    challenge: '',
    name: '',
    years: '',
    llm: 'ChatGPT',
  });

  const mainRef = useRef(null);

  const updateForm = (partial) => {
    setFormData(prev => ({ ...prev, ...partial }));
  };

  const scrollToMain = () => {
    setTimeout(() => {
      if (mainRef.current) {
        const offset = mainRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
      }
    }, 50);
  };

  const startWizard = () => {
    setView('wizard');
    setWizardStep(1);
    scrollToMain();
  };

  const goToStep = (step) => {
    setWizardStep(step);
    scrollToMain();
  };

  const handleGenerate = () => {
    setView('generating');
    scrollToMain();

    const niche = formData.customNiche
      ? `${formData.nicheBase} — ${formData.customNiche}`
      : formData.nicheBase;

    const promptFormData = {
      name: formData.name,
      niche: niche,
      nicheBase: formData.nicheBase,
      geo: formData.geo,
      client: formData.client,
      challenge: formData.challenge,
      years: formData.years,
      llm: formData.llm,
    };

    setTimeout(() => {
      sessionStorage.setItem("d100_run_formData", JSON.stringify(promptFormData));
      navigate("/RunBlueprint");
    }, 1500);
  };

  const handleRestart = () => {
    setFormData({
      nicheBase: '', customNiche: '', geo: '', client: '',
      challenge: '', name: '', years: '', llm: 'ChatGPT',
    });
    setView('hero');
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Sora', -apple-system, sans-serif", background: 'var(--cream, #FAF8F4)', minHeight: '100vh' }}>
      <Dream100Styles />

      {/* Nav bar — shown during wizard and output, hidden on hero */}
      {view !== 'hero' && (
        <div className="d100-sticky-nav">
          <div className="d100-nav-top">
            <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" className="d100-logo-wrap">
              <div className="d100-logo-mark">{theme.logoMark}</div>
              <div>
                <div className="d100-logo-text">{theme.brandName}</div>
                {view === 'output' && <div style={{ color: '#fff', fontSize: 11, opacity: 0.5 }}>Dream 100 Blueprint</div>}
              </div>
            </a>
            {view === 'wizard' && <StepBar currentStep={wizardStep} visible={true} />}
            <div style={{ display: 'flex', gap: 8 }}>
              {view === 'output' && (
                <button className="d100-header-cta" onClick={handleRestart} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '7px 13px', color: '#fff', fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13 }}>
                  ↺ Start Over
                </button>
              )}
              {view === 'output' && (
                <button className="d100-header-cta" onClick={() => document.dispatchEvent(new CustomEvent('openEmailModal'))} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '7px 13px', color: '#fff', fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13 }}>
                  ✉ Email Me This
                </button>
              )}
              {view !== 'output' && (
                <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" className="d100-header-cta d100-visit-btn">
                  Visit {theme.brandName} →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      {view === 'hero' && <HeroSection onStart={startWizard} />}

      {/* Main Content */}
      {view !== 'hero' && view !== 'output' && (
        <main className="d100-main" ref={mainRef}>
          {view === 'wizard' && wizardStep === 1 && (
            <WizardStep1 formData={formData} onChange={updateForm} onNext={() => goToStep(2)} />
          )}
          {view === 'wizard' && wizardStep === 2 && (
            <WizardStep2 formData={formData} onChange={updateForm} onNext={() => goToStep(3)} onBack={() => goToStep(1)} />
          )}
          {view === 'wizard' && wizardStep === 3 && (
            <WizardStep3 formData={formData} onChange={updateForm} onNext={() => goToStep(4)} onBack={() => goToStep(2)} />
          )}
          {view === 'wizard' && wizardStep === 4 && (
            <WizardStep4 formData={formData} onBack={() => goToStep(3)} onGenerate={handleGenerate} />
          )}
          {view === 'generating' && <GeneratingCard />}
        </main>
      )}

      {/* Footer — only shown outside hero */}
      {view !== 'hero' && (
        <footer className="d100-site-footer" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
          <p>This free tool is brought to you by <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.15rem', fontWeight: 600 }}>{theme.brandName}</a> — {theme.footerText}.</p>
          <p style={{ marginTop: 5 }}>&copy; 2025 {theme.brandName} &nbsp;&middot;&nbsp; <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.15rem', fontWeight: 600 }}>Learn More</a></p>
        </footer>
      )}
    </div>
  );
}