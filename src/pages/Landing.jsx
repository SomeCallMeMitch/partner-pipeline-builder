import React, { useState, useRef } from "react";
import Dream100Styles from "@/components/dream100/Dream100Styles";
import HeroSection from "@/components/dream100/HeroSection";
import StepBar from "@/components/dream100/StepBar";
import WizardStep1 from "@/components/dream100/WizardStep1";
import WizardStep2 from "@/components/dream100/WizardStep2";
import WizardStep3 from "@/components/dream100/WizardStep3";
import WizardStep4 from "@/components/dream100/WizardStep4";
import GeneratingCard from "@/components/dream100/GeneratingCard";
import OutputView from "@/components/dream100/OutputView";
import { buildPrompts } from "@/components/dream100/promptBuilder";

export default function Landing() {
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
  const [prompts, setPrompts] = useState([]);
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

    // Build niche string for prompt builder
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
      const generated = buildPrompts(promptFormData);
      setPrompts(generated);
      setView('output');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const handleRestart = () => {
    setFormData({
      nicheBase: '', customNiche: '', geo: '', client: '',
      challenge: '', name: '', years: '', llm: 'ChatGPT',
    });
    setPrompts([]);
    setView('hero');
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Sora', -apple-system, sans-serif", background: 'var(--cream, #FAF8F4)', minHeight: '100vh' }}>
      <Dream100Styles />

      {/* Step Bar (only visible during wizard) */}
      {view === 'wizard' && (
        <div className="d100-sticky-nav">
          <StepBar currentStep={wizardStep} visible={true} />
        </div>
      )}

      {/* Hero */}
      {view === 'hero' && <HeroSection onStart={startWizard} />}

      {/* Main Content */}
      {view !== 'hero' && (
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
          {view === 'output' && (
            <OutputView formData={formData} prompts={prompts} onRestart={handleRestart} />
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="d100-site-footer" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
        <p>This free tool is brought to you by <a href="http://NurturInk.com/realestate" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.15rem', fontWeight: 600 }}>NurturInk</a> — the handwritten follow-up system for relationship-driven sales professionals.</p>
        <p style={{ marginTop: 5 }}>&copy; 2025 NurturInk &nbsp;&middot;&nbsp; <a href="http://NurturInk.com/realestate" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.15rem', fontWeight: 600 }}>Real Estate Solutions</a></p>
      </footer>
    </div>
  );
}