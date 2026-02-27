import React from "react";

const examples = [
  {
    label: "Downsizing Empty Nesters",
    text: "Couples 45–65 with $1M+ in equity looking to downsize to a maintenance-free condo or 55+ community near good healthcare. Kids are grown, they want to travel and simplify.",
  },
  {
    label: "Move-Up Suburban Family",
    text: "Dual-income families with young kids, household income $150–250K, outgrowing their starter home and looking for more space, good schools, and a neighborhood with community feel.",
  },
  {
    label: "Relocating Corporate Executive",
    text: "C-suite or senior manager relocating for work, typically 35–50, needs to move fast, values a white-glove concierge experience, often buying before they've sold back home.",
  },
  {
    label: "First-Time Luxury Buyer",
    text: "High-earning professional, 30–45, first home purchase in the $800K–$1.5M range. Tech, finance, or medical field. Wants something turnkey and impressive but is nervous about the process.",
  },
  {
    label: "Estate / Probate Seller",
    text: "Adult children managing a parent's estate after death. Often out-of-state, need to sell quickly, property may need work. Value discretion, simplicity, and a trusted advisor.",
  },
  {
    label: "Divorce Seller",
    text: "Couples going through separation who need to liquidate a shared property. Emotionally charged situation — value a neutral, calm, experienced agent who can coordinate with both parties.",
  },
];

export default function IdealClientModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="d100-modal-overlay" onClick={onClose}>
      <div
        className="d100-modal-box"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d100-modal-handle" />
        <h3 style={{ marginBottom: 4 }}>Ideal Client Examples</h3>
        <p className="d100-modal-sub">
          Copy one of these as a starting point, then personalize it for your market.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {examples.map((ex) => (
            <div
              key={ex.label}
              style={{
                background: "var(--ni-cream, #FAF8F4)",
                border: "1px solid var(--ni-border, #DDD5C5)",
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ni-navy, #1B2A4A)",
                  marginBottom: 6,
                }}
              >
                {ex.label}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--ni-text, #1A1A2E)",
                  lineHeight: 1.6,
                }}
              >
                {ex.text}
              </div>
            </div>
          ))}
        </div>

        <button
          className="d100-btn-modal-cancel"
          style={{ marginTop: 20 }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}