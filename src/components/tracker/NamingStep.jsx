import React, { useState } from "react";
import { C } from "./TrackerStyles";
import { tipsForPartner, WHY_TEN } from "./searchTips";

// ── Instructional popup shown BEFORE the search launches ────────────────────
// The user hits "Find a good one", reads how to pick well, and only then
// clicks through to the actual Google/Maps search. This is where we teach them
// to scroll past the sponsored franchises and grab the contact details.
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

        {specific.map((t, i) => (
          <div className="nm-tip nm-tip-specific" key={`s${i}`}>
            <div className="nm-tip-title">{t.title}</div>
            <div className="nm-tip-body">{t.body}</div>
          </div>
        ))}
        {generic.map((t, i) => (
          <div className="nm-tip" key={`g${i}`}>
            <div className="nm-tip-title">{t.title}</div>
            <div className="nm-tip-body">{t.body}</div>
          </div>
        ))}

        <a
          className="nm-modal-go"
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
        >
          Open the search for {geography} →
        </a>
        <button className="nm-modal-skip" onClick={onClose}>
          I already have someone in mind
        </button>
      </div>
    </div>
  );
}

// One contact block: name, company, and (once a name is entered) phone,
// email, and mailing address. Used for both the primary and secondary person.
function ContactBlock({ label, sub, value, onChange }) {
  const hasName = (value.personName || "").trim().length > 0;
  return (
    <div className="nm-contact">
      <div className="nm-contact-head">
        <span className="nm-contact-label">{label}</span>
        {sub && <span className="nm-contact-sub">{sub}</span>}
        {hasName && <span className="nm-named-pill">Named</span>}
      </div>
      <div className="nm-grid2">
        <div>
          <label className="tk-label">Who</label>
          <input
            className="tk-input"
            value={value.personName}
            onChange={e => onChange({ ...value, personName: e.target.value })}
            placeholder="First and last name"
          />
        </div>
        <div>
          <label className="tk-label">Where they work</label>
          <input
            className="tk-input"
            value={value.company}
            onChange={e => onChange({ ...value, company: e.target.value })}
            placeholder="Company, optional"
          />
        </div>
      </div>

      {/* Contact + address stay hidden until there's a name -- keeps the blank
          state light instead of looking like a form to fill out. Once they
          have a person, this is where they park the details for outreach and
          for sending a handwritten card. */}
      {hasName && (
        <>
          <div className="nm-grid2" style={{ marginTop: 12 }}>
            <div>
              <label className="tk-label">Phone</label>
              <input
                className="tk-input"
                value={value.phone}
                onChange={e => onChange({ ...value, phone: e.target.value })}
                placeholder="Grab it from their site"
              />
            </div>
            <div>
              <label className="tk-label">Email</label>
              <input
                className="tk-input"
                value={value.email}
                onChange={e => onChange({ ...value, email: e.target.value })}
                placeholder="Grab it from their site"
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="tk-label">Mailing address · for sending a handwritten card</label>
            <input
              className="tk-input"
              value={value.mailingAddress}
              onChange={e => onChange({ ...value, mailingAddress: e.target.value })}
              placeholder="Office or mailing address"
            />
          </div>
        </>
      )}
    </div>
  );
}

const emptyContact = () => ({
  personName: "", company: "", email: "", phone: "", mailingAddress: "",
});

export default function NamingStep({ partners, needsTypes, geography, onSave, onSkip, saving }) {
  const [drafts, setDrafts] = useState(() => {
    const d = {};
    (partners || []).forEach(p => {
      d[p.id] = {
        primary: {
          personName: p.personName || "",
          company: p.company || "",
          email: p.email || "",
          phone: p.phone || "",
          mailingAddress: p.mailingAddress || "",
        },
        secondary: {
          personName: p.secondary?.personName || "",
          company: p.secondary?.company || "",
          email: p.secondary?.email || "",
          phone: p.secondary?.phone || "",
          mailingAddress: p.secondary?.mailingAddress || "",
        },
        partnerType: p.partnerType || "",
      };
    });
    return d;
  });
  const [tipsFor, setTipsFor] = useState(null); // partner object whose tips modal is open
  const [whyOpen, setWhyOpen] = useState(false);

  const updatePrimary = (id, val) =>
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], primary: val } }));
  const updateSecondary = (id, val) =>
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], secondary: val } }));
  const updateType = (id, val) =>
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], partnerType: val } }));

  const peopleNamed = Object.values(drafts).reduce((n, d) => {
    return n + (d.primary.personName.trim() ? 1 : 0) + (d.secondary.personName.trim() ? 1 : 0);
  }, 0);
  const typeCount = (partners || []).length;
  const targetPeople = typeCount * 2;

  const mapsUrlFor = (p, typeOverride) =>
    geography
      ? `https://www.google.com/maps/search/${encodeURIComponent((typeOverride || p.partnerType) + " " + geography)}`
      : null;

  return (
    <div className="nm-wrap">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="nm-hero">
        <div className="tk-eyebrow" style={{ color: C.goldLight }}>Step one, and the only one today</div>
        <h1 className="nm-hero-title">Put two real people on each line</h1>
        <p className="nm-hero-lead">
          Your blueprint gave you {typeCount} partner types. A type cannot take your call. For each one,
          name a primary person you will start with and a secondary you will keep warm. That is {targetPeople} people,
          and it is more than enough.
        </p>
        <p className="nm-hero-sub">
          Fill in what you can. A rough guess beats a blank, and you can correct it later. Leave the rest and come back.
        </p>

        <button className="nm-why-toggle" onClick={() => setWhyOpen(v => !v)} type="button">
          {whyOpen ? "Got it" : WHY_TEN.title + " →"}
        </button>
        {whyOpen && <p className="nm-why-body">{WHY_TEN.body}</p>}
      </div>

      {/* ── One card per partner type ────────────────────────────────────── */}
      <div className="nm-cards">
        {(partners || []).map((p, i) => {
          const d = drafts[p.id];
          if (!d) return null;
          const bothNamed = d.primary.personName.trim() && d.secondary.personName.trim();

          return (
            <div className="nm-card" key={p.id}>
              <div className="nm-card-head">
                <div>
                  <div className="tk-eyebrow">Partner {i + 1}{p.tier ? ` · ${p.tier}` : ""}</div>
                  {needsTypes ? (
                    <input
                      className="tk-input"
                      style={{ marginTop: 6, fontWeight: 700, fontSize: 19 }}
                      value={d.partnerType}
                      onChange={e => updateType(p.id, e.target.value)}
                      placeholder="Partner type, e.g. Estate attorney"
                    />
                  ) : (
                    <div className="nm-type">{p.partnerType}</div>
                  )}
                </div>
                {bothNamed && <span className="nm-both-pill">Both named</span>}
              </div>

              {/* Strong search button -> opens the instructional tips modal first */}
              {geography && (
                <button
                  className="nm-search-btn"
                  type="button"
                  onClick={() => setTipsFor({ partner: p, type: d.partnerType || p.partnerType })}
                >
                  <span className="nm-search-icon">⌕</span>
                  <span className="nm-search-text">
                    Find a good {(d.partnerType || p.partnerType).toLowerCase()} near {geography}
                  </span>
                  <span className="nm-search-arrow">→</span>
                </button>
              )}

              <ContactBlock
                label="Primary"
                sub="the one you will start with"
                value={d.primary}
                onChange={val => updatePrimary(p.id, val)}
              />
              <ContactBlock
                label="Secondary"
                sub="a backup you keep warm"
                value={d.secondary}
                onChange={val => updateSecondary(p.id, val)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Sticky save bar ─────────────────────────────────────────────── */}
      <div className="nm-savebar">
        <div className="nm-savebar-inner">
          <div className="nm-progress">
            {peopleNamed} of {targetPeople} people named
          </div>
          <div className="nm-savebar-btns">
            <button className="tk-btn-link" onClick={onSkip} disabled={saving}>
              Not now, just show me the list
            </button>
            <button
              className="tk-btn tk-btn-primary nm-save-btn"
              disabled={saving}
              onClick={() => onSave(drafts)}
            >
              {saving ? "Saving..." : peopleNamed > 0 ? `Save ${peopleNamed} and continue` : "Save and continue"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Instructional search popup ──────────────────────────────────── */}
      {tipsFor && (
        <SearchTipsModal
          partner={tipsFor.partner}
          geography={geography}
          mapsUrl={mapsUrlFor(tipsFor.partner, tipsFor.type)}
          onClose={() => setTipsFor(null)}
        />
      )}

      <NamingStyles />
    </div>
  );
}

function NamingStyles() {
  return (
    <style>{`
      .nm-wrap { max-width: 1240px; margin: 0 auto; }

      .nm-hero {
        background: ${C.navy}; border-radius: 18px; padding: 32px 38px;
        margin-bottom: 24px;
      }
      .nm-hero-title {
        color: ${C.white}; font-weight: 800; font-size: 32px; line-height: 1.18;
        margin: 10px 0 14px;
      }
      .nm-hero-lead {
        color: rgba(255,255,255,0.8); font-size: 18px; line-height: 1.65;
        margin: 0 0 12px; max-width: 760px;
      }
      .nm-hero-sub {
        color: rgba(255,255,255,0.55); font-size: 15px; line-height: 1.6;
        margin: 0; max-width: 760px;
      }
      .nm-why-toggle {
        margin-top: 18px; background: transparent; border: 1px solid rgba(232,181,90,0.4);
        color: ${C.goldLight}; font-family: inherit; font-size: 14px; font-weight: 700;
        padding: 9px 16px; border-radius: 9px; cursor: pointer;
      }
      .nm-why-body {
        color: rgba(255,255,255,0.75); font-size: 15px; line-height: 1.75;
        margin: 16px 0 0; max-width: 760px;
        border-left: 3px solid ${C.gold}; padding-left: 18px;
      }

      .nm-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .nm-card {
        background: ${C.white}; border: 1px solid ${C.border}; border-radius: 16px;
        padding: 24px 26px; box-shadow: 0 2px 14px rgba(27,42,74,0.06);
        display: flex; flex-direction: column;
      }
      .nm-card-head {
        display: flex; justify-content: space-between; align-items: flex-start;
        gap: 12px; margin-bottom: 16px;
      }
      .nm-type {
        font-size: 21px; font-weight: 800; color: ${C.navy}; line-height: 1.25; margin-top: 4px;
      }
      .nm-both-pill {
        font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
        background: ${C.successBg}; color: ${C.success}; white-space: nowrap;
      }

      .nm-search-btn {
        display: flex; align-items: center; gap: 10px; width: 100%;
        background: ${C.gold}; color: ${C.navy}; border: none; text-align: left;
        font-family: inherit; font-weight: 800; font-size: 15.5px;
        padding: 15px 18px; border-radius: 11px; cursor: pointer;
        box-sizing: border-box; margin-bottom: 18px;
        transition: background 0.15s ease;
      }
      .nm-search-btn:hover { background: ${C.goldLight}; }
      .nm-search-icon { font-size: 20px; line-height: 1; }
      .nm-search-text { flex: 1; }
      .nm-search-arrow { font-weight: 800; font-size: 18px; }

      .nm-contact {
        background: ${C.cream}; border: 1px solid ${C.creamDark};
        border-radius: 12px; padding: 16px 18px; margin-bottom: 14px;
      }
      .nm-contact:last-of-type { margin-bottom: 0; }
      .nm-contact-head { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
      .nm-contact-label {
        font-size: 12px; font-weight: 800; letter-spacing: 0.06em;
        text-transform: uppercase; color: ${C.navy};
      }
      .nm-contact-sub { font-size: 13px; color: ${C.muted}; }
      .nm-named-pill {
        margin-left: auto; font-size: 10px; font-weight: 700; padding: 3px 9px;
        border-radius: 999px; background: ${C.successBg}; color: ${C.success};
      }
      .nm-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

      /* Larger, more legible inputs and labels on this screen specifically */
      .nm-card .tk-input { font-size: 16px; padding: 12px 14px; }
      .nm-card .tk-label { font-size: 13px; margin-bottom: 6px; }

      .nm-savebar {
        position: sticky; bottom: 0; margin-top: 24px;
        background: ${C.cream}; border-top: 1px solid ${C.border};
        padding: 16px 0 12px; z-index: 20;
      }
      .nm-savebar-inner {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
      }
      .nm-progress { font-size: 15px; font-weight: 700; color: ${C.muted}; }
      .nm-savebar-btns { display: flex; align-items: center; gap: 20px; }
      .nm-save-btn { padding: 14px 32px; font-size: 16px; }

      /* ── Search tips modal ──────────────────────────────────────────── */
      .nm-modal-overlay {
        position: fixed; inset: 0; z-index: 120;
        display: flex; align-items: center; justify-content: center;
        padding: 20px; background: rgba(15,27,46,0.72); backdrop-filter: blur(4px);
        overflow-y: auto;
      }
      .nm-modal {
        position: relative; width: 100%; max-width: 540px; margin: auto;
        background: ${C.white}; border-radius: 18px; padding: 28px 30px 24px;
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
        font-size: 21px; font-weight: 800; color: ${C.navy}; line-height: 1.3;
        margin: 0 0 16px; padding-right: 24px;
      }
      .nm-tip { padding: 13px 0; border-bottom: 1px solid ${C.creamDark}; }
      .nm-tip:last-of-type { border-bottom: none; }
      .nm-tip-specific {
        border-left: 3px solid ${C.gold}; padding-left: 14px;
        background: rgba(201,151,58,0.06); border-radius: 8px; margin: 8px 0;
      }
      .nm-tip-title { font-size: 15px; font-weight: 700; color: ${C.navy}; margin-bottom: 4px; }
      .nm-tip-body { font-size: 14px; color: ${C.muted}; line-height: 1.65; }
      .nm-modal-go {
        display: block; text-align: center; margin-top: 20px;
        background: ${C.navy}; color: ${C.white}; text-decoration: none;
        font-weight: 800; font-size: 15.5px; padding: 14px 20px; border-radius: 11px;
      }
      .nm-modal-go:hover { background: ${C.navyLight}; }
      .nm-modal-skip {
        display: block; width: 100%; text-align: center; margin-top: 10px;
        background: transparent; border: none; color: ${C.muted};
        font-family: inherit; font-size: 13px; cursor: pointer; padding: 6px 0;
      }

      @media (max-width: 900px) {
        .nm-cards { grid-template-columns: 1fr; }
      }
      @media (max-width: 560px) {
        .nm-hero { padding: 24px 22px; }
        .nm-hero-title { font-size: 25px; }
        .nm-hero-lead { font-size: 16px; }
        .nm-grid2 { grid-template-columns: 1fr; }
        .nm-savebar-inner { flex-direction: column; align-items: stretch; gap: 12px; }
        .nm-savebar-btns { flex-direction: column-reverse; gap: 12px; }
        .nm-save-btn { width: 100%; }
        .nm-progress { text-align: center; }
      }
    `}</style>
  );
}
