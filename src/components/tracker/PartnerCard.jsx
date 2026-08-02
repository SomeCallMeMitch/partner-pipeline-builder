import React, { useState } from "react";
import { C } from "./TrackerStyles";
import {
  STAGES,
  completeActionPatch,
  snoozePatch,
  stageChangePatch,
  addNotePatch,
  dueSummary,
} from "./nextAction";

function fmt(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return "";
  }
}

export default function PartnerCard({ partner, action, onPatch, busy }) {
  const p = partner;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    personName: p.personName || "",
    company: p.company || "",
    email: p.email || "",
    phone: p.phone || "",
  });
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [quickName, setQuickName] = useState("");

  const notes = Array.isArray(p.notes) ? p.notes : [];

  const saveEdit = () => {
    const patch = { ...draft };
    if (draft.personName.trim() && p.stage === "identified") {
      Object.assign(patch, stageChangePatch("named"));
    }
    onPatch(p.id, patch);
    setEditing(false);
  };

  const saveQuickName = () => {
    const name = quickName.trim();
    if (!name) return;
    onPatch(p.id, { personName: name, ...stageChangePatch("named") });
    setQuickName("");
  };

  const markDone = () => onPatch(p.id, completeActionPatch(p, action));
  const snooze = () => onPatch(p.id, snoozePatch(7));

  const logReferral = () => {
    const now = new Date().toISOString();
    onPatch(p.id, {
      referralReceivedAt: now,
      referralCount: (p.referralCount || 0) + 1,
      ...(p.stage === "active" ? {} : stageChangePatch("active", now)),
      snoozeUntil: "",
    });
  };

  const addNote = () => {
    const text = noteText.trim();
    if (!text) return;
    onPatch(p.id, addNotePatch(p, text));
    setNoteText("");
    setNoteOpen(false);
    setShowNotes(true);
  };

  const cls = "tk-card" + (action.isDue ? " tk-due" : "") + (action.isSnoozed ? " tk-quiet" : "");

  return (
    <div className={cls}>
      <div className="tk-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div className="tk-type">{p.partnerType}</div>
          <div className={"tk-name" + (p.personName ? "" : " tk-name-empty")}>
            {p.personName || "No one named yet"}
          </div>
          {p.company && (
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{p.company}</div>
          )}
        </div>
        <span className={"tk-pill" + (action.isDue ? " tk-pill-due" : "")}>{dueSummary(action)}</span>
      </div>

      <div className="tk-action">
        <div className="tk-action-label">{action.label}</div>
        <div className="tk-action-detail">{action.detail}</div>

        {action.kind === "card" && (
          <div className="tk-card-seam">
            Write it yourself, or{" "}
            <a href="https://writebecause.com" target="_blank" rel="noreferrer">send it through Write Because</a>{" "}
            and it goes out in real ink without you finding a stamp.
          </div>
        )}

        {action.kind === "outreach" && p.firstContactStrategy && (
          <div className="tk-card-seam" style={{ fontStyle: "italic" }}>
            From your blueprint: {p.firstContactStrategy}
          </div>
        )}
      </div>

      {action.kind === "name" ? (
        <div className="tk-row">
          <input
            className="tk-input"
            style={{ flex: "1 1 200px" }}
            value={quickName}
            onChange={e => setQuickName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") saveQuickName(); }}
            placeholder="Who is it?"
          />
          <button className="tk-btn tk-btn-primary" disabled={busy || !quickName.trim()} onClick={saveQuickName}>
            Save
          </button>
        </div>
      ) : (
        <div className="tk-row">
          <button className="tk-btn tk-btn-primary" disabled={busy} onClick={markDone}>
            Mark done
          </button>
          <button className="tk-btn tk-btn-ghost" disabled={busy} onClick={snooze}>
            Not this week
          </button>
        </div>
      )}

      <div className="tk-row" style={{ marginTop: 14, justifyContent: "space-between" }}>
        <div className="tk-row" style={{ gap: 14 }}>
          <button className="tk-btn-link" onClick={() => setEditing(v => !v)}>
            {editing ? "Close" : "Details"}
          </button>
          <button className="tk-btn-link" onClick={() => setNoteOpen(v => !v)}>Add note</button>
          {notes.length > 0 && (
            <button className="tk-btn-link" onClick={() => setShowNotes(v => !v)}>
              {showNotes ? "Hide" : `Notes (${notes.length})`}
            </button>
          )}
          <button className="tk-btn-link" onClick={logReferral}>Got a referral</button>
        </div>
        <select
          value={p.stage}
          disabled={busy}
          onChange={e => onPatch(p.id, stageChangePatch(e.target.value))}
          style={{
            fontFamily: "inherit", fontSize: 12, color: C.muted,
            border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 8px", background: C.white,
          }}
        >
          {STAGES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {noteOpen && (
        <div style={{ marginTop: 12 }}>
          <textarea
            className="tk-input"
            rows={3}
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="What happened, in your own words"
            style={{ resize: "vertical" }}
          />
          <div className="tk-row" style={{ marginTop: 8 }}>
            <button className="tk-btn tk-btn-primary" disabled={busy || !noteText.trim()} onClick={addNote}>
              Save note
            </button>
            <button className="tk-btn tk-btn-ghost" onClick={() => { setNoteOpen(false); setNoteText(""); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showNotes && notes.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {notes.map((n, i) => (
            <div className="tk-note" key={i}>
              <span className="tk-note-at">{fmt(n.at)}</span>
              {n.text}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.creamDark}` }}>
          <div className="tk-grid2">
            <div>
              <label className="tk-label">Name</label>
              <input className="tk-input" value={draft.personName}
                onChange={e => setDraft({ ...draft, personName: e.target.value })} />
            </div>
            <div>
              <label className="tk-label">Company</label>
              <input className="tk-input" value={draft.company}
                onChange={e => setDraft({ ...draft, company: e.target.value })} />
            </div>
            <div>
              <label className="tk-label">Email</label>
              <input className="tk-input" value={draft.email}
                onChange={e => setDraft({ ...draft, email: e.target.value })} />
            </div>
            <div>
              <label className="tk-label">Phone</label>
              <input className="tk-input" value={draft.phone}
                onChange={e => setDraft({ ...draft, phone: e.target.value })} />
            </div>
          </div>
          <div className="tk-row" style={{ marginTop: 12 }}>
            <button className="tk-btn tk-btn-primary" disabled={busy} onClick={saveEdit}>Save</button>
            <button className="tk-btn tk-btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
            Last action {p.lastTouchAt ? fmt(p.lastTouchAt) : "not yet"}
            {p.referralCount ? ` · ${p.referralCount} referral${p.referralCount > 1 ? "s" : ""} received` : ""}
          </div>
        </div>
      )}
    </div>
  );
}
