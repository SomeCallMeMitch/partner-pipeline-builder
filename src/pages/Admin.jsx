import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { THEMES, setTheme, getActiveThemeKey } from "@/components/theme";
import Dream100Styles from "@/components/dream100/Dream100Styles";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState(getActiveThemeKey());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || u.role !== 'admin') {
        navigate(createPageUrl("Landing"));
        return;
      }
      setUser(u);
      setLoading(false);
    }).catch(() => navigate(createPageUrl("Landing")));
  }, []);

  const handleApply = (key) => {
    setTheme(key);
    setActiveTheme(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <>
      <Dream100Styles />
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="d100-spinner" />
      </div>
    </>
  );

  return (
    <>
      <Dream100Styles />
      <div style={{ minHeight: "100vh", background: "var(--cream)", paddingBottom: 80 }}>

        {/* Nav */}
        <div className="d100-sticky-nav">
          <div className="d100-nav-top">
            <div style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "'Sora', sans-serif" }}>
              Admin Panel
            </div>
            <button
              onClick={() => navigate(createPageUrl("Landing"))}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "'Sora', sans-serif", cursor: "pointer", fontWeight: 600 }}
            >← Back to App</button>
          </div>
        </div>

        <div className="d100-main" style={{ maxWidth: 700 }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>White-Label Settings</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--navy)", letterSpacing: "-0.02em", marginBottom: 6, fontFamily: "'Sora', sans-serif" }}>Brand Configuration</h1>
            <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.5 }}>Choose a theme to apply across the entire app. Changes take effect immediately for all users.</p>
          </div>

          {/* Theme cards */}
          <div className="d100-form-card" style={{ marginBottom: 20 }}>
            <div className="d100-card-title" style={{ marginBottom: 4 }}>App Theme</div>
            <div className="d100-card-sub">Select a color theme and brand identity.</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.values(THEMES).map(theme => {
                const isActive = activeTheme === theme.key;
                return (
                  <div
                    key={theme.key}
                    onClick={() => handleApply(theme.key)}
                    style={{
                      border: isActive ? "2px solid var(--navy)" : "2px solid var(--d100-border)",
                      borderRadius: 12,
                      padding: "16px 18px",
                      cursor: "pointer",
                      background: isActive ? "rgba(27,42,74,0.04)" : "var(--cream)",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "all 0.18s",
                      position: "relative",
                    }}
                  >
                    {/* Logo mark preview */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: "var(--gold)", color: "var(--navy)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 800, flexShrink: 0,
                      fontFamily: "'Sora', sans-serif",
                    }}>
                      {theme.logoMark}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 2 }}>{theme.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{theme.brandName} · {theme.footerText}</div>
                    </div>

                    {isActive && (
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: "var(--navy)", color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}>✓</div>
                    )}
                  </div>
                );
              })}
            </div>

            {saved && (
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(45,106,79,0.1)", border: "1px solid rgba(45,106,79,0.25)", borderRadius: 8, fontSize: 13, color: "var(--success)", fontWeight: 600 }}>
                ✓ Theme applied successfully
              </div>
            )}
          </div>

          {/* Brand details read-only */}
          <div className="d100-form-card">
            <div className="d100-card-title" style={{ marginBottom: 4 }}>Active Brand Details</div>
            <div className="d100-card-sub">These values are set per theme in <code style={{ fontSize: 12, background: "var(--cream-dark)", padding: "1px 5px", borderRadius: 4 }}>components/theme.js</code></div>

            {(() => {
              const t = THEMES[activeTheme] || THEMES.nurturink;
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Brand Name", value: t.brandName },
                    { label: "Brand URL", value: t.brandUrl },
                    { label: "Footer Text", value: t.footerText },
                    { label: "Logo Mark", value: t.logoMark },
                    { label: "CSS Class", value: t.cssClass },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--d100-border)" }}>
                      <div style={{ width: 110, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{row.label}</div>
                      <div style={{ fontSize: 14, color: "var(--navy)", fontWeight: 500, wordBreak: "break-all" }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </>
  );
}