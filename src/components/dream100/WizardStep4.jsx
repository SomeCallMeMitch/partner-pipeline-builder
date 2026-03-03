import React from "react";

export default function WizardStep4({ formData, onBack, onGenerate, onRunDirect }) {
  const niche = formData.customNiche
    ? `${formData.nicheBase} — ${formData.customNiche}`
    : formData.nicheBase || '—';

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">Ready to build your blueprint</div>
      <div className="d100-card-sub">Here's what we're building. Your personalized Dream 100 strategy will be ready in about 9–15 minutes.</div>

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
        We'll run <strong>9 AI-powered phases</strong> covering: lifecycle trigger mapping, partner identification, tier ranking, value strategy cards, objection prep, outreach scripts including a handwritten note template, and a 90-day follow-up system — all built for <strong>{niche}</strong> in <strong>{formData.geo || 'your market'}</strong>.
        <br /><br />
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Takes approximately <strong style={{ color: 'var(--navy)' }}>9–15 minutes</strong>. Progress shows live as each phase completes. You'll get a downloadable Word document when it's done.
        </span>
      </div>

      <div className="d100-form-nav">
        <button className="d100-btn-back" onClick={onBack}>← Back</button>
        <button className="d100-btn-generate" onClick={onRunDirect || onGenerate}>⚡ Build My Blueprint</button>
      </div>

      {onRunDirect && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button
            onClick={onGenerate}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Sora', sans-serif",
              textDecoration: 'underline', fontWeight: 500,
            }}
          >
            Prefer to run the prompts yourself? Download them instead →
          </button>
        </div>
      )}
    </div>
  );
}