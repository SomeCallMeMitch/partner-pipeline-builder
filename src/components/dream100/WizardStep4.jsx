import React from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function WizardStep4({ formData, onChange, onBack, onGenerate }) {
  const niche = formData.customNiche
    ? `${formData.nicheBase} — ${formData.customNiche}`
    : formData.nicheBase || '—';

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const email = (formData.email || '').trim();
  const emailValid = EMAIL_RE.test(email);
  const showEmailError = email.length > 0 && !emailValid;

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">Ready to generate</div>
      <div className="d100-card-sub">Here's what's going into your report. Tap Generate to build it.</div>

      {/* Email capture — required, framed as delivery */}
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
          Your report takes about four minutes to build. Enter your email and we'll send you the link the moment it's ready, so you can close this tab and get on with your day.
        </div>
        <input
          type="email"
          className="d100-input"
          value={formData.email || ''}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="yourname@email.com"
          autoComplete="email"
          aria-label="Your email address"
          aria-invalid={showEmailError ? 'true' : 'false'}
          style={{
            marginBottom: 8,
            borderColor: showEmailError ? '#D9534F' : undefined,
          }}
        />
        {showEmailError && (
          <div style={{
            fontSize: 12, fontWeight: 600,
            color: isMobile ? '#FFB3B0' : '#C0392B',
            fontFamily: "'Sora', sans-serif",
            marginBottom: 8,
          }}>
            That doesn't look like a valid email address.
          </div>
        )}
        <div style={{
          fontSize: 11,
          color: isMobile ? 'rgba(255,255,255,0.5)' : '#888',
          fontFamily: "'Sora', sans-serif",
          lineHeight: 1.5,
          marginBottom: 6,
        }}>
          We'll send your blueprint, plus the occasional idea worth stealing on building referral partnerships. Unsubscribe any time in one click. We never sell or share your information.
        </div>
        <div style={{
          fontSize: 11,
          color: isMobile ? 'rgba(255,255,255,0.45)' : '#888',
          fontFamily: "'Sora', sans-serif",
          lineHeight: 1.5,
        }}>
          Blueprint emails sometimes end up in spam. Check your spam folder if you don't see it within 15 minutes.
        </div>
      </div>

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
        We'll build a <strong>7-phase strategy report</strong> covering: lifecycle trigger mapping, partner identification, Dream 5 ranking, value strategy cards, objection prep, outreach scripts including your handwritten note, and a 90-day launch plan with 12-month calendar — all for <strong>{niche}</strong> in <strong>{formData.geo || 'your market'}</strong>. Then turn your Dream 5 into a live tracker in one click.
      </div>

      <div className="d100-form-nav">
        <button className="d100-btn-back" onClick={onBack}>← Back</button>
        <button
          className="d100-btn-generate"
          onClick={onGenerate}
          disabled={!emailValid}
          title={emailValid ? undefined : 'Enter your email so we can send you the blueprint'}
          style={emailValid ? undefined : { opacity: 0.45, cursor: 'not-allowed' }}
        >
          ⚡ Generate My Blueprint
        </button>
      </div>
    </div>
  );
}
