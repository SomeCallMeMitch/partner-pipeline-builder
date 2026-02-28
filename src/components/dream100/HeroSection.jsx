import React from "react";
import { useTheme } from "@/components/ThemeContext";

const FEATURES = [
  {
    icon: "🏆",
    title: "A ranked list of your Dream 10 referral partners",
    desc: "Specific professionals in your market, tiered by referral potential for your niche — not generic types, real categories of people in your city."
  },
  {
    icon: "🤝",
    title: "A value strategy for each partner type",
    desc: "What you bring to them — not just what you want from them. This is the foundation every relationship gets built on."
  },
  {
    icon: "📋",
    title: "Complete outreach scripts, ready to personalize",
    desc: "Email, phone, door-knock, and handwritten note templates. You fill in the name — everything else is written."
  },
  {
    icon: "🛡️",
    title: "Objection responses, pre-written",
    desc: "Every pushback a partner might give, with confident, non-salesy answers prepared before you even pick up the phone."
  },
  {
    icon: "📅",
    title: "A 90-day action plan, week by week",
    desc: "Exactly what to do each week to build relationships that generate consistent referrals — no guessing."
  },
  {
    icon: "📊",
    title: "12-month production math",
    desc: "How many partners you need, at what referral rate, to hit your annual income goal — in black and white."
  },
];

export default function HeroSection({ onStart }) {
  const { theme } = useTheme();

  return (
    <section style={{
      background: '#1B2A4A',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Sora', -apple-system, sans-serif",
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 54,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none'
        }}>
          <div style={{
            width: 32, height: 32, background: '#F0A422', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 15, color: '#1B2A4A', flexShrink: 0,
          }}>{theme.logoMark}</div>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{theme.brandName}</span>
        </a>
        <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" style={{
          color: '#F7BC55', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          border: '1px solid rgba(247,188,85,0.45)', padding: '7px 16px', borderRadius: 20,
        }}>
          Visit {theme.brandName} →
        </a>
      </nav>

      {/* Hero body */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        padding: '48px 48px 56px',
        gap: 72,
        boxSizing: 'border-box',
      }} className="hero-columns">
        {/* LEFT */}
        <div style={{ flex: '0 0 auto', width: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(240,164,34,0.15)', border: '1px solid rgba(240,164,34,0.35)',
            color: '#F7BC55', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '6px 14px', borderRadius: 20,
            marginBottom: 24, width: 'fit-content',
          }}>✦ Free Tool for Real Estate Agents</div>

          {/* Headline */}
          <h1 style={{
            fontSize: 48, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em',
            color: '#fff', marginBottom: 20,
          }}>
            Find the{' '}
            <span style={{ color: '#F0A422' }}>10 People</span>
            {' '}Who Already Know Your Next{' '}
            <span style={{ color: '#F0A422' }}>50 Clients</span>
          </h1>

          {/* Sub */}
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 17, lineHeight: 1.6, marginBottom: 32, maxWidth: 440 }}>
            Get a complete 10-prompt AI blueprint to build your Dream 100 referral partner system — built for your niche and your market in minutes.
          </p>

          {/* CTA */}
          <button onClick={onStart} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#F0A422', color: '#1B2A4A',
            fontSize: 17, fontWeight: 800, padding: '17px 32px',
            borderRadius: 50, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(240,164,34,0.4)',
            fontFamily: "'Sora', sans-serif",
            width: 'fit-content', marginBottom: 14,
          }}>
            Build My Free Blueprint — It's Free ⚡
          </button>

          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13 }}>
            Takes about 3 minutes · No account needed · Use it as many times as you want
          </p>

          {/* Credit box */}
          <div style={{
            marginTop: 32,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>🧠</span>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                Built on a framework co-developed by a leading AI strategist and a top-producing agent who's used AI to transform his real estate business — adapted by {theme.brandName} into a tool anyone can use in minutes.{' '}
                <a
                  href="https://www.facebook.com/groups/aipromptsforrealestateprofessionals"
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: '#F0A422', textDecoration: 'underline' }}
                >
                  For more excellent AI advice for Realtors, visit their Facebook group →
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — features card */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            background: '#243659',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {/* Card header */}
            <div style={{
              padding: '20px 28px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#F0A422', textTransform: 'uppercase', marginBottom: 4 }}>
                What These Prompts Will Build For You
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                Implement these prompts using the included step-by-step instructions and you'll have all of this:
              </p>
            </div>

            {/* Feature rows */}
            <div style={{ padding: '8px 0' }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '14px 28px',
                  borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <div style={{
                    width: 36, height: 36, flexShrink: 0,
                    background: 'rgba(255,255,255,0.07)', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 3, lineHeight: 1.3 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Card footer */}
            <div style={{
              padding: '12px 28px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center',
            }}>
              Takes 3 minutes · No login · Use it as many times as you want
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '14px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>
          This free tool is brought to you by{' '}
          <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#F0A422', textDecoration: 'none', fontWeight: 600 }}>{theme.brandName}</a>
          {' '}— {theme.footerText}.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
          © 2025 {theme.brandName} &nbsp;·&nbsp;{' '}
          <a href={theme.brandUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#F0A422', textDecoration: 'none' }}>Learn More</a>
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-columns {
            flex-direction: column !important;
            padding: 32px 20px 48px !important;
            gap: 40px !important;
          }
          .hero-columns > div:first-child {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}