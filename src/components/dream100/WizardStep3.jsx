import React, { useState } from "react";
import { YEARS_OPTIONS } from "./nicheData";
import { sanitizeInput, FIELD_LIMITS } from "@/lib/inputValidation";

export default function WizardStep3({ formData, onChange, onNext, onBack }) {
  const [nameError, setNameError] = useState(false);
  const [yearsError, setYearsError] = useState(false);

  const handleNext = () => {
    if (!(formData.name || '').trim()) {
      setNameError(true);
      return;
    }
    if (!formData.years) {
      setYearsError(true);
      return;
    }
    setNameError(false);
    setYearsError(false);
    onNext();
  };

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">Almost there</div>
      <div className="d100-card-sub">Your name and experience level personalize the outreach scripts so they sound like you, not a template.</div>

      <div className={`d100-field-group ${nameError ? 'd100-has-error' : ''}`}>
        <div className="d100-field-label">Your first name</div>
        <input
          type="text"
          className="d100-input"
          value={formData.name || ''}
          maxLength={FIELD_LIMITS.name}
          onChange={(e) => { onChange({ name: sanitizeInput(e.target.value, FIELD_LIMITS.name) }); setNameError(false); }}
          placeholder="e.g., Sarah"
        />
        {nameError && <div className="d100-error-msg">Please enter your first name.</div>}
      </div>

      <div className={`d100-field-group ${yearsError ? 'd100-has-error' : ''}`}>
        <div className="d100-field-label">Years in real estate</div>
        <select
          className="d100-select"
          value={formData.years || ''}
          onChange={(e) => { onChange({ years: e.target.value }); setYearsError(false); }}
        >
          <option value="" disabled>Select your experience level...</option>
          {YEARS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <p className="d100-field-hint">This changes how confident your scripts sound — a newer agent leads with curiosity, a veteran leads with track record. Pick the closest one.</p>
        {yearsError && <div className="d100-error-msg">Please select your experience level.</div>}
      </div>

      <div className="d100-form-nav">
        <button className="d100-btn-back" onClick={onBack}>← Back</button>
        <button className="d100-btn-next" onClick={handleNext}>Continue →</button>
      </div>
    </div>
  );
}