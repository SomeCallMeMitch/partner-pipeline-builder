import React, { useRef, useState } from "react";
import { NICHES, NICHE_HELPERS } from "./nicheData";
import { sanitizeInput, FIELD_LIMITS } from "@/lib/inputValidation";

export default function WizardStep1({ formData, onChange, onNext }) {
  const selectedNiche = formData.nicheBase || '';
  const helperData = NICHE_HELPERS[selectedNiche];
  const [nicheError, setNicheError] = React.useState(false);
  const [detailError, setDetailError] = React.useState(false);
  const [showAllChips, setShowAllChips] = useState(false);
  const helperRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSelectNiche = (value) => {
    onChange({ nicheBase: value });
    setNicheError(false);
    setShowAllChips(false);
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
    setDetailError(false);
    // Land the cursor in the field so the natural next move is to keep typing,
    // not just admire the inserted chip text.
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        const end = el.value.length;
        el.setSelectionRange(end, end);
      }
    });
  };

  const handleNext = () => {
    if (!selectedNiche) {
      setNicheError(true);
      return;
    }
    if (!(formData.customNiche || '').trim()) {
      setDetailError(true);
      return;
    }
    onNext();
  };

  const visibleChips = helperData ? (showAllChips ? helperData.chips : helperData.chips.slice(0, 3)) : [];

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

      {selectedNiche && (
        <div ref={helperRef} className={`d100-field-group ${detailError ? 'd100-has-error' : ''}`} style={{ marginTop: 14 }}>
          <div className="d100-field-label">Describe your niche in a sentence or two</div>
          <textarea
            ref={textareaRef}
            className="d100-textarea"
            value={formData.customNiche || ''}
            onChange={(e) => { onChange({ customNiche: sanitizeInput(e.target.value, FIELD_LIMITS.customNiche) }); setDetailError(false); }}
            maxLength={FIELD_LIMITS.customNiche}
            placeholder={helperData ? `e.g., ${helperData.chips[0].toLowerCase()}...` : 'Describe your ideal client, price range, specific situation...'}
          />
          {detailError && <div className="d100-error-msg">This is what makes your report specific instead of generic — a sentence is enough.</div>}
          <p className="d100-field-hint">The more specific you are here, the more targeted your partner list will be. Generic inputs produce generic partners.</p>

          {helperData && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 12.5, color: '#8A8578', margin: '0 0 7px' }}>{helperData.hint}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', alignItems: 'center' }}>
                {visibleChips.map((c) => (
                  <span key={c} className="d100-chip" onClick={() => handleChip(c)}>{c}</span>
                ))}
                {!showAllChips && helperData.chips.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllChips(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', fontSize: 12.5, fontWeight: 600, color: '#C9973A', textDecoration: 'underline', fontFamily: "'Sora', sans-serif" }}
                  >
                    More examples
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="d100-form-nav">
        <button className="d100-btn-next" onClick={handleNext}>Continue →</button>
      </div>
    </div>
  );
}