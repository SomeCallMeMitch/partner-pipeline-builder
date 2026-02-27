import React from "react";

export default function Dream100Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

      /* Theme colors come from index.css via --ni-* variables.      */
      /* Non-color design tokens stay here:                          */
      :root {
        --d100-radius: 14px;
        --d100-shadow: 0 2px 16px rgba(27,42,74,0.09);
        --shadow-lg:   0 8px 40px rgba(27,42,74,0.16);
      }

      /* Map old Dream100 var names to the new theme vars            */
      /* so all existing CSS rules below continue to work as-is:    */
      :root, .theme-nurturink, .theme-coastal, .theme-charcoal {
        --navy:        var(--ni-navy);
        --navy-light:  var(--ni-navy-light);
        --gold:        var(--ni-gold);
        --gold-light:  var(--ni-gold-light);
        --cream:       var(--ni-cream);
        --cream-dark:  var(--ni-cream-dark);
        --d100-text:   var(--ni-text);
        --text-muted:  var(--ni-muted);
        --d100-white:  var(--ni-white);
        --d100-border: var(--ni-border);
        --success:     var(--ni-success);
      }

      body {
        font-family: 'Sora', -apple-system, sans-serif !important;
        background: var(--cream) !important;
        color: var(--d100-text) !important;
        line-height: 1.6;
        font-size: 16px;
      }

      .d100-sticky-nav {
        position: sticky;
        top: 0;
        z-index: 50;
        background: var(--navy);
        box-shadow: 0 2px 12px rgba(0,0,0,0.2);
      }
      .d100-nav-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .d100-logo-wrap {
        display: flex;
        align-items: center;
        gap: 9px;
        text-decoration: none;
      }
      .d100-logo-mark {
        width: 30px; height: 30px;
        background: var(--gold);
        border-radius: 6px;
        display: flex; align-items: center; justify-content: center;
        font-size: 15px; font-weight: 800;
        color: var(--navy);
        font-family: 'Sora', sans-serif;
        flex-shrink: 0;
      }
      .d100-logo-text { color: var(--d100-white); font-size: 15px; font-weight: 600; }
      .d100-logo-text span { color: var(--gold-light); }
      .d100-header-cta {
        color: var(--gold-light);
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        border: 1px solid rgba(201,151,58,0.45);
        padding: 7px 14px;
        border-radius: 20px;
        transition: all 0.2s;
        white-space: nowrap;
      }
      .d100-header-cta:active { background: rgba(201,151,58,0.15); }

      .d100-step-bar {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        gap: 0;
        transition: opacity 0.2s;
      }
      .d100-step-bar.hidden { display: none; }
      .d100-step-pip {
        display: flex; align-items: center; justify-content: center;
        width: 28px; height: 28px;
        border-radius: 50%;
        font-size: 12px; font-weight: 700;
        background: rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.45);
        border: 1.5px solid rgba(255,255,255,0.15);
        transition: all 0.3s;
        flex-shrink: 0;
        position: relative; z-index: 1;
      }
      .d100-step-pip.active {
        background: var(--gold);
        color: var(--navy);
        border-color: var(--gold);
      }
      .d100-step-pip.done {
        background: rgba(201,151,58,0.25);
        color: var(--gold-light);
        border-color: rgba(201,151,58,0.4);
      }
      .d100-step-connector {
        flex: 1; height: 2px;
        background: rgba(255,255,255,0.12);
        transition: background 0.3s;
      }
      .d100-step-connector.done { background: rgba(201,151,58,0.4); }
      .d100-step-label {
        font-size: 11px; color: rgba(255,255,255,0.5);
        margin-left: 12px; white-space: nowrap; font-weight: 500;
      }
      .d100-step-label strong { color: var(--gold-light); font-weight: 600; }

      .d100-hero {
        background: var(--navy);
        padding: 36px 22px 44px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .d100-hero::before {
        content: '';
        position: absolute; inset: 0;
        background: radial-gradient(ellipse 80% 60% at 50% 110%, rgba(201,151,58,0.14), transparent);
        pointer-events: none;
      }
      .d100-hero-badge {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(201,151,58,0.15);
        border: 1px solid rgba(201,151,58,0.35);
        color: var(--gold-light);
        font-size: 11px; font-weight: 700;
        letter-spacing: 0.07em; text-transform: uppercase;
        padding: 6px 14px; border-radius: 20px; margin-bottom: 20px;
      }
      .d100-hero h1 {
        font-size: 26px; font-weight: 800; color: var(--d100-white);
        line-height: 1.22; margin-bottom: 14px; letter-spacing: -0.02em;
        position: relative;
      }
      .d100-hero h1 em { font-style: normal; color: var(--gold-light); }
      .d100-hero p {
        color: rgba(255,255,255,0.78); font-size: 16px; font-weight: 400;
        line-height: 1.6; margin-bottom: 30px; max-width: 440px;
        margin-left: auto; margin-right: auto; position: relative;
      }
      .d100-hero-features {
        display: flex; flex-direction: column; gap: 10px;
        text-align: left; max-width: 340px; margin: 0 auto 32px;
        position: relative;
      }
      .d100-hero-feature {
        display: flex; align-items: flex-start; gap: 10px;
        color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 500; line-height: 1.4;
      }
      .d100-hero-feature-icon {
        width: 22px; height: 22px;
        background: rgba(201,151,58,0.2);
        border: 1px solid rgba(201,151,58,0.35);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; flex-shrink: 0; margin-top: 1px;
      }
      .d100-hero-cta-btn {
        display: inline-flex; align-items: center; gap: 8px;
        background: var(--gold); color: var(--navy);
        font-size: 16px; font-weight: 800;
        padding: 16px 30px; border-radius: 50px; border: none;
        cursor: pointer; transition: all 0.2s;
        text-decoration: none;
        box-shadow: 0 4px 20px rgba(201,151,58,0.4);
        font-family: 'Sora', sans-serif;
        position: relative;
      }
      .d100-hero-cta-btn:active { transform: scale(0.97); }
      .d100-hero-sub-note {
        color: rgba(255,255,255,0.42); font-size: 12px;
        margin-top: 12px; font-weight: 400; position: relative;
      }
      .d100-hero-credit {
        margin-top: 22px; padding-top: 18px;
        border-top: 1px solid rgba(255,255,255,0.1);
        max-width: 420px; margin-left: auto; margin-right: auto;
        position: relative;
      }
      .d100-hero-credit-inner {
        display: flex; align-items: flex-start; gap: 10px; text-align: left;
      }
      .d100-credit-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
      .d100-hero-credit-text {
        font-size: 13px; color: rgba(255,255,255,0.55);
        line-height: 1.55; font-weight: 400;
      }

      .d100-main {
        padding: 28px 18px 80px;
        max-width: 680px;
        margin: 0 auto;
      }

      .d100-form-card {
        background: var(--d100-white);
        border-radius: var(--d100-radius);
        border: 1px solid var(--d100-border);
        padding: 26px 20px;
        box-shadow: var(--d100-shadow);
        animation: d100fadeUp 0.25s ease both;
      }
      @keyframes d100fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .d100-card-title {
        font-size: 20px; font-weight: 800; color: var(--navy);
        margin-bottom: 6px; line-height: 1.25; letter-spacing: -0.01em;
      }
      .d100-card-sub {
        font-size: 15px; color: var(--text-muted);
        margin-bottom: 24px; line-height: 1.5; font-weight: 400;
      }
      .d100-card-sub strong { color: var(--d100-text); font-weight: 600; }

      .d100-field-group { margin-bottom: 22px; }
      .d100-field-label {
        display: block; font-size: 14px; font-weight: 700;
        color: var(--navy); margin-bottom: 6px; letter-spacing: 0.01em;
      }
      .d100-field-label .opt {
        font-weight: 400; color: var(--text-muted); font-size: 13px;
      }
      .d100-field-hint {
        font-size: 13px; color: var(--text-muted);
        margin-top: 7px; line-height: 1.5; font-style: italic;
      }
      .d100-input, .d100-select, .d100-textarea {
        width: 100%; padding: 14px 16px;
        border: 1.5px solid var(--d100-border);
        border-radius: 10px;
        font-family: 'Sora', sans-serif; font-size: 16px;
        color: var(--d100-text); background: var(--cream);
        outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        line-height: 1.4; appearance: none; -webkit-appearance: none;
      }
      .d100-input:focus, .d100-select:focus, .d100-textarea:focus {
        border-color: var(--navy); background: var(--d100-white);
        box-shadow: 0 0 0 3px rgba(27,42,74,0.09);
      }
      .d100-textarea { min-height: 88px; resize: none; }
      .d100-select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%235A6278' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 14px center;
        padding-right: 44px;
        cursor: pointer;
      }
      .d100-error-msg {
        font-size: 13px; color: #DC2626; margin-top: 6px; font-weight: 500;
      }
      .d100-has-error .d100-input,
      .d100-has-error .d100-select,
      .d100-has-error .d100-textarea { border-color: #DC2626 !important; }

      .d100-niche-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
      }
      .d100-niche-card {
        border: 2px solid var(--d100-border);
        border-radius: 10px; padding: 13px 14px;
        cursor: pointer; transition: all 0.18s;
        background: var(--cream); position: relative;
        -webkit-tap-highlight-color: transparent;
      }
      .d100-niche-card:active { transform: scale(0.97); }
      .d100-niche-card.selected {
        border-color: var(--navy); background: var(--d100-white);
        box-shadow: 0 0 0 2px rgba(27,42,74,0.1);
      }
      .d100-niche-card.selected::after {
        content: '✓'; position: absolute; top: 8px; right: 10px;
        width: 18px; height: 18px; background: var(--navy);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 10px; color: white; font-weight: 800;
      }
      .d100-niche-icon { font-size: 20px; margin-bottom: 5px; }
      .d100-niche-title { font-size: 13px; font-weight: 700; color: var(--navy); line-height: 1.2; margin-bottom: 3px; }
      .d100-niche-desc { font-size: 11px; color: var(--text-muted); line-height: 1.3; font-weight: 400; }

      .d100-niche-helper {
        background: rgba(201,151,58,0.08);
        border: 1px solid rgba(201,151,58,0.25);
        border-radius: 10px; padding: 14px 16px; margin-top: 12px;
      }
      .d100-niche-helper p {
        font-size: 14px; color: var(--navy); font-weight: 500;
        margin-bottom: 8px; line-height: 1.4;
      }
      .d100-chip {
        font-size: 12px; font-weight: 600;
        background: var(--d100-white); border: 1px solid var(--d100-border);
        color: var(--navy); padding: 5px 11px; border-radius: 20px;
        cursor: pointer; transition: all 0.15s;
        display: inline-block; margin: 0 7px 7px 0;
      }
      .d100-chip:active { background: var(--navy); color: var(--d100-white); border-color: var(--navy); }

      .d100-form-nav {
        display: flex; gap: 10px; justify-content: flex-end;
        margin-top: 24px; padding-top: 20px;
        border-top: 1px solid var(--d100-border);
      }
      .d100-btn-back {
        padding: 13px 20px; border: 1.5px solid var(--d100-border);
        border-radius: 10px; background: transparent;
        color: var(--text-muted); font-family: 'Sora', sans-serif;
        font-size: 15px; font-weight: 600; cursor: pointer;
        transition: all 0.2s;
      }
      .d100-btn-back:active { border-color: var(--navy); color: var(--navy); }
      .d100-btn-next {
        flex: 1; padding: 14px 20px; border: none; border-radius: 10px;
        background: var(--navy); color: var(--d100-white);
        font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700;
        cursor: pointer; transition: all 0.2s;
      }
      .d100-btn-next:active { background: var(--navy-light); transform: scale(0.98); }
      .d100-btn-generate {
        flex: 1; padding: 15px 20px; border: none; border-radius: 10px;
        background: var(--gold); color: var(--navy);
        font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 800;
        cursor: pointer; transition: all 0.2s;
        box-shadow: 0 4px 16px rgba(201,151,58,0.35);
      }
      .d100-btn-generate:active { transform: scale(0.97); }

      .d100-confirm-box {
        background: var(--cream-dark); border-radius: 10px;
        padding: 18px; margin-bottom: 18px;
        display: flex; flex-direction: column; gap: 12px;
      }
      .d100-confirm-row { display: flex; gap: 12px; align-items: flex-start; }
      .d100-confirm-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
      .d100-confirm-label {
        font-size: 11px; font-weight: 700; color: var(--text-muted);
        text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 2px;
      }
      .d100-confirm-value { font-size: 15px; font-weight: 700; color: var(--navy); line-height: 1.3; }
      .d100-confirm-what {
        background: rgba(201,151,58,0.1);
        border: 1px solid rgba(201,151,58,0.28);
        border-radius: 10px; padding: 14px 16px;
        font-size: 14px; color: var(--navy); font-weight: 500; line-height: 1.6;
      }

      .d100-generating-card {
        background: var(--d100-white); border-radius: var(--d100-radius);
        border: 1px solid var(--d100-border); padding: 48px 20px;
        text-align: center; box-shadow: var(--d100-shadow);
        animation: d100fadeUp 0.25s ease both;
      }
      .d100-spinner {
        width: 44px; height: 44px;
        border: 3px solid var(--cream-dark);
        border-top-color: var(--gold);
        border-radius: 50%;
        animation: d100spin 0.8s linear infinite;
        margin: 0 auto 20px;
      }
      @keyframes d100spin { to { transform: rotate(360deg); } }
      .d100-generating-card h3 { font-size: 19px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
      .d100-generating-card p { font-size: 15px; color: var(--text-muted); line-height: 1.5; }

      .d100-output-header {
        text-align: center; margin-bottom: 28px; padding-bottom: 24px;
        border-bottom: 1px solid var(--d100-border);
      }
      .d100-success-badge {
        display: inline-block;
        background: rgba(45,106,79,0.1); color: var(--success);
        font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
        text-transform: uppercase; padding: 5px 14px; border-radius: 20px;
        margin-bottom: 14px;
      }
      .d100-output-header h1 {
        font-size: 22px; font-weight: 800; color: var(--navy);
        margin-bottom: 8px; line-height: 1.25; letter-spacing: -0.01em;
      }
      .d100-output-header p { font-size: 15px; color: var(--text-muted); line-height: 1.5; }

      .d100-output-actions {
        display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px;
      }
      .d100-btn-copy-all {
        width: 100%; padding: 15px;
        background: var(--navy); color: var(--d100-white);
        border: none; border-radius: 10px;
        font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700;
        cursor: pointer; transition: all 0.2s;
      }
      .d100-btn-copy-all:active { background: var(--navy-light); }
      .d100-btn-row-2 { display: flex; gap: 10px; }
      .d100-btn-email {
        flex: 1; padding: 13px;
        background: transparent; color: var(--navy);
        border: 1.5px solid var(--navy); border-radius: 10px;
        font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600;
        cursor: pointer; transition: all 0.2s;
      }
      .d100-btn-email:active { background: var(--navy); color: var(--d100-white); }
      .d100-btn-restart {
        padding: 13px 16px;
        background: transparent; color: var(--text-muted);
        border: 1.5px solid var(--d100-border); border-radius: 10px;
        font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 500;
        cursor: pointer; transition: all 0.2s;
      }

      .d100-phase-card {
        background: var(--d100-white);
        border-radius: var(--d100-radius);
        border: 1px solid var(--d100-border);
        border-left: 4px solid var(--gold);
        margin-bottom: 14px;
        box-shadow: var(--d100-shadow);
        overflow: hidden;
      }
      .d100-phase-header {
        padding: 16px 18px 14px;
        display: flex; align-items: flex-start;
        justify-content: space-between; gap: 12px;
        cursor: pointer; user-select: none;
      }
      .d100-phase-num {
        font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
        text-transform: uppercase; color: var(--gold); margin-bottom: 3px;
      }
      .d100-phase-title {
        font-size: 16px; font-weight: 700; color: var(--navy); line-height: 1.3;
      }
      .d100-phase-model-badge {
        display: inline-block; font-size: 11px; font-weight: 600;
        padding: 3px 9px; border-radius: 12px;
        background: rgba(27,42,74,0.07); color: var(--navy); margin-top: 5px;
      }
      .d100-phase-toggle {
        color: var(--text-muted); font-size: 20px;
        transition: transform 0.25s; flex-shrink: 0; margin-top: 2px; line-height: 1;
      }
      .d100-phase-toggle.open { transform: rotate(180deg); }
      .d100-phase-body {
        padding: 0 18px 18px; border-top: 1px solid var(--d100-border);
      }
      .d100-model-note {
        font-size: 13px; color: var(--text-muted); font-style: italic;
        padding: 10px 0 12px; border-bottom: 1px dashed var(--d100-border);
        margin-bottom: 14px; line-height: 1.5;
      }
      .d100-prompt-text {
        background: var(--cream); border: 1px solid var(--d100-border);
        border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.75;
        color: var(--d100-text); white-space: pre-wrap;
        font-family: 'Sora', sans-serif; max-height: 320px; overflow-y: auto; font-weight: 400;
      }
      .d100-phase-btn-row { display: flex; gap: 8px; margin-top: 12px; }
      .d100-phase-copy-btn {
        flex: 1; padding: 12px;
        background: var(--cream); border: 1.5px solid var(--d100-border);
        border-radius: 8px; font-family: 'Sora', sans-serif;
        font-size: 14px; font-weight: 700; color: var(--navy);
        cursor: pointer; transition: all 0.2s;
      }
      .d100-phase-copy-btn:active { background: var(--navy); color: var(--d100-white); border-color: var(--navy); }
      .d100-phase-copy-btn.copied { background: var(--success); color: var(--d100-white); border-color: var(--success); }
      .d100-phase-dl-btn {
        padding: 12px 14px;
        background: var(--cream); border: 1.5px solid var(--d100-border);
        border-radius: 8px; font-family: 'Sora', sans-serif;
        font-size: 13px; font-weight: 700; color: var(--navy);
        cursor: pointer; transition: all 0.2s;
        white-space: nowrap; flex-shrink: 0;
      }
      .d100-phase-dl-btn:active { background: var(--navy); color: var(--d100-white); border-color: var(--navy); }

      .d100-nurturink-cta {
        background: var(--navy); border-radius: var(--d100-radius);
        padding: 28px 22px; margin: 28px 0;
        position: relative; overflow: hidden;
      }
      .d100-nurturink-cta::before {
        content: ''; position: absolute;
        top: -30px; right: -30px;
        width: 160px; height: 160px;
        background: radial-gradient(circle, rgba(201,151,58,0.14), transparent 65%);
        pointer-events: none;
      }
      .d100-cta-eyebrow {
        font-size: 11px; font-weight: 700; letter-spacing: 0.09em;
        text-transform: uppercase; color: var(--gold-light); margin-bottom: 10px;
        position: relative;
      }
      .d100-nurturink-cta h3 {
        font-size: 20px; font-weight: 800; color: var(--d100-white);
        margin-bottom: 14px; line-height: 1.3; letter-spacing: -0.01em;
        position: relative;
      }
      .d100-nurturink-cta p {
        font-size: 15px; color: rgba(255,255,255,0.85);
        line-height: 1.65; margin-bottom: 14px; font-weight: 400;
        position: relative;
      }
      .d100-nurturink-cta p strong { color: #fff; font-weight: 700; }
      .d100-cta-stats {
        display: flex; gap: 0; margin-bottom: 22px;
        background: rgba(255,255,255,0.06);
        border-radius: 10px; overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
        position: relative;
      }
      .d100-cta-stat {
        flex: 1; padding: 13px 8px; text-align: center;
        border-right: 1px solid rgba(255,255,255,0.08);
      }
      .d100-cta-stat:last-child { border-right: none; }
      .d100-cta-stat strong {
        display: block; font-size: 20px; color: var(--gold-light);
        font-weight: 800; line-height: 1; margin-bottom: 3px;
      }
      .d100-cta-stat span {
        font-size: 11px; color: rgba(255,255,255,0.5);
        font-weight: 400; line-height: 1.3; display: block;
      }
      .d100-cta-link {
        display: flex; align-items: center; justify-content: center;
        gap: 8px; background: var(--gold); color: var(--navy);
        text-decoration: none; font-weight: 800; font-size: 15px;
        padding: 14px; border-radius: 10px; transition: all 0.2s;
        width: 100%; position: relative;
      }
      .d100-cta-link:active { background: var(--gold-light); transform: scale(0.98); }

      .d100-modal-overlay {
        position: fixed; inset: 0;
        background: rgba(15,20,40,0.6);
        backdrop-filter: blur(5px);
        z-index: 200;
        display: flex; align-items: flex-end; justify-content: center;
        padding: 0;
      }
      .d100-modal-box {
        background: var(--d100-white);
        border-radius: 20px 20px 0 0;
        padding: 28px 22px 36px;
        width: 100%; max-width: 600px;
        box-shadow: var(--shadow-lg);
        animation: d100slideUp 0.28s ease both;
      }
      @keyframes d100slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      .d100-modal-handle {
        width: 36px; height: 4px;
        background: var(--d100-border);
        border-radius: 2px; margin: 0 auto 20px;
      }
      .d100-modal-box h3 { font-size: 20px; font-weight: 800; color: var(--navy); margin-bottom: 6px; }
      .d100-modal-sub { font-size: 15px; color: var(--text-muted); margin-bottom: 18px; line-height: 1.5; }
      .d100-btn-modal-send {
        width: 100%; padding: 15px;
        background: var(--gold); color: var(--navy);
        border: none; border-radius: 10px;
        font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800;
        cursor: pointer; margin-bottom: 10px;
      }
      .d100-btn-modal-cancel {
        width: 100%; padding: 13px;
        border: 1.5px solid var(--d100-border); background: transparent;
        border-radius: 10px; font-family: 'Sora', sans-serif;
        font-size: 15px; color: var(--text-muted); cursor: pointer; font-weight: 500;
      }
      .d100-modal-fine {
        font-size: 11px; color: var(--text-muted);
        text-align: center; margin-top: 10px; line-height: 1.5;
      }
      .d100-email-success { text-align: center; padding: 12px 0; }
      .d100-email-success .checkmark { font-size: 44px; margin-bottom: 14px; }
      .d100-email-success h3 { font-size: 20px; font-weight: 800; color: var(--navy); margin-bottom: 8px; }
      .d100-email-success p { font-size: 15px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }

      .d100-share-strip {
        text-align: center; padding: 16px;
        font-size: 14px; color: var(--text-muted); font-weight: 500; line-height: 1.5;
      }
      .d100-share-strip a {
        color: var(--gold); font-weight: 700; text-decoration: none;
        display: inline-block; margin-top: 4px; cursor: pointer;
      }

      .d100-site-footer {
        background: var(--navy);
        color: rgba(255,255,255,0.45);
        text-align: center; padding: 22px 20px;
        font-size: 13px; line-height: 1.7;
      }
      .d100-site-footer a { color: rgba(201,151,58,0.8); text-decoration: none; }

      @media (min-width: 600px) {
        .d100-hero { padding: 48px 32px 56px; }
        .d100-hero h1 { font-size: 34px; }
        .d100-hero p { font-size: 17px; }
        .d100-hero-features { flex-direction: row; flex-wrap: wrap; max-width: 480px; gap: 12px 20px; }
        .d100-main { padding: 36px 24px 80px; }
        .d100-form-card { padding: 32px 28px; }
        .d100-niche-grid { grid-template-columns: repeat(4, 1fr); }
        .d100-output-actions { flex-direction: row; }
        .d100-btn-copy-all { flex: 1.5; }
        .d100-btn-row-2 { flex: 1; }
        .d100-modal-overlay { align-items: center; padding: 24px; }
        .d100-modal-box { border-radius: 20px; max-width: 440px; }
      }

      @media (min-width: 900px) {
        .d100-hero { padding: 64px 48px 72px; }
        .d100-hero h1 { font-size: 42px; max-width: 640px; margin-left: auto; margin-right: auto; }
        .d100-hero p { font-size: 18px; max-width: 520px; }
        .d100-hero-features { flex-direction: row; flex-wrap: wrap; max-width: 560px; gap: 14px 24px; }
        .d100-main { padding: 44px 32px 100px; max-width: 760px; }
        .d100-form-card { padding: 40px 36px; }
        .d100-card-title { font-size: 24px; }
        .d100-niche-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
      }

      @media (min-width: 1200px) {
        .d100-main { max-width: 820px; }
        .d100-nav-top { padding: 14px 36px; }
        .d100-hero { padding: 80px 64px 88px; }
        .d100-hero h1 { font-size: 48px; max-width: 740px; }
        .d100-hero p { font-size: 19px; max-width: 580px; }
        .d100-form-card { padding: 44px 40px; }
        .d100-card-title { font-size: 26px; }
      }
    `}</style>
  );
}