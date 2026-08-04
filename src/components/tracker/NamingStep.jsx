import React, { useState } from "react";
import { C } from "./TrackerStyles";
import { tipsForPartner, WHY_TEN } from "./searchTips";

// One contact block: name + company, and (once a name is entered) phone + email.
// Used for both the primary and the secondary person on a card.
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

      {/* Phone + email stay hidden until there's a name -- keeps the blank
          state light instead of looking like a form to fill out. */}
      {hasName && (
        <div className="nm-grid2" style={{ marginTop: 10 }}>
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
      )}
    </div>
  );
}

// The expandable "What to look for" panel. Type-specific reason first (from the
// blueprint), then the generic scroll-past-the-franchises advice.
function LookForPanel({ partner, open, onToggle }) {
  const { specific, generic } = tipsForPartner(partner);
  return (
    <div className="nm-lookfor">
      <button className="nm-lookfor-toggle" onClick={onToggle} type="button">
        <span>{open ? "Hide tips" : "What to look for"}</span>
        <span className="nm-chev" style={{ transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <div className="nm-lookfor-body">
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
        </div>
      )}
    </div>
  );
}

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
        },
        secondary: {
          personName: p.secondary?.personName || "",
          company: p.secondary?.company || "",
          email: p.secondary?.email || "",
          phone: p.secondary?.phone || "",
        },
        partnerType: p.partnerType || "",
      };
    });
    return d;
  });
  const [openTips, setOpenTips] = useState({});
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

  return (
    <div className="nm-wrap">
      {/* ── Header: the pitch, why ten, the process ─────────────────────── */}
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

      {/* ── One card per partner type ───────────────────────────────────── */}
      <div className="nm-cards">
        {(partners || []).map((p, i) => {
          const d = drafts[p.id];
          if (!d) return null;
          const mapsUrl = geography
            ? `https://www.google.com/maps/search/${encodeURIComponent((d.partnerType || p.partnerType) + " " + geography)}`
            : null;
          const bothNamed = d.primary.personName.trim() && d.secondary.personName.trim();

          return (
            <div className="nm-card" key={p.id}>
              <div className="nm-card-head">
                <div>
                  <div className="tk-eyebrow">Partner {i + 1}{p.tier ? ` · ${p.tier}` : ""}</div>
                  {needsTypes ? (
                    <input
                      className="tk-input"
                      style={{ marginTop: 6, fontWeight: 700, fontSize: 17 }}
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

              {/* Prominent search button + tips expander */}
              <div className="nm-search-row">
                {mapsUrl && (
                  <a className="nm-search-btn" href={mapsUrl} target="_blank" rel="noreferrer">
                    <span className="nm-search-icon">⌕</span>
                    Search {(d.partnerType || p.partnerType).toLowerCase()} near {geography}
                    <span className="nm-search-arrow">→</span>
                  </a>
                )}
                <LookForPanel
                  partner={p}
                  open={!!openTips[p.id]}
                  onToggle={() => setOpenTips(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                />
              </div>

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

      <NamingStyles />
    </div>
  );
}

function NamingStyles() {
  return (
    <style>{`
      .nm-wrap { max-width: 1100px; margin: 0 auto; }
      .nm-hero {
        background: ${C.navy}; border-radius: 16px; padding: 26px 30px;
        margin-bottom: 20px;
      }
      .nm-hero-title {
        color: ${C.white}; font-weight: 800; font-size: 27px; line-height: 1.2;
        margin: 8px 0 12px;
      }
      .nm-hero-lead {
        color: rgba(255,255,255,0.78); font-size: 15.5px; line-height: 1.7;
        margin: 0 0 10px; max-width: 680px;
      }
      .nm-hero-sub {
        color: rgba(255,255,255,0.55); font-size: 13.5px; line-height: 1.6;
        margin: 0; max-width: 680px;
      }
      .nm-why-toggle {
        margin-top: 16px; background: transparent; border: 1px solid rgba(232,181,90,0.4);
        color: ${C.goldLight}; font-family: inherit; font-size: 13px; font-weight: 700;
        padding: 8px 14px; border-radius: 8px; cursor: pointer;
      }
      .nm-why-body {
        color: rgba(255,255,255,0.72); font-size: 14px; line-height: 1.75;
        margin: 14px 0 0; max-width: 680px;
        border-left: 3px solid ${C.gold}; padding-left: 16px;
      }

      .nm-cards {
        display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
      }
      .nm-card {
        background: ${C.white}; border: 1px solid ${C.border}; border-radius: 14px;
        padding: 20px 22px; box-shadow: 0 2px 12px rgba(27,42,74,0.05);
        display: flex; flex-direction: column;
      }
      .nm-card-head {
        display: flex; justify-content: space-between; align-items: flex-start;
        gap: 12px; margin-bottom: 14px;
      }
      .nm-type {
        font-size: 18px; font-weight: 800; color: ${C.navy}; line-height: 1.25; margin-top: 3px;
      }
      .nm-both-pill {
        font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 999px;
        background: ${C.successBg}; color: ${C.success}; white-space: nowrap;
      }

      .nm-search-row { margin-bottom: 16px; }
      .nm-search-btn {
        display: flex; align-items: center; gap: 8px; width: 100%;
        background: ${C.navy}; color: ${C.white}; text-decoration: none;
        font-weight: 700; font-size: 14px; padding: 12px 16px; border-radius: 10px;
        box-sizing: border-box; transition: background 0.15s ease;
      }
      .nm-search-btn:hover { background: ${C.navyLight}; }
      .nm-search-icon { font-size: 18px; line-height: 1; }
      .nm-search-arrow { margin-left: auto; font-weight: 800; }

      .nm-lookfor { margin-top: 10px; }
      .nm-lookfor-toggle {
        display: inline-flex; align-items: center; gap: 6px;
        background: transparent; border: none; padding: 4px 0; cursor: pointer;
        color: ${C.gold}; font-family: inherit; font-size: 13px; font-weight: 700;
      }
      .nm-chev { font-size: 11px; transition: transform 0.15s ease; }
      .nm-lookfor-body {
        margin-top: 10px; background: ${C.cream}; border: 1px solid ${C.creamDark};
        border-radius: 10px; padding: 6px 14px;
      }
      .nm-tip { padding: 11px 0; border-bottom: 1px solid ${C.creamDark}; }
      .nm-tip:last-child { border-bottom: none; }
      .nm-tip-specific {
        border-left: 3px solid ${C.gold}; padding-left: 12px;
        background: rgba(201,151,58,0.05); border-radius: 6px; margin: 6px 0;
      }
      .nm-tip-title { font-size: 13px; font-weight: 700; color: ${C.navy}; margin-bottom: 3px; }
      .nm-tip-body { font-size: 12.5px; color: ${C.muted}; line-height: 1.6; }

      .nm-contact {
        background: ${C.cream}; border: 1px solid ${C.creamDark};
        border-radius: 10px; padding: 14px 16px; margin-bottom: 12px;
      }
      .nm-contact:last-of-type { margin-bottom: 0; }
      .nm-contact-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
      .nm-contact-label {
        font-size: 11px; font-weight: 800; letter-spacing: 0.06em;
        text-transform: uppercase; color: ${C.navy};
      }
      .nm-contact-sub { font-size: 12px; color: ${C.muted}; }
      .nm-named-pill {
        margin-left: auto; font-size: 9px; font-weight: 700; padding: 3px 8px;
        border-radius: 999px; background: ${C.successBg}; color: ${C.success};
      }
      .nm-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

      .nm-savebar {
        position: sticky; bottom: 0; margin-top: 20px;
        background: ${C.cream}; border-top: 1px solid ${C.border};
        padding: 14px 0 10px; z-index: 20;
      }
      .nm-savebar-inner {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
      }
      .nm-progress { font-size: 13px; font-weight: 700; color: ${C.muted}; }
      .nm-savebar-btns { display: flex; align-items: center; gap: 18px; }
      .nm-save-btn { padding: 13px 28px; font-size: 15px; }

      @media (max-width: 860px) {
        .nm-cards { grid-template-columns: 1fr; }
      }
      @media (max-width: 560px) {
        .nm-hero { padding: 22px 20px; }
        .nm-hero-title { font-size: 22px; }
        .nm-grid2 { grid-template-columns: 1fr; }
        .nm-savebar-inner { flex-direction: column; align-items: stretch; gap: 10px; }
        .nm-savebar-btns { flex-direction: column-reverse; gap: 10px; }
        .nm-save-btn { width: 100%; }
        .nm-progress { text-align: center; }
      }
    `}</style>
  );
}
