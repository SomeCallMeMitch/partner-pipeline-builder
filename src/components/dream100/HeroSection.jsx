import React from "react";
import { useTheme } from "@/components/ThemeContext";

const OUTCOMES = [
  {
    icon: "🎯",
    title: "A ranked list of your Dream 10 referral partners",
    detail: "Specific professionals in your market, tiered by referral potential for your niche — not generic types, real categories of people in your city"
  },
  {
    icon: "🤝",
    title: "A value strategy for each partner type",
    detail: "What you bring to them — not just what you want from them. This is the foundation every relationship gets built on"
  },
  {
    icon: "📜",
    title: "Complete outreach scripts, ready to personalize",
    detail: "Email, phone, door-knock, and handwritten note templates. You fill in the name — everything else is written"
  },
  {
    icon: "🛡️",
    title: "Objection responses, pre-written",
    detail: "Every pushback a partner might give, with confident, non-salesy answers prepared before you ever pick up the phone"
  },
  {
    icon: "📅",
    title: "A 90-day action plan, week by week",
    detail: "Exactly what to do each week to build relationships that generate consistent referrals — no guessing"
  },
  {
    icon: "📊",
    title: "12-month production math",
    detail: "How many partners you need, at what referral rate, to hit your annual income goal — in black and white"
  },
];

export default function HeroSection({ onStart }) {
  const { theme } = useTheme();

  return (
    <div style={{
      background: '#1B2A4A',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Sora', -apple-system, sans-serif",
      color: '#fff',
    }}>
      {/* NAV */}
      <nav style={{
        padding: '0 48px', height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30, background: '#F0A422', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, color: '#1B2A4A',
          }}>{theme.logoMark}</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{theme.brandName}</span>
        </a>
        <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" style={{
          color: '#F0A422', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          border: '1px solid rgba(240,164,34,0.4)', padding: '6px 16px', borderRadius: 20,
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
        alignItems: 'start',
        boxSizing: 'border-box',
        flex: 1,
      }} className="hero-grid">

        {/* LEFT */}
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(240,164,34,0.14)', border: '1px solid rgba(240,164,34,0.3)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 20,
            color: '#F0A422', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.09em', textTransform: 'uppercase',
          }}>✦ Free Tool for Real Estate Agents</div>

          {/* H1 */}
          <h1 style={{
            fontSize: 50, fontWeight: 800, color: '#fff',
            margin: '0 0 18px', lineHeight: 1.08, letterSpacing: '-0.03em',
          }}>
            Find the <span style={{ color: '#F0A422' }}>10 People</span><br />
            Who Already Know<br />
            Your Next <span style={{ color: '#F7BC55' }}>50 Clients</span>
          </h1>

          <p style={{ fontSize: 18, color: '#fff', lineHeight: 1.55, margin: '0 0 28px', maxWidth: 500 }}>
            Get a complete 10-prompt AI blueprint to build your Dream 100 referral partner system — built for your niche and your market in minutes.
          </p>

          <button onClick={onStart} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#F0A422', color: '#1B2A4A', border: 'none', borderRadius: 12,
            padding: '16px 34px', fontFamily: "'Sora', sans-serif",
            fontWeight: 800, fontSize: 17, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(240,164,34,0.38)',
            whiteSpace: 'nowrap',
          }}>
            Build My Free Blueprint — It's Free ⚡
          </button>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 12 }}>
            Takes about 3 minutes · No account needed · Use it as many times as you want
          </p>

          {/* Credit */}
          <div style={{
            marginTop: 36, padding: '18px 20px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)',
            borderRadius: 12, display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>🧠</span>
            <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.6, margin: 0 }}>
              Built on a framework co-developed by a leading AI strategist and a top-producing agent who's used AI to transform his real estate business — adapted by {theme.brandName} into a tool anyone can use in minutes.<br /><br />
              <a href="https://www.facebook.com/groups/aipromptsforrealestateprofessionals"
                target="_blank" rel="noopener noreferrer"
                style={{ color: '#F0A422', textDecoration: 'underline' }}>
                For more excellent AI advice for Realtors, visit their Facebook group →
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT — white panel */}
        <div style={{
          background: '#fff',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.32)',
        }}>
          {/* Panel header — dark gradient */}
          <div style={{
            background: 'linear-gradient(135deg, #111D33, #243659)',
            padding: '20px 24px',
          }}>
            <div style={{
              fontSize: 16.7, fontWeight: 800, letterSpacing: '0.04em',
              textTransform: 'uppercase', color: '#fff', marginBottom: 6,
            }}>
              What These Prompts Will Build For You
            </div>
            <p style={{ fontSize: 15.5, color: '#fff', lineHeight: 1.5, margin: 0 }}>
              Implement these prompts using the included step-by-step instructions and you'll have all of this:
            </p>
          </div>

          {/* Outcome rows */}
          {OUTCOMES.map((o, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '14px 20px',
              borderBottom: i < OUTCOMES.length - 1 ? '1px solid #DDD5C5' : 'none',
              background: '#fff',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: '#FDF0D5', border: '1px solid rgba(240,164,34,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>{o.icon}</div>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1A1A2E', marginBottom: 3, lineHeight: 1.3 }}>{o.title}</div>
                <p style={{ fontSize: 13.9, color: '#5A6278', lineHeight: 1.5, margin: 0 }}>{o.detail}</p>
              </div>
            </div>
          ))}

          {/* Panel footer */}
          <div style={{ padding: '16px 20px', background: '#F2EEE8', borderTop: '1px solid #DDD5C5' }}>
            <p style={{ textAlign: 'center', fontSize: 13.3, color: '#5A6278', margin: 0 }}>
              Takes 3 minutes · No login · Use it as many times as you want
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '16px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          This free tool is brought to you by{' '}
          <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: 'rgba(240,164,34,0.7)', textDecoration: 'none', fontWeight: 600 }}>
            {theme.brandName}
          </a>
          {' '}— {theme.footerText}.
        </p>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          © 2025 {theme.brandName} ·{' '}
          <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: '#F0A422', textDecoration: 'none' }}>
            Learn More
          </a>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 24px 20px 40px !important;
          }
          .hero-grid h1 { font-size: 34px !important; }
        }
      `}</style>
    </div>
  );
}