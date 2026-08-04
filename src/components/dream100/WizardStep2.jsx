import React, { useState } from "react";
import { CHALLENGES, detectContradiction, isUnmodifiedExample } from "./nicheData";
import IdealClientModal from "./IdealClientModal";
import NicheMismatchWarning from "./NicheMismatchWarning";
import { sanitizeInput, FIELD_LIMITS } from "@/lib/inputValidation";

export default function WizardStep2({ formData, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [showClientModal, setShowClientModal] = useState(false);
  const [contradictionWarning, setContradictionWarning] = useState(null);

  const handleNext = () => {
    const newErrors = {};
    if (!(formData.geo || '').trim()) newErrors.geo = true;
    if (!formData.challenge) newErrors.challenge = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});

    const warning = detectContradiction(formData.nicheBase, formData.client);
    if (warning && !contradictionWarning) { setContradictionWarning(warning); return; }
    setContradictionWarning(null);

    onNext();
  };

  // Exact-string match only, so this never fires on real typed text -- just
  // the case where a card was clicked and nothing was added to it. Quiet and
  // non-blocking on purpose: a modal here was too heavy for a free tool with
  // a warm audience.
  const isUnedited = isUnmodifiedExample(formData.client);

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
          maxLength={FIELD_LIMITS.geo}
          onChange={(e) => { onChange({ geo: sanitizeInput(e.target.value, FIELD_LIMITS.geo) }); setErrors(prev => ({ ...prev, geo: false })); }}
          placeholder="e.g., Scottsdale, AZ · Buckhead, Atlanta · The Hamptons, NY"
        />
        <p className="d100-field-hint">City, metro, neighborhood, or county. Be as specific as possible — "North Scottsdale" beats "Arizona."</p>
        {errors.geo && <div className="d100-error-msg">Please enter your market area.</div>}
      </div>

      <div className="d100-field-group">
        <div className="d100-field-label">Specific neighborhoods or areas <span className="opt">(optional)</span></div>
        <input
          type="text"
          className="d100-input"
          value={formData.areas || ''}
          maxLength={FIELD_LIMITS.areas}
          onChange={(e) => onChange({ areas: sanitizeInput(e.target.value, FIELD_LIMITS.areas) })}
          placeholder="e.g., North County coastal, or Westside, or specific towns"
        />
        <p className="d100-field-hint">If your market spans a big or varied metro — like Los Angeles or San Diego — this keeps partner suggestions to the part of it you actually work.</p>
      </div>

      <div className="d100-field-group">
        <div className="d100-field-label">
          Describe your ideal client{' '}
          <span className="opt">(optional — adds a lot of value)</span>
          <button
            type="button"
            onClick={() => setShowClientModal(true)}
            style={{ marginLeft: 8, fontSize: 12, color: 'var(--ni-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Sora', sans-serif" }}
          >
            See examples
          </button>
        </div>
        <textarea
          className="d100-textarea"
          value={formData.client || ''}
          maxLength={FIELD_LIMITS.client}
          onChange={(e) => { onChange({ client: sanitizeInput(e.target.value, FIELD_LIMITS.client) }); setContradictionWarning(null); }}
          placeholder="e.g., Couples 45–65 with $1M+ in equity looking to downsize to a maintenance-free condo or 55+ community near good healthcare..."
        />
        <p className="d100-field-hint">Demographics, lifestyle, financial situation, motivations — anything that makes them distinct from the average buyer or seller.</p>
        {isUnedited && (
          <p style={{ fontSize: 12, color: '#9A9484', fontStyle: 'italic', margin: '6px 0 0' }}>
            Tip: add one real detail — a price band, a neighborhood, or a common situation — and we'll match partners to it more precisely.
          </p>
        )}
      </div>

      {contradictionWarning && (
        <NicheMismatchWarning
          message={contradictionWarning}
          onGoBack={onBack}
          onContinue={() => { setContradictionWarning(null); onNext(); }}
        />
      )}

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
        <p className="d100-field-hint">This shapes your objection handling and outreach scripts to directly address your specific situation.</p>
        {errors.challenge && <div className="d100-error-msg">Please select your biggest challenge.</div>}
      </div>

      <div className="d100-form-nav">
        <button className="d100-btn-back" onClick={onBack}>← Back</button>
        <button className="d100-btn-next" onClick={handleNext}>Continue →</button>
      </div>

      <IdealClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        nicheBase={formData.nicheBase}
        onSelect={(text) => {
          const current = (formData.client || '').trim();
          const combined = current ? current + ' ' + text : text;
          onChange({ client: sanitizeInput(combined, FIELD_LIMITS.client) });
          setContradictionWarning(null);
          setShowClientModal(false);
        }}
      />
    </div>
  );
}