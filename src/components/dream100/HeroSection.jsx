import React from "react";
import { useTheme } from "@/components/ThemeContext";

export default function HeroSection({ onStart }) {
  const { theme } = useTheme();
  return (
    <section className="d100-hero">
      {/* Desktop two-column wrapper */}
      <div className="d100-hero-inner">

        {/* Left: text column */}
        <div className="d100-hero-left">
          <div className="d100-hero-badge">✦ Free Tool for Real Estate Agents</div>
          <h1>Find the <em>10 People</em> Who Already Know Your Next Clients</h1>
          <p>Get a complete 7-prompt AI blueprint to build your Dream 100 referral partner system — built for your niche and your market in minutes.</p>

          <button className="d100-hero-cta-btn" onClick={onStart}>Build My Free Blueprint ⚡</button>
          <p className="d100-hero-sub-note">Takes about 3 minutes · No account needed · Use it as many times as you want</p>
        </div>

        {/* Right: features + credit */}
        <div className="d100-hero-right">
          <div className="d100-hero-features">
            <div className="d100-hero-feature">
              <div className="d100-hero-feature-icon">✓</div>
              Dream 10 partner map, ranked and tiered
            </div>
            <div className="d100-hero-feature">
              <div className="d100-hero-feature-icon">✓</div>
              Outreach scripts, objection responses
            </div>
            <div className="d100-hero-feature">
              <div className="d100-hero-feature-icon">✓</div>
              90-day relationship building system
            </div>
            <div className="d100-hero-feature">
              <div className="d100-hero-feature-icon">✓</div>
              No login. Free to use. Always.
            </div>
          </div>

          <div className="d100-hero-credit">
            <div className="d100-hero-credit-inner">
              <span className="d100-credit-icon">🧠</span>
              <span className="d100-hero-credit-text">Built on a framework co-developed by a leading AI strategist and a top-producing agent who's used AI to transform his real estate business — adapted by NurturInk into a tool anyone can use in minutes. <a href="https://www.facebook.com/groups/aipromptsforrealestateprofessionals" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold, #C8A951)', textDecoration: 'underline' }}>For more excellent AI advice for Realtors, visit their group on Facebook.</a></span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}