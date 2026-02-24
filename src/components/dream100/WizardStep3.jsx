import React, { useState } from "react";
import { YEARS_OPTIONS, LLM_OPTIONS } from "./nicheData";

export default function WizardStep3({ formData, onChange, onNext, onBack }) {
  const [nameError, setNameError] = useState(false);

  const handleNext = () => {
    if (!(formData.name || '').trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    onNext();
  };

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">Almost there</div>
      <div className="d100-card-sub">Your name personalizes the outreach scripts so they sound like you, not a template.</div>

      <div className={`d100-field-group ${nameError ? 'd100-has-error' : ''}`}>
        <div className="d100-field-label">Your first name</div>
        <input
          type="text"
          className="d100-input"
          value={formData.name || ''}
          onChange={(e) => { onChange({ name: e.target.value }); setNameError(false); }}
          placeholder="e.g., Sarah"
        />
        {nameError && <div className="d100-error-msg">Please enter your first name.</div>}
      </div>

      <div className="d100-field-group">
        <div className="d100-field-label">Years in real estate <span className="opt">(optional)</span></div>
        <select
          className="d100-select"
          value={formData.years || ''}
          onChange={(e) => onChange({ years: e.target.value })}
        >
          {YEARS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <p className="d100-field-hint">Used to calibrate the tone and positioning of your outreach scripts — a newer agent sounds different than a 15-year veteran.</p>
      </div>

      <div className="d100-field-group">
        <div className="d100-field-label">Which AI tool will you paste these prompts into?</div>
        <select
          className="d100-select"
          value={formData.llm || 'ChatGPT'}
          onChange={(e) => onChange({ llm: e.target.value })}
        >
          {LLM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <p className="d100-field-hint">Choose the one you use most — each prompt will be formatted to get the best results from that tool.</p>
      </div>

      <div className="d100-form-nav">
        <button className="d100-btn-back" onClick={onBack}>← Back</button>
        <button className="d100-btn-next" onClick={handleNext}>Continue →</button>
      </div>
    </div>
  );
}