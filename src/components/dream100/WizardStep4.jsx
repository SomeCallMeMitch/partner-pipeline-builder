import React, { useState } from "react";

export default function WizardStep4({ formData, onChange, onBack, onGenerate }) {
  const [emailSkipped, setEmailSkipped] = useState(false);

  const niche = formData.customNiche
    ? `${formData.nicheBase} — ${formData.customNiche}`
    : formData.nicheBase || '—';

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const handleSkip = () => {
    onChange({ email: '' });
    setEmailSkipped(true);
  };

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">Ready to generate</div>
      <div className="d100-card-sub">Here's what's going into your blueprint. Tap Generate to build all your prompts.</div>

      {/* Email capture */}
      {!emailSkipped && (
        <div style={{
          background: isMobile ? '#1B2A4A' : '#F5F3EE',
          border: isMobile ? 'none' : '1px solid #DDD5C5',
          borderRadius: 12,
          padding: '18px 20px',
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: isMobile ? '#fff' : '#1B2A4A',
            fontFamily: "'Sora', sans-serif",
            marginBottom: 4,
          }}>
            Where should we send your blueprint?
          </div>
          <div style={{
            fontSize: 13,
            color: isMobile ? 'rgba(255,255,255,0.7)' : '#5A6278',
            fontFamily: "'Sora', sans-serif",
            lineHeight: 1.5,
            marginBottom: 12,
          }}>
            Your report takes 7-10 minutes to build. Enter your email and we'll send you the link when it's done — so you can do other things while you wait.
          </div>
          <input
            type="email"
            className="d100-input"
            value={formData.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="yourname@email.com"
            style={{ marginBottom: 10 }}
          />
          <div style={{
            fontSize: 11,
            color: isMobile ? 'rgba(255,255,255,0.5)' : '#888',
            fontFamily: "'Sora', sans-serif",
            lineHeight: 1.5,
            marginBottom: 6,
          }}>
            We will not add you to any list, send you promotional emails, or share your information. This is the only email you will receive from us.
          </div>
          <div style={{
            fontSize: 11,
            color: isMobile ? 'rgba(255,255,255,0.45)' : '#888',
            fontFamily: "'Sora', sans-serif",
            lineHeight: 1.5,
            marginBottom: 12,
          }}>
            Blueprint emails sometimes end up in spam. Check your spam folder if you don't see it within 15 minutes.
          </div>
          <button
            type="button"
            onClick={handleSkip}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
              color: isMobile ? 'rgba(255,255,255,0.45)' : '#AAA',
              textDecoration: 'underline',
            }}
          >
            No thanks, I'll stay on the page
          </button>
        </div>
      )}

      {emailSkipped && (
        <div style={{
          fontSize: 12, color: '#AAA', fontFamily: "'Sora', sans-serif",
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>No email — you're staying on the page.</span>
          <button
            type="button"
            onClick={() => setEmailSkipped(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#C9973A', fontFamily: "'Sora', sans-serif", textDecoration: 'underline', padding: 0 }}
          >
            Add email instead
          </button>
        </div>
      )}

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