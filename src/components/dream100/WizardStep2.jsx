import React, { useState } from "react";
import { CHALLENGES } from "./nicheData";

export default function WizardStep2({ formData, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};
    if (!(formData.geo || '').trim()) newErrors.geo = true;
    if (!formData.challenge) newErrors.challenge = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">Your market & challenge</div>
      <div className="d100-card-sub">The more specific your market, the more targeted your partner list. <strong>You can also come back and redo this for different cities or neighborhoods.</strong></div>

      <div className={`d100-field-group ${errors.geo ? 'd100-has-error' : ''}`}>
        <div className="d100-field-label">Your primary market area</div>
        <input
          type="text"
          className="d100-input"
          value={formData.geo || ''}
          onChange={(e) => { onChange({ geo: e.target.value }); setErrors(prev => ({ ...prev, geo: false })); }}
          placeholder="e.g., Scottsdale, AZ · Buckhead, Atlanta · The Hamptons, NY"
        />
        <p className="d100-field-hint">City, metro, neighborhood, or county. Be as specific as possible — "North Scottsdale" beats "Arizona."</p>
        {errors.geo && <div className="d100-error-msg">Please enter your market area.</div>}
      </div>

      <div className="d100-field-group">
        <div className="d100-field-label">Describe your ideal client <span className="opt">(optional — adds a lot of value)</span></div>
        <textarea
          className="d100-textarea"
          value={formData.client || ''}
          onChange={(e) => onChange({ client: e.target.value })}
          placeholder="e.g., Couples 45–65 with $1M+ in equity looking to downsize to a maintenance-free condo or 55+ community near good healthcare..."
        />
        <p className="d100-field-hint">Demographics, lifestyle, financial situation, motivations — anything that makes them distinct from the average buyer or seller.</p>
      </div>

      <div className={`d100-field-group ${errors.challenge ? 'd100-has-error' : ''}`}>
        <div className="d100-field-label">Your biggest referral challenge right now</div>
        <select
          className="d100-select"
          value={formData.challenge || ''}
          onChange={(e) => { onChange({ challenge: e.target.value }); setErrors(prev => ({ ...prev, challenge: false })); }}
        >
          <option value="" disabled>Select your challenge...</option>
          {CHALLENGES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <p className="d100-field-hint">This shapes your objection handling and outreach scripts — your prompts will directly address your specific situation.</p>
        {errors.challenge && <div className="d100-error-msg">Please select your biggest challenge.</div>}
      </div>

      <div className="d100-form-nav">
        <button className="d100-btn-back" onClick={onBack}>← Back</button>
        <button className="d100-btn-next" onClick={handleNext}>Continue →</button>
      </div>
    </div>
  );
}