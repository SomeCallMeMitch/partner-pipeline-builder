import React, { useRef } from "react";
import { NICHES, NICHE_HELPERS } from "./nicheData";
import { sanitizeInput, FIELD_LIMITS } from "@/lib/inputValidation";

export default function WizardStep1({ formData, onChange, onNext }) {
  const selectedNiche = formData.nicheBase || '';
  const helperData = NICHE_HELPERS[selectedNiche];
  const [nicheError, setNicheError] = React.useState(false);
  const helperRef = useRef(null);

  const handleSelectNiche = (value) => {
    onChange({ nicheBase: value });
    setNicheError(false);
    // Auto-scroll to detail area on mobile so user sees the selection result
    setTimeout(() => {
      if (helperRef.current && window.innerWidth <= 768) {
        helperRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleChip = (text) => {
    const current = (formData.customNiche || '').trim();
    const combined = current ? current + ', ' + text : text;
    onChange({ customNiche: sanitizeInput(combined, FIELD_LIMITS.customNiche) });
  };

  const handleNext = () => {
    if (!selectedNiche) {
      setNicheError(true);
      return;
    }
    onNext();
  };

  return (
    <div className="d100-form-card">
      <div className="d100-card-title">What's your real estate niche?</div>
      <div className="d100-card-sub">
        Pick the market you focus on most. <strong>You can come back and build a separate blueprint for each niche</strong> — start with the one that drives most of your business right now.
      </div>

      <div className={`d100-field-group ${nicheError ? 'd100-has-error' : ''}`}>
        <div className="d100-field-label">Select your primary niche</div>
        <div className="d100-niche-grid">
          {NICHES.map((n) => (
            <div
              key={n.value}
              className={`d100-niche-card ${selectedNiche === n.value ? 'selected' : ''}`}
              onClick={() => handleSelectNiche(n.value)}
            >
              <div className="d100-niche-icon">{n.icon}</div>
              <div className="d100-niche-title">{n.title}</div>
              <div className="d100-niche-desc">{n.desc}</div>
            </div>
          ))}
        </div>
        {nicheError && <div className="d100-error-msg">Please select a niche to continue.</div>}
      </div>

      {helperData && (
        <div ref={helperRef} className="d100-niche-helper">
          <p>{helperData.hint}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '4px' }}>
            {helperData.chips.map((c) => (
              <span key={c} className="d100-chip" onClick={() => handleChip(c)}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {selectedNiche && (
        <div className="d100-field-group" style={{ marginTop: 14 }}>
          <div className="d100-field-label">Describe your niche in more detail <span className="opt">(optional but makes your prompts much sharper)</span></div>
          <textarea
            className="d100-textarea"
            value={formData.customNiche || ''}
            onChange={(e) => onChange({ customNiche: sanitizeInput(e.target.value, FIELD_LIMITS.customNiche) })}
            maxLength={FIELD_LIMITS.customNiche}
            placeholder={helperData ? `e.g., ${helperData.chips[0].toLowerCase()}...` : 'Describe your ideal client, price range, specific situation...'}
          />
          <p className="d100-field-hint">The more specific you are here, the more targeted your partner list will be. Generic inputs produce generic partners.</p>
        </div>
      )}

      <div className="d100-form-nav">
        <button className="d100-btn-next" onClick={handleNext}>Continue →</button>
      </div>
    </div>
  );
}