import React from "react";

export const C = {
  navy: "#1B2A4A",
  navyLight: "#243659",
  gold: "#C9973A",
  goldLight: "#E8B55A",
  cream: "#FAF8F4",
  creamDark: "#F0EBE1",
  text: "#1A1A2E",
  muted: "#5A6278",
  white: "#FFFFFF",
  border: "#DDD5C5",
  success: "#2D6A4F",
  successBg: "#EAF4EE",
  error: "#DC2626",
};

export const font = "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export default function TrackerStyles() {
  return (
    <style>{`
      .tk-wrap {
        background: ${C.cream};
        min-height: 100vh;
        font-family: ${font};
        color: ${C.text};
      }
      .tk-nav {
        background: ${C.navy};
        position: sticky;
        top: 0;
        z-index: 60;
        box-shadow: 0 2px 20px rgba(0,0,0,0.25);
      }
      .tk-nav-inner {
        max-width: 780px;
        margin: 0 auto;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .tk-nav-title {
        color: ${C.white};
        font-weight: 700;
        font-size: 15px;
      }
      .tk-nav-sub {
        color: rgba(255,255,255,0.5);
        font-size: 11px;
        margin-top: 2px;
      }
      .tk-main {
        max-width: 780px;
        margin: 0 auto;
        padding: 24px 20px 64px;
      }
      /* The naming step lays out a two-column card grid, so it needs more
         width than the single-column list that follows it. */
      .tk-main.tk-main-wide {
        max-width: 1140px;
      }
      .tk-card {
        background: ${C.white};
        border: 1px solid ${C.border};
        border-radius: 14px;
        padding: 18px 20px;
        margin-bottom: 14px;
        box-shadow: 0 2px 12px rgba(27,42,74,0.05);
      }
      .tk-card.tk-due {
        border-color: ${C.gold};
        box-shadow: 0 2px 16px rgba(201,151,58,0.16);
      }
      .tk-card.tk-quiet { opacity: 0.62; }
      .tk-eyebrow {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: ${C.muted};
      }
      .tk-type {
        font-size: 13px;
        font-weight: 700;
        color: ${C.gold};
        margin-bottom: 2px;
      }
      .tk-name {
        font-size: 19px;
        font-weight: 800;
        color: ${C.navy};
        line-height: 1.25;
      }
      .tk-name-empty { color: ${C.muted}; font-weight: 600; font-style: italic; }
      .tk-action {
        background: ${C.creamDark};
        border-radius: 10px;
        padding: 12px 14px;
        margin: 14px 0 12px;
      }
      .tk-action-label {
        font-size: 15px;
        font-weight: 700;
        color: ${C.navy};
        margin-bottom: 4px;
      }
      .tk-action-detail {
        font-size: 13px;
        color: ${C.muted};
        line-height: 1.6;
      }
      .tk-pill {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 999px;
        background: rgba(27,42,74,0.07);
        color: ${C.muted};
        white-space: nowrap;
      }
      .tk-pill-due { background: rgba(201,151,58,0.18); color: #8A6417; }
      .tk-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
      .tk-btn {
        font-family: ${font};
        font-size: 13px;
        font-weight: 700;
        border-radius: 9px;
        padding: 9px 14px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: opacity 0.15s ease;
      }
      .tk-btn:disabled { opacity: 0.45; cursor: default; }
      .tk-btn-primary { background: ${C.gold}; color: ${C.navy}; }
      .tk-btn-ghost { background: transparent; border-color: ${C.border}; color: ${C.muted}; }
      .tk-btn-link {
        background: none; border: none; padding: 0;
        color: ${C.muted}; font-size: 12px; cursor: pointer;
        text-decoration: underline; font-family: ${font};
      }
      .tk-input {
        font-family: ${font};
        font-size: 15px;
        width: 100%;
        padding: 11px 13px;
        border: 1.5px solid ${C.border};
        border-radius: 9px;
        background: ${C.white};
        color: ${C.text};
        box-sizing: border-box;
      }
      .tk-input:focus { outline: none; border-color: ${C.gold}; }
      .tk-label {
        font-size: 12px;
        font-weight: 700;
        color: ${C.muted};
        display: block;
        margin-bottom: 5px;
      }
      .tk-note {
        font-size: 13px;
        color: ${C.text};
        line-height: 1.6;
        padding: 9px 0;
        border-bottom: 1px solid ${C.creamDark};
      }
      .tk-note-at { font-size: 11px; color: ${C.muted}; display: block; margin-bottom: 2px; }
      .tk-card-seam {
        margin-top: 10px;
        font-size: 12px;
        color: ${C.muted};
        line-height: 1.6;
      }
      .tk-card-seam a { color: ${C.navy}; font-weight: 700; }
      .tk-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      @media (max-width: 560px) {
        .tk-grid2 { grid-template-columns: 1fr; }
        .tk-name { font-size: 17px; }
      }
    `}</style>
  );
}
