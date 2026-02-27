// components/theme.js
// Handles brand string data and CSS class switching for white-labeling.
// Colors are defined via CSS variables in Layout.js — not here.

export const THEMES = {
  nurturink: {
    key:        'nurturink',
    cssClass:   'theme-nurturink',
    name:       'NurturInk (Default)',
    brandName:  'NurturInk',
    brandUrl:   'https://nurturink.com/realestate',
    footerText: 'the handwritten follow-up system for relationship-driven sales professionals',
    logoMark:   'N',
  },
  coastal: {
    key:        'coastal',
    cssClass:   'theme-coastal',
    name:       'Coastal Blue',
    brandName:  'Partner Pro',
    brandUrl:   '#',
    footerText: 'your real estate growth system',
    logoMark:   'P',
  },
  charcoal: {
    key:        'charcoal',
    cssClass:   'theme-charcoal',
    name:       'Charcoal & Crimson',
    brandName:  'Blueprint Pro',
    brandUrl:   '#',
    footerText: 'your real estate partner system',
    logoMark:   'B',
  },
};

const STORAGE_KEY = 'nurturink_theme';

export function getActiveThemeKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'nurturink';
  } catch (e) {
    return 'nurturink';
  }
}

export function getActiveTheme() {
  return THEMES[getActiveThemeKey()] || THEMES.nurturink;
}

export function setTheme(key) {
  localStorage.setItem(STORAGE_KEY, key);
  const html = document.documentElement;
  Object.values(THEMES).forEach(t => html.classList.remove(t.cssClass));
  const theme = THEMES[key] || THEMES.nurturink;
  html.classList.add(theme.cssClass);
  window.dispatchEvent(new Event('nurturink_theme_change'));
}

export function initTheme() {
  const key = getActiveThemeKey();
  const theme = THEMES[key] || THEMES.nurturink;
  const html = document.documentElement;
  Object.values(THEMES).forEach(t => html.classList.remove(t.cssClass));
  html.classList.add(theme.cssClass);
}