import React, { useState } from "react";
import { useTheme } from "@/components/ThemeContext";

const OUTCOMES = [
  {
    title: "A ranked list of your Dream 5 referral partners",
    detail: "Specific professionals in your market, tiered by referral potential for your niche — not generic types, real categories of people in your city."
  },
  {
    title: "A value strategy for each partner type",
    detail: "What you bring to them — not just what you want from them. This is the foundation every relationship gets built on."
  },
  {
    title: "Complete outreach scripts, ready to personalize",
    detail: "Email, phone, door-knock, and handwritten note templates. You fill in the name — everything else is written."
  },
  {
    title: "Objection responses, pre-written",
    detail: "Every pushback a partner might give, with confident answers prepared before you ever pick up the phone."
  },
  {
    title: "A 90-day action plan, week by week",
    detail: "Exactly what to do each week to build relationships that generate consistent referrals — no guessing."
  },
  {
    title: "12-month production math",
    detail: "How many partners you need, at what referral rate, to hit your annual income goal — in black and white."
  },
];

export default function HeroSectionV2({ onStart }) {
  const { theme } = useTheme();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <div style={{
      background: '#0E2D66',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Sora', -apple-system, sans-serif",
      color: '#fff',
    }}>
      {/* NAV */}
      <nav className="hero-nav" style={{
        padding: '0 48px', height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30, background: '#D15704', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, color: '#fff',
          }}>{theme.logoMark}</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{theme.brandName}</span>
        </a>
        <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" className="hero-visit-btn" style={{
          color: '#D15704', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          border: '1px solid rgba(209,87,4,0.4)', padding: '6px 16px', borderRadius: 20,
          whiteSpace: 'nowrap',
        }}>
          Visit {theme.brandName} →
        </a>
      </nav>

      {/* HERO GRID */}
      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        padding: '32px 48px 56px',
        display: 'grid',
        gridTemplateColumns: '1fr 560px',
        gap: 72,
        alignItems: 'center',
        boxSizing: 'border-box',
        flex: 1,
      }} className="hero-grid-v2">

        {/* LEFT */}
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#D15704', borderRadius: 100, padding: '6px 14px', marginBottom: 20,
            color: '#fff', fontSize: 11, fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>FREE · REAL ESTATE AGENTS ONLY</div>

          {/* H1 */}
          <h1 className="hero-h1-v2" style={{
            fontSize: 52, fontWeight: 800, color: '#fff',
            margin: '0 0 18px', lineHeight: 1.1,
          }}>
            Find the <span style={{ color: '#D15704' }}>10</span> People<br />
            Who Already Know<br />
            Your Next <span style={{ color: '#D15704' }}>50</span> Clients
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: '0 0 8px', maxWidth: 460 }}>
            Get a personalized 7-phase strategy to build your Dream Partner referral system — built around your niche, your market, and the clients you actually want.
          </p>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 28px' }}>
            3 min to fill out · 7–12 min to generate · yours to keep forever
          </p>

          {/* MOBILE ONLY TOP 3 LIST */}
          <div className="hero-mobile-list" style={{ display: 'none', marginBottom: 24 }}>
            {OUTCOMES.slice(0, mobileExpanded ? 6 : 3).map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 15, color: '#fff' }}>
                <span style={{ color: '#D15704', fontWeight: 'bold' }}>•</span>
                <span style={{ lineHeight: 1.4 }}>{o.title}</span>
              </div>
            ))}
            {!mobileExpanded && (
              <button 
                onClick={() => setMobileExpanded(true)}
                style={{ background: 'none', border: 'none', color: '#D15704', fontSize: 15, cursor: 'pointer', padding: 0, marginTop: 4, textDecoration: 'underline' }}>
                ...and 3 more
              </button>
            )}
          </div>

          <button onClick={onStart} className="hero-cta-btn-v2" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#D15704', color: '#fff', border: 'none', borderRadius: 8,
            padding: '18px 36px', fontFamily: "'Sora', sans-serif",
            fontWeight: 700, fontSize: 17, cursor: 'pointer',
          }}>
            Get My Free Blueprint →
          </button>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 12 }}>
            No account needed · No credit card · Use it as many times as you want
          </p>
        </div>

        {/* RIGHT — white panel */}
        <div className="hero-right-card-v2" style={{
          background: '#FAF8F4',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 40px rgba(0,0,0,0.25)',
          padding: '32px 36px',
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', color: '#D15704', marginBottom: 16,
          }}>
            What you'll have when it's done
          </div>

          {/* Outcome rows */}
          {OUTCOMES.map((o, i) => (
            <div key={i} style={{
              padding: '16px 0',
              borderBottom: i < OUTCOMES.length - 1 ? '1px solid #E8E2D8' : 'none',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>{o.title}</div>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>{o.detail}</p>
            </div>
          ))}

          {/* Panel footer */}
          <div style={{ paddingTop: 14, borderTop: '1px solid #E8E2D8', marginTop: 16 }}>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#888', margin: 0 }}>
              3 min to fill out · No login · Free forever
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="hero-footer" style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '16px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, flexWrap: 'wrap', gap: 8,
      }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          This free tool is brought to you by{' '}
          <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: 'rgba(209,87,4,0.7)', textDecoration: 'none', fontWeight: 600 }}>
            {theme.brandName}
          </a>
          {' '}— {theme.footerText}.
        </p>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          © 2025 {theme.brandName} ·{' '}
          <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: '#D15704', textDecoration: 'none' }}>
            Learn More
          </a>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-nav { padding: 0 16px !important; }
          .hero-visit-btn { font-size: 11px !important; padding: 5px 10px !important; }
          .hero-footer { padding: 16px !important; flex-direction: column; text-align: center; }
          .hero-grid-v2 {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px 20px 40px !important;
          }
          .hero-h1-v2 { font-size: 36px !important; }
          .hero-cta-btn-v2 { width: 100% !important; }
          .hero-right-card-v2 { display: none !important; }
          .hero-mobile-list { display: block !important; }
        }
      `}</style>
    </div>
  );
}