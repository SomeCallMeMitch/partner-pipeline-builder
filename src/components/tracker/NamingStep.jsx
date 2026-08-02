import React, { useState } from "react";
import { C } from "./TrackerStyles";

export default function NamingStep({ partners, needsTypes, onSave, onSkip, saving }) {
  const [drafts, setDrafts] = useState(() => {
    const d = {};
    (partners || []).forEach(p => {
      d[p.id] = {
        personName: p.personName || "",
        company: p.company || "",
        partnerType: p.partnerType || "",
      };
    });
    return d;
  });

  const update = (id, field, value) => {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const namedCount = Object.values(drafts).filter(d => d.personName.trim()).length;

  return (
    <div>
      <div className="tk-card" style={{ background: C.navy, border: "none" }}>
        <div className="tk-eyebrow" style={{ color: C.goldLight }}>Step one, and the only one today</div>
        <div style={{ color: C.white, fontWeight: 800, fontSize: 21, lineHeight: 1.3, margin: "8px 0 10px" }}>
          Put a real person on each line
        </div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
          Your blueprint gave you partner types. A type cannot take your call. Write down who you already know,
          or who you could find in ten minutes on a search. A rough guess beats a blank, and you can correct it later.
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, margin: "10px 0 0" }}>
          Fill in what you can. Leave the rest blank and come back.
        </p>
      </div>

      {(partners || []).map((p, i) => {
        const d = drafts[p.id] || { personName: "", company: "", partnerType: "" };
        return (
          <div className="tk-card" key={p.id}>
            <div className="tk-row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div className="tk-eyebrow">Partner {i + 1}{p.tier ? ` · ${p.tier}` : ""}</div>
                {needsTypes ? (
                  <input
                    className="tk-input"
                    style={{ marginTop: 6, fontWeight: 700 }}
                    value={d.partnerType}
                    onChange={e => update(p.id, "partnerType", e.target.value)}
                    placeholder="Partner type, e.g. Estate attorney"
                  />
                ) : (
                  <div className="tk-type" style={{ fontSize: 16, marginTop: 4 }}>{p.partnerType}</div>
                )}
              </div>
              {d.personName.trim() && (
                <span className="tk-pill" style={{ background: "rgba(45,106,79,0.12)", color: C.success }}>Named</span>
              )}
            </div>

            {p.whyPriority && (
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>
                {p.whyPriority}
              </p>
            )}

            <div className="tk-grid2">
              <div>
                <label className="tk-label">Who</label>
                <input
                  className="tk-input"
                  value={d.personName}
                  onChange={e => update(p.id, "personName", e.target.value)}
                  placeholder="First and last name"
                />
              </div>
              <div>
                <label className="tk-label">Where they work</label>
                <input
                  className="tk-input"
                  value={d.company}
                  onChange={e => update(p.id, "company", e.target.value)}
                  placeholder="Company, optional"
                />
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ position: "sticky", bottom: 0, background: C.cream, padding: "14px 0 8px", borderTop: `1px solid ${C.border}` }}>
        <button
          className="tk-btn tk-btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: 15 }}
          disabled={saving}
          onClick={() => onSave(drafts)}
        >
          {saving ? "Saving..." : namedCount > 0 ? `Save ${namedCount} and continue` : "Save and continue"}
        </button>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button className="tk-btn-link" onClick={onSkip} disabled={saving}>
            Not now, just show me the list
          </button>
        </div>
      </div>
    </div>
  );
}
