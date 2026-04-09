// src/components/dream100/PartnerNotesCTA.jsx
//
// Shown in RunBlueprint when the job is complete and Phase 6 has output.
// Parses the 5 handwritten note templates from Phase 6 and offers to load
// them into NurturInk. The POST to initiateTemplateImport is stubbed for now --
// the RE Clone receiver endpoint will be wired in when that side is built.

import React, { useState, useMemo } from "react";
import { parsePhase6Notes } from "@/utils/parsePhase6";

const C = {
  navy: "#1B2A4A", navyLight: "#243659",
  gold: "#C9973A", goldLight: "#E8B55A",
  cream: "#FAF8F4", creamDark: "#F0EBE1",
  text: "#1A1A2E", muted: "#5A6278", border: "#DDD5C5", white: "#FFFFFF",
  success: "#2D6A4F", successBg: "#EAF4EE",
  error: "#B91C1C", errorBg: "#FEF2F2",
};
const font = "'Sora', -apple-system, sans-serif";

// ── Stub: replace with real URL when RE Clone receiver is ready ──────────────
const NURTURINK_IMPORT_URL = null; // 'https://nurturink-for-real-estate-mortgage.base44.app/functions/initiateTemplateImport'

export default function PartnerNotesCTA({ phase6Text, formData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState(formData?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const notes = useMemo(() => parsePhase6Notes(phase6Text), [phase6Text]);

  // If Phase 6 didn't parse cleanly, show a simpler fallback link
  if (!notes) {
    return (
      <div style={ctaWrapStyle}>
        <div style={eyebrowStyle}>Ready to use these scripts?</div>
        <div style={headlineStyle}>Send your partner notes without writing them by hand</div>
        <p style={bodyStyle}>
          NurturInk sends real handwritten notes for you -- real pen on real paper, mailed directly to your partners. From $2.50 a card including postage.
        </p>
        <a
          href="https://nurturink-for-real-estate-mortgage.base44.app"
          target="_blank"
          rel="noreferrer"
          style={primaryBtnStyle}
        >
          See How NurturInk Works →
        </a>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setSubmitting(true);

    // ── STUB: log intent, skip actual POST until RE Clone is ready ────────────
    if (!NURTURINK_IMPORT_URL) {
      console.log('[PartnerNotesCTA] Import stub -- would POST to NurturInk with:', {
        email,
        agentName: formData?.name,
        niche: formData?.niche || formData?.nicheBase,
        geo: formData?.geo,
        noteCount: notes.length,
      });
      // Simulate a short delay so the UX feels real
      await new Promise(r => setTimeout(r, 800));
      setSubmitting(false);
      setSubmitted(true);
      return;
    }

    // ── REAL POST (active once RE Clone receiver is wired up) ─────────────────
    try {
      const res = await fetch(NURTURINK_IMPORT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          agentName: formData?.name || '',
          niche: formData?.niche || formData?.nicheBase || '',
          geo: formData?.geo || '',
          templates: notes.map((n, i) => ({
            title: `Partner Outreach — ${n.partnerType}`,
            body: n.noteText,
            partnerType: n.partnerType,
            sortOrder: i + 1,
          })),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (data.claimToken) {
        window.location.href = `https://nurturink-for-real-estate-mortgage.base44.app/ClaimTemplates?token=${data.claimToken}`;
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError('Something went wrong. Try again or visit NurturInk directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Post-submit state (stub mode) ────────────────────────────────────────
  if (submitted) {
    return (
      <div style={ctaWrapStyle}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>✉️</div>
        <div style={{ ...headlineStyle, color: C.success }}>You're on the list</div>
        <p style={bodyStyle}>
          We're building the direct import feature now. When it's ready, we'll send a note to <strong>{email}</strong> so you can load these templates straight into NurturInk with one click.
        </p>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          In the meantime, your blueprint has everything you need -- copy Script 4 from Phase 6 and use it as-is.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── CTA Card ────────────────────────────────────────────────────── */}
      <div style={ctaWrapStyle}>
        <div style={eyebrowStyle}>Your 5 partner outreach notes are ready</div>
        <div style={headlineStyle}>Load them into NurturInk and send without writing a word</div>
        <p style={bodyStyle}>
          NurturInk sends real handwritten notes for you -- real pen on real paper, mailed directly to your referral partners. Your 5 note templates from Phase 6 are already written. From $2.50 a card including postage.
        </p>

        {/* Preview of parsed notes */}
        <div style={{ marginBottom: 20 }}>
          {notes.map((note, i) => (
            <div key={i} style={{
              borderLeft: `3px solid ${C.gold}`,
              paddingLeft: 12,
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, fontFamily: font, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {note.partnerType}
              </div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: font, lineHeight: 1.6 }}>
                {note.noteText.length > 160 ? note.noteText.slice(0, 160) + '...' : note.noteText}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={primaryBtnStyle}
        >
          Load My Notes into NurturInk →
        </button>
        <div style={{ fontSize: 11, color: C.muted, fontFamily: font, marginTop: 10, textAlign: 'center' }}>
          Free to try. No credit card to get started.
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={{
            background: C.white, borderRadius: 16, padding: 28,
            maxWidth: 480, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            fontFamily: font,
          }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 8 }}>
              Load your 5 partner notes into NurturInk
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
              Enter the email you want to use for your NurturInk account. We'll create your templates and take you straight to them.
            </p>

            <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: C.text }}>
              Your email
            </div>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null); }}
              placeholder="yourname@email.com"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '10px 14px', borderRadius: 8,
                border: `1px solid ${error ? C.error : C.border}`,
                fontSize: 14, fontFamily: font, marginBottom: 8,
                outline: 'none',
              }}
            />
            {error && (
              <div style={{ fontSize: 12, color: C.error, marginBottom: 8 }}>{error}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                ...primaryBtnStyle,
                width: '100%',
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
                marginBottom: 10,
              }}
            >
              {submitting ? 'Loading...' : 'Take Me to NurturInk →'}
            </button>

            <button
              onClick={() => setModalOpen(false)}
              style={{
                width: '100%', background: 'none', border: 'none',
                fontSize: 13, color: C.muted, cursor: 'pointer',
                fontFamily: font, padding: '6px 0',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const ctaWrapStyle = {
  background: "#FFFDF9",
  border: `1.5px solid #E8B55A`,
  borderRadius: 14,
  padding: "24px",
  marginTop: 24,
  fontFamily: font,
};

const eyebrowStyle = {
  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: C.gold,
  marginBottom: 8, fontFamily: font,
};

const headlineStyle = {
  fontSize: 17, fontWeight: 800, color: C.navy,
  marginBottom: 12, lineHeight: 1.35, fontFamily: font,
};

const bodyStyle = {
  fontSize: 13, color: C.muted, lineHeight: 1.7,
  margin: '0 0 16px', fontFamily: font,
};

const primaryBtnStyle = {
  display: 'block', textAlign: 'center',
  background: C.gold, color: C.navy,
  border: 'none', borderRadius: 10,
  padding: '12px 20px', fontWeight: 800,
  fontSize: 15, fontFamily: font,
  cursor: 'pointer', textDecoration: 'none',
  width: '100%', boxSizing: 'border-box',
};