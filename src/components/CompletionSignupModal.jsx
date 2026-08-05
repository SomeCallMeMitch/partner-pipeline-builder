import React from "react";
import { useNavigate } from "react-router-dom";

// ── Design tokens (matches RunBlueprint's C token convention) ───────────────
const C = {
  navy: "#1B2A4A",
  navyDeep: "#0F1B2E",
  gold: "#C9973A",
  goldLight: "#E8B55A",
  white: "#FFFFFF",
};
const font = "'Sora', -apple-system, sans-serif";

// Three concrete promises, each tied to something the tracker actually does.
const BENEFITS = [
  {
    title: "It remembers who to contact, and when",
    body: "You never open a blank list wondering who is next. Each partner shows the one action that is due, in order.",
  },
  {
    title: "It holds the note already written for each person",
    body: "The handwritten introduction from your blueprint is attached to the right partner, ready when it is time to send it.",
  },
  {
    title: "It turns a filed-away report into real relationships",
    body: "A strategy you read once does nothing. This is the checklist that gets you to three or four partners who actually send you business.",
  },
];

// Fires once on run completion (controlled by RunBlueprint via the `open`
// prop, latched with a ref there so this never reopens on a later poll tick).
// Closing must never navigate -- the report and download buttons stay
// reachable underneath either way.
export default function CompletionSignupModal({ open, onClose, jobId }) {
  const navigate = useNavigate();
  if (!open) return null;

  function handlePrimary() {
    onClose();
    navigate(`/ClaimBlueprint?jobId=${jobId}`);
  }

  return (
    <div className="csm-overlay" onClick={onClose}>
      <div className="csm-card" onClick={e => e.stopPropagation()}>
        <button className="csm-close" onClick={onClose} aria-label="Close">×</button>

        <div className="csm-grid">
          {/* ── Left: the pitch ─────────────────────────────────────────── */}
          <div className="csm-left">
            <div className="csm-eyebrow">Write Because · Dream Partner Blueprint</div>
            <h2 className="csm-title">Your blueprint is done. Here is the part almost everyone skips.</h2>
            <p className="csm-lead">
              The blueprint names your partner types. A type cannot take your call. The tracker turns each type
              into two real people, a primary you start with and a backup you keep warm, and walks you through
              building the relationship one step at a time.
            </p>
            <p className="csm-why">
              Not a hundred names. Ten people, worked properly. You are asking a partner to trust you with their
              own clients, and that trust is built over time, not in one call. Ten is far more than enough to
              create a steady stream of referrals.
            </p>
            <p className="csm-reassure">
              Free. About three minutes to start. Nothing here is behind a paywall, and your report stays
              available either way.
            </p>
          </div>

          {/* ── Right: what the tracker does ────────────────────────────── */}
          <div className="csm-right">
            <div className="csm-right-head">What the tracker does for you</div>
            {BENEFITS.map((b, i) => (
              <div className="csm-benefit" key={i}>
                <div className="csm-benefit-num">{i + 1}</div>
                <div>
                  <div className="csm-benefit-title">{b.title}</div>
                  <div className="csm-benefit-body">{b.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="csm-actions">
          <button className="csm-primary" onClick={handlePrimary}>
            Set up my tracker · Name my ten →
          </button>
          <button className="csm-secondary" onClick={onClose}>
            I'll just download for now
          </button>
        </div>
      </div>

      <style>{`
        .csm-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
          overflow-y: auto;
        }
        .csm-card {
          position: relative; width: 100%; max-width: 880px;
          background: ${C.navyDeep}; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 22px; padding: 40px 44px 34px;
          box-shadow: 0 24px 70px rgba(0,0,0,0.6); font-family: ${font};
          margin: auto;
        }
        .csm-close {
          position: absolute; top: 18px; right: 20px; background: transparent;
          border: none; color: rgba(255,255,255,0.5); font-size: 30px;
          line-height: 1; cursor: pointer; padding: 4px; z-index: 2;
        }
        .csm-close:hover { color: rgba(255,255,255,0.85); }

        .csm-grid {
          display: grid; grid-template-columns: 1.15fr 1fr; gap: 40px;
        }
        .csm-eyebrow {
          font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: ${C.goldLight};
          margin-bottom: 16px; padding-right: 28px;
        }
        .csm-title {
          color: ${C.white}; font-weight: 800; font-size: 30px; line-height: 1.25;
          margin: 0 0 18px;
        }
        .csm-lead {
          color: rgba(255,255,255,0.75); font-size: 16.5px; line-height: 1.65; margin: 0 0 16px;
        }
        .csm-why {
          color: rgba(255,255,255,0.85); font-size: 16px; line-height: 1.65;
          margin: 0 0 16px; border-left: 3px solid ${C.gold}; padding-left: 16px;
        }
        .csm-reassure {
          color: rgba(255,255,255,0.5); font-size: 14.5px; line-height: 1.6; margin: 0;
        }

        .csm-right {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 24px 24px 10px;
        }
        .csm-right-head {
          color: ${C.goldLight}; font-size: 12px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 18px;
        }
        .csm-benefit { display: flex; gap: 14px; margin-bottom: 20px; }
        .csm-benefit-num {
          flex: 0 0 28px; height: 28px; border-radius: 999px;
          background: ${C.gold}; color: ${C.navy}; font-weight: 800; font-size: 15px;
          display: flex; align-items: center; justify-content: center;
        }
        .csm-benefit-title {
          color: ${C.white}; font-size: 15.5px; font-weight: 700; line-height: 1.35; margin-bottom: 4px;
        }
        .csm-benefit-body { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; }

        .csm-actions { margin-top: 30px; }
        .csm-primary {
          width: 100%; background: ${C.gold}; color: ${C.navy}; border: none;
          font-weight: 800; font-size: 18px; padding: 17px 22px; border-radius: 12px;
          cursor: pointer; font-family: ${font}; margin-bottom: 14px;
        }
        .csm-primary:hover { background: ${C.goldLight}; }
        .csm-secondary {
          width: 100%; background: transparent; border: none;
          color: rgba(255,255,255,0.55); font-size: 14px; font-family: ${font};
          cursor: pointer; padding: 6px 0;
        }
        .csm-secondary:hover { color: rgba(255,255,255,0.8); }

        @media (max-width: 720px) {
          .csm-card { padding: 28px 24px 24px; border-radius: 16px; }
          .csm-grid { grid-template-columns: 1fr; gap: 22px; }
          .csm-title { font-size: 24px; }
          .csm-lead { font-size: 15px; }
        }
      `}</style>
    </div>
  );
}
