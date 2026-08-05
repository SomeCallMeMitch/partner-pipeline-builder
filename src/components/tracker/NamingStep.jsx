import React, { useEffect, useState } from "react";
import { C } from "./TrackerStyles";
import { stageChangePatch, fillNoteName } from "./nextAction";
import { tipsForPartner, WHY_TEN, REACH_OUT_TO_BOTH, RESEARCH_TIME_NOTE } from "./searchTips";

// ── Instructional popup shown BEFORE the search launches ────────────────────
function SearchTipsModal({ partner, geography, mapsUrl, onClose }) {
  const { specific, generic } = tipsForPartner(partner);
  return (
    <div className="nm-modal-overlay" onClick={onClose}>
      <div className="nm-modal" onClick={e => e.stopPropagation()}>
        <button className="nm-modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="nm-modal-eyebrow">Before you search</div>
        <h3 className="nm-modal-title">
          How to pick a good {(partner.partnerType || "partner").toLowerCase()}
        </h3>

        <div className="nm-tip nm-tip-highlight">
          <div className="nm-tip-title">{REACH_OUT_TO_BOTH.title}</div>
          <div className="nm-tip-body">{REACH_OUT_TO_BOTH.body}</div>
        </div>

        {specific.map((t, i) => (
          <div className="nm-tip nm-tip-specific" key={`s${i}`}>
            <div className="nm-tip-title">{t.title}</div>
            <div className="nm-tip-body">{t.body}</div>
          </div>
        ))}

        <div className="nm-tip nm-tip-highlight">
          <div className="nm-tip-title">{RESEARCH_TIME_NOTE.title}</div>
          <div className="nm-tip-body">{RESEARCH_TIME_NOTE.body}</div>
        </div>

        {generic.map((t, i) => (
          <div className="nm-tip" key={`g${i}`}>
            <div className="nm-tip-title">{t.title}</div>
            <div className="nm-tip-body">{t.body}</div>
          </div>
        ))}

        <a className="nm-modal-go" href={mapsUrl} target="_blank" rel="noreferrer" onClick={onClose}>
          Open the search for {geography} →
        </a>
        <button className="nm-modal-skip" onClick={onClose}>
          I already have someone in mind
        </button>
      </div>
    </div>
  );
}

// One contact block: name, company, phone, email, mailing address -- all
// visible from the start. This is a single-card screen with room to spare,
// so nothing that matters is hidden behind a name-entry trigger.
function ContactBlock({ label, sub, value, onChange }) {
  return (
    <div className="nm-contact">
      <div className="nm-contact-head">
        <span className="nm-contact-label">{label}</span>
        {sub && <span className="nm-contact-sub">{sub}</span>}
      </div>
      <div className="nm-grid2">
        <div>
          <label className="tk-label">Who</label>
          <input className="tk-input" value={value.personName}
            onChange={e => onChange({ ...value, personName: e.target.value })}
            placeholder="First and last name" />
        </div>
        <div>
          <label className="tk-label">Where they work</label>
          <input className="tk-input" value={value.company}
            onChange={e => onChange({ ...value, company: e.target.value })}
            placeholder="Company, optional" />
        </div>
        <div>
          <label className="tk-label">Phone</label>
          <input className="tk-input" value={value.phone}
            onChange={e => onChange({ ...value, phone: e.target.value })}
            placeholder="Grab it from their site" />
        </div>
        <div>
          <label className="tk-label">Email</label>
          <input className="tk-input" value={value.email}
            onChange={e => onChange({ ...value, email: e.target.value })}
            placeholder="Grab it from their site" />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <label className="tk-label">Mailing address · for sending a handwritten card</label>
        <input className="tk-input" value={value.mailingAddress}
          onChange={e => onChange({ ...value, mailingAddress: e.target.value })}
          placeholder="Office or mailing address" />
      </div>
    </div>
  );
}

const emptyContact = () => ({ personName: "", company: "", email: "", phone: "", mailingAddress: "" });

function draftFromPartner(p) {
  return {
    partnerType: p?.partnerType || "",
    primary: {
      personName: p?.personName || "", company: p?.company || "",
      email: p?.email || "", phone: p?.phone || "", mailingAddress: p?.mailingAddress || "",
    },
    secondary: {
      personName: p?.secondary?.personName || "", company: p?.secondary?.company || "",
      email: p?.secondary?.email || "", phone: p?.secondary?.phone || "",
      mailingAddress: p?.secondary?.mailingAddress || "",
    },
  };
}

// ── Progress row: five dots, current highlighted, done checked ─────────────
function ProgressRow({ partners, currentIndex }) {
  return (
    <div className="nm-progress-row">
      {partners.map((p, i) => {
        const done = (p.personName || "").trim().length > 0;
        const isCurrent = i === currentIndex;
        return (
          <div key={p.id} className="nm-progress-item">
            <div className={"nm-progress-dot" + (done ? " done" : "") + (isCurrent ? " current" : "")}>
              {done ? "✓" : i + 1}
            </div>
            <div className={"nm-progress-label" + (isCurrent ? " current" : "")}>
              {p.partnerType}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function NamingStep({ partners, needsTypes, geography, onPatch, onExit, saving }) {
  const firstUnnamedIndex = () => {
    const idx = (partners || []).findIndex(p => !((p.personName || "").trim()));
    return idx === -1 ? Math.max(0, (partners || []).length - 1) : idx;
  };

  const [currentIndex, setCurrentIndex] = useState(firstUnnamedIndex);
  const current = partners[currentIndex] || null;

  const [draft, setDraft] = useState(() => draftFromPartner(current));
  const [justSaved, setJustSaved] = useState(false);
  const [noteSent, setNoteSent] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  // Nothing left to name -- hand off to the main list instead of showing an
  // empty queue.
  useEffect(() => {
    if (partners.length > 0 && partners.every(p => (p.personName || "").trim())) {
      onExit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset the draft and post-save state whenever the active card changes.
  useEffect(() => {
    setDraft(draftFromPartner(current));
    setJustSaved(false);
    setNoteSent(false);
  }, [current?.id]);

  if (!current) return null;

  const mapsUrl = geography
    ? `https://www.google.com/maps/search/${encodeURIComponent((draft.partnerType || current.partnerType) + " " + geography)}`
    : null;

  async function handleSave() {
    const patch = {};
    if (needsTypes && draft.partnerType.trim() !== current.partnerType) {
      patch.partnerType = draft.partnerType.trim();
    }
    patch.personName = draft.primary.personName.trim();
    patch.company = draft.primary.company.trim();
    patch.email = draft.primary.email.trim();
    patch.phone = draft.primary.phone.trim();
    patch.mailingAddress = draft.primary.mailingAddress.trim();
    patch.secondary = {
      personName: draft.secondary.personName.trim(),
      company: draft.secondary.company.trim(),
      email: draft.secondary.email.trim(),
      phone: draft.secondary.phone.trim(),
      mailingAddress: draft.secondary.mailingAddress.trim(),
    };
    if (patch.personName && current.stage === "identified") {
      Object.assign(patch, stageChangePatch("named"));
    }
    await onPatch(current.id, patch);
    setJustSaved(true);
  }

  function markNoteSent() {
    const now = new Date().toISOString();
    onPatch(current.id, {
      lastTouchAt: now,
      touchCount: (current.touchCount || 0) + 1,
      snoozeUntil: "",
      stage: "contacted",
      stageChangedAt: now,
    });
    setNoteSent(true);
  }

  function goToNext() {
    let next = -1;
    for (let i = currentIndex + 1; i < partners.length; i++) {
      if (!((partners[i].personName || "").trim())) { next = i; break; }
    }
    if (next === -1) onExit();
    else setCurrentIndex(next);
  }

  async function exitNow() {
    if (!justSaved && draft.primary.personName.trim()) {
      await handleSave();
    }
    onExit();
  }

  const isLast = currentIndex === partners.length - 1 &&
    partners.slice(currentIndex + 1).every(p => (p.personName || "").trim());
  const hasMoreAfterThis = !partners.slice(currentIndex + 1).every(p => false) &&
    partners.some((p, i) => i > currentIndex && !((p.personName || "").trim()));

  const noteText = current.handwrittenNote
    ? fillNoteName(current.handwrittenNote, draft.primary.personName)
    : null;

  return (
    <div className="nm-wrap">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="nm-hero">
        <div className="tk-eyebrow" style={{ color: C.goldLight }}>
          Partner {currentIndex + 1} of {partners.length}
        </div>
        <h1 className="nm-hero-title">Let's start with one</h1>
        <p className="nm-hero-lead">
          You have {partners.length} partner types. Don't try to launch all of them today. Work this one,
          a primary and a backup, then move to the next whenever you're ready. You can stop after this one
          and come back for the rest.
        </p>
        <button className="nm-why-toggle" onClick={() => setWhyOpen(v => !v)} type="button">
          {whyOpen ? "Got it" : WHY_TEN.title + " →"}
        </button>
        {whyOpen && <p className="nm-why-body">{WHY_TEN.body}</p>}
      </div>

      <ProgressRow partners={partners} currentIndex={currentIndex} />

      {/* ── The active card ──────────────────────────────────────────────── */}
      <div className="nm-card">
        <div className="nm-card-head">
          {needsTypes ? (
            <input
              className="tk-input"
              style={{ fontWeight: 700, fontSize: 19 }}
              value={draft.partnerType}
              onChange={e => setDraft({ ...draft, partnerType: e.target.value })}
              placeholder="Partner type, e.g. Estate attorney"
            />
          ) : (
            <div className="nm-type">{current.partnerType}</div>
          )}
        </div>

        {!justSaved && geography && (
          <button className="nm-search-btn" type="button" onClick={() => setTipsOpen(true)}>
            <span className="nm-search-icon">⌕</span>
            <span className="nm-search-text">
              Find a good {(draft.partnerType || current.partnerType).toLowerCase()} near {geography}
            </span>
            <span className="nm-search-arrow">→</span>
          </button>
        )}

        {!justSaved && (
          <>
            <ContactBlock
              label="Primary"
              sub="the one you will start with"
              value={draft.primary}
              onChange={val => setDraft({ ...draft, primary: val })}
            />
            <ContactBlock
              label="Secondary"
              sub="a backup, contact them around the same time"
              value={draft.secondary}
              onChange={val => setDraft({ ...draft, secondary: val })}
            />
            <button
              className="tk-btn tk-btn-primary nm-save-btn"
              disabled={saving || !draft.primary.personName.trim()}
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save this partner"}
            </button>
            {!draft.primary.personName.trim() && (
              <div className="nm-save-hint">Name the primary to save. Everything else is optional.</div>
            )}
          </>
        )}

        {/* ── Post-save: the note, and where to go next ───────────────────── */}
        {justSaved && (
          <div className="nm-saved-panel">
            <div className="nm-saved-check">✓ {draft.primary.personName} is saved</div>

            {noteText && (
              <div className="nm-note-box">
                <div className="nm-note-label">Send this first, before any call or email</div>
                <div className="nm-note-text">{noteText}</div>
                <div className="nm-note-actions">
                  <button
                    className="tk-btn-link"
                    onClick={() => { if (navigator.clipboard) navigator.clipboard.writeText(noteText); }}
                  >
                    Copy note
                  </button>
                  {!noteSent ? (
                    <button className="tk-btn-link" style={{ color: C.success }} onClick={markNoteSent}>
                      I already sent this
                    </button>
                  ) : (
                    <span className="nm-note-sent">✓ Marked as sent</span>
                  )}
                </div>
              </div>
            )}

            <div className="nm-saved-actions">
              {!isLast && hasMoreAfterThis ? (
                <button className="tk-btn tk-btn-primary nm-save-btn" onClick={goToNext}>
                  Next partner →
                </button>
              ) : (
                <button className="tk-btn tk-btn-primary nm-save-btn" onClick={onExit}>
                  That's everyone -- go to my tracker →
                </button>
              )}
              <button className="tk-btn-link" onClick={exitNow}>
                I'm done for now, take me to my tracker
              </button>
            </div>
          </div>
        )}
      </div>

      {!justSaved && (
        <div className="nm-exit-row">
          <button className="tk-btn-link" onClick={exitNow} disabled={saving}>
            I'm done for now, take me to my tracker
          </button>
        </div>
      )}

      {tipsOpen && (
        <SearchTipsModal
          partner={current}
          geography={geography}
          mapsUrl={mapsUrl}
          onClose={() => setTipsOpen(false)}
        />
      )}

      <NamingStyles />
    </div>
  );
}

function NamingStyles() {
  return (
    <style>{`
      .nm-wrap { max-width: 780px; margin: 0 auto; }

      .nm-hero {
        background: ${C.navy}; border-radius: 18px; padding: 30px 34px;
        margin-bottom: 22px;
      }
      .nm-hero-title {
        color: ${C.white}; font-weight: 800; font-size: 28px; line-height: 1.22;
        margin: 8px 0 14px;
      }
      .nm-hero-lead {
        color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.65; margin: 0;
      }
      .nm-why-toggle {
        margin-top: 16px; background: transparent; border: 1px solid rgba(232,181,90,0.4);
        color: ${C.goldLight}; font-family: inherit; font-size: 14px; font-weight: 700;
        padding: 9px 16px; border-radius: 9px; cursor: pointer;
      }
      .nm-why-body {
        color: rgba(255,255,255,0.75); font-size: 15px; line-height: 1.65;
        margin: 14px 0 0; border-left: 3px solid ${C.gold}; padding-left: 16px;
      }

      .nm-progress-row {
        display: flex; justify-content: space-between; margin-bottom: 20px;
        gap: 6px;
      }
      .nm-progress-item { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 0; }
      .nm-progress-dot {
        width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
        background: ${C.creamDark}; color: ${C.muted};
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 800; margin-bottom: 6px;
      }
      .nm-progress-dot.done { background: ${C.success}; color: ${C.white}; }
      .nm-progress-dot.current { background: ${C.gold}; color: ${C.navy}; box-shadow: 0 0 0 4px rgba(201,151,58,0.2); }
      .nm-progress-label {
        font-size: 11px; color: ${C.muted}; text-align: center; line-height: 1.3;
        max-width: 90px; overflow: hidden; text-overflow: ellipsis;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      }
      .nm-progress-label.current { color: ${C.navy}; font-weight: 700; }

      .nm-card {
        background: ${C.white}; border: 1px solid ${C.border}; border-radius: 16px;
        padding: 26px 28px; box-shadow: 0 2px 14px rgba(27,42,74,0.06);
      }
      .nm-card-head { margin-bottom: 16px; }
      .nm-type { font-size: 22px; font-weight: 800; color: ${C.navy}; line-height: 1.25; }

      .nm-search-btn {
        display: flex; align-items: center; gap: 10px; width: 100%;
        background: ${C.gold}; color: ${C.navy}; border: none; text-align: left;
        font-family: inherit; font-weight: 800; font-size: 15.5px;
        padding: 15px 18px; border-radius: 11px; cursor: pointer;
        box-sizing: border-box; margin-bottom: 20px;
        transition: background 0.15s ease;
      }
      .nm-search-btn:hover { background: ${C.goldLight}; }
      .nm-search-icon { font-size: 20px; line-height: 1; }
      .nm-search-text { flex: 1; }
      .nm-search-arrow { font-weight: 800; font-size: 18px; }

      .nm-contact {
        background: ${C.cream}; border: 1px solid ${C.creamDark};
        border-radius: 12px; padding: 18px 20px; margin-bottom: 16px;
      }
      .nm-contact-head { display: flex; align-items: center; gap: 9px; margin-bottom: 14px; }
      .nm-contact-label {
        font-size: 12px; font-weight: 800; letter-spacing: 0.06em;
        text-transform: uppercase; color: ${C.navy};
      }
      .nm-contact-sub { font-size: 13.5px; color: ${C.muted}; }
      .nm-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .nm-card .tk-input { font-size: 16px; padding: 12px 14px; }
      .nm-card .tk-label { font-size: 13px; margin-bottom: 6px; }

      .nm-save-btn { width: 100%; padding: 15px 22px; font-size: 16px; box-sizing: border-box; }
      .nm-save-hint { text-align: center; font-size: 13px; color: ${C.muted}; margin-top: 10px; }

      .nm-saved-panel {}
      .nm-saved-check { font-size: 18px; font-weight: 800; color: ${C.success}; margin-bottom: 18px; }
      .nm-note-box {
        background: ${C.cream}; border: 1px solid ${C.creamDark}; border-radius: 12px;
        padding: 18px 20px; margin-bottom: 20px;
      }
      .nm-note-label {
        font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
        color: ${C.gold}; margin-bottom: 10px;
      }
      .nm-note-text {
        font-size: 15.5px; line-height: 1.7; color: ${C.text}; font-style: italic;
        border-left: 3px solid ${C.gold}; padding-left: 14px; margin-bottom: 12px;
      }
      .nm-note-actions { display: flex; align-items: center; gap: 18px; }
      .nm-note-sent { font-size: 13px; font-weight: 700; color: ${C.success}; }
      .nm-saved-actions { display: flex; flex-direction: column; gap: 12px; align-items: stretch; }
      .nm-saved-actions .tk-btn-link { text-align: center; }

      .nm-exit-row { text-align: center; margin-top: 18px; }

      /* ── Search tips modal ──────────────────────────────────────────── */
      .nm-modal-overlay {
        position: fixed; inset: 0; z-index: 120;
        display: flex; align-items: center; justify-content: center;
        padding: 20px; background: rgba(15,27,46,0.72); backdrop-filter: blur(4px);
        overflow-y: auto;
      }
      .nm-modal {
        position: relative; width: 100%; max-width: 600px; margin: auto;
        background: ${C.white}; border-radius: 18px; padding: 30px 32px 26px;
        box-shadow: 0 24px 70px rgba(0,0,0,0.4);
      }
      .nm-modal-close {
        position: absolute; top: 16px; right: 18px; background: transparent;
        border: none; color: ${C.muted}; font-size: 26px; line-height: 1;
        cursor: pointer; padding: 4px;
      }
      .nm-modal-eyebrow {
        font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        color: ${C.gold}; margin-bottom: 8px;
      }
      .nm-modal-title {
        font-size: 24px; font-weight: 800; color: ${C.navy}; line-height: 1.28;
        margin: 0 0 18px; padding-right: 24px;
      }
      .nm-tip { padding: 14px 0; border-bottom: 1px solid ${C.creamDark}; }
      .nm-tip:last-of-type { border-bottom: none; }
      .nm-tip-specific, .nm-tip-highlight {
        border-left: 3px solid ${C.gold}; padding: 12px 0 12px 14px;
        background: rgba(201,151,58,0.06); border-radius: 8px; margin: 10px 0;
      }
      .nm-tip-title { font-size: 16.5px; font-weight: 700; color: ${C.navy}; margin-bottom: 5px; }
      .nm-tip-body { font-size: 15px; color: ${C.muted}; line-height: 1.6; }
      .nm-modal-go {
        display: block; text-align: center; margin-top: 22px;
        background: ${C.navy}; color: ${C.white}; text-decoration: none;
        font-weight: 800; font-size: 16px; padding: 15px 20px; border-radius: 11px;
      }
      .nm-modal-go:hover { background: ${C.navyLight}; }
      .nm-modal-skip {
        display: block; width: 100%; text-align: center; margin-top: 10px;
        background: transparent; border: none; color: ${C.muted};
        font-family: inherit; font-size: 13.5px; cursor: pointer; padding: 6px 0;
      }

      @media (max-width: 560px) {
        .nm-hero { padding: 24px 22px; }
        .nm-hero-title { font-size: 24px; }
        .nm-card { padding: 22px 20px; }
        .nm-grid2 { grid-template-columns: 1fr; }
        .nm-progress-label { display: none; }
      }
    `}</style>
  );
}
