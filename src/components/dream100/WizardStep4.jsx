import React from "react";

export default function WizardStep4({ formData, onBack, onGenerate }) {
  const niche = formData.customNiche
    ? `${formData.nicheBase} — ${formData.customNiche}`
    : formData.nicheBase || '—';

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">Ready to generate</div>
      <div className="d100-card-sub">Here's what's going into your blueprint. Tap Generate to build all your prompts.</div>

      <div className="d100-confirm-box">
        <div className="d100-confirm-row">
          <span className="d100-confirm-icon">🏡</span>
          <div>
            <div className="d100-confirm-label">Niche</div>
            <div className="d100-confirm-value">{niche}</div>
          </div>
        </div>
        <div className="d100-confirm-row">
          <span className="d100-confirm-icon">📍</span>
          <div>
            <div className="d100-confirm-label">Market</div>
            <div className="d100-confirm-value">{formData.geo || '—'}</div>
          </div>
        </div>
        <div className="d100-confirm-row">
          <span className="d100-confirm-icon">👤</span>
          <div>
            <div className="d100-confirm-label">Name</div>
            <div className="d100-confirm-value">{formData.name || '—'}</div>
          </div>
        </div>
      </div>

      <div className="d100-confirm-what">
        You'll get <strong>7 personalized AI prompts</strong> covering: lifecycle trigger mapping, partner identification, Dream 5 ranking, value strategy cards, objection prep, outreach scripts including a handwritten note template, and a 90-day launch plan with 12-month calendar — all built for <strong>{niche}</strong> in <strong>{formData.geo || 'your market'}</strong>.
      </div>

      <div className="d100-form-nav">
        <button className="d100-btn-back" onClick={onBack}>← Back</button>
        <button className="d100-btn-generate" onClick={onGenerate}>⚡ Generate My Blueprint</button>
      </div>
    </div>
  );
}