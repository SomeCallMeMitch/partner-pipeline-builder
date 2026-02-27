// components/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveTheme, setTheme, initTheme } from '@/components/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getActiveTheme);

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    const handler = () => setThemeState(getActiveTheme());
    window.addEventListener('nurturink_theme_change', handler);
    return () => window.removeEventListener('nurturink_theme_change', handler);
  }, []);

  const applyTheme = (key) => {
    setTheme(key);
    setThemeState(getActiveTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};