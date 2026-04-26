import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteConfigAPI } from '../services/api';

const ThemeContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE = API_BASE.replace(/\/api$/, '');

function applyThemeToDOM(theme) {
  if (!theme) return;
  const root = document.documentElement;
  const c = theme.colors || {};
  const t = theme.typography || {};
  const b = theme.buttons || {};
  const card = theme.cards || {};
  const l = theme.layout || {};

  const vars = {
    '--color-primary': c.primary,
    '--color-primary-dark': c.primaryDark,
    '--color-primary-light': c.primaryLight,
    '--color-secondary': c.secondary,
    '--color-secondary-light': c.secondaryLight,
    '--color-accent': c.accent,
    '--color-accent-light': c.accentLight,
    '--color-danger': c.danger,
    '--color-danger-light': c.dangerLight,
    '--color-warning': c.warning,
    '--color-warning-light': c.warningLight,
    '--color-bg': c.background,
    '--color-surface': c.surface,
    '--color-surface-hover': c.surfaceHover,
    '--color-text': c.textPrimary,
    '--color-text-secondary': c.textSecondary,
    '--color-text-muted': c.textMuted,
    '--color-border': c.border,
    '--color-border-light': c.borderLight,
    '--color-hero-start': c.heroGradientStart,
    '--color-hero-end': c.heroGradientEnd,
    '--color-nav-bg': c.navBackground,
    '--color-nav-text': c.navText,
    '--color-footer-bg': c.footerBackground,
    '--color-footer-text': c.footerText,
    '--font-body': t.fontFamily,
    '--font-heading': t.fontFamilyHeading || t.fontFamily,
    '--font-size-base': t.baseFontSize,
    '--font-weight-heading': t.headingWeight,
    '--font-weight-body': t.bodyWeight,
    '--line-height': t.lineHeight,
    '--btn-radius': b.borderRadius,
    '--btn-padding': b.padding,
    '--btn-font-weight': b.fontWeight,
    '--btn-shadow': b.shadow,
    '--btn-hover-shadow': b.hoverShadow,
    '--btn-text-transform': b.textTransform,
    '--card-radius': card.borderRadius,
    '--card-shadow': card.shadow,
    '--card-hover-shadow': card.hoverShadow,
    '--card-border-width': card.borderWidth,
    '--layout-max-width': l.maxWidth,
    '--layout-sidebar-width': l.sidebarWidth,
    '--layout-nav-height': l.navHeight,
    '--layout-content-padding': l.contentPadding,
    '--layout-section-gap': l.sectionGap,
  };

  Object.entries(vars).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });

  root.setAttribute('data-theme', theme.mode || 'light');

  // load google font
  const fontName = t.googleFont || 'Inter';
  const headingFont = t.googleFontHeading;
  const fonts = [fontName];
  if (headingFont && headingFont !== fontName) fonts.push(headingFont);
  const linkId = 'dynamic-google-font';
  let link = document.getElementById(linkId);
  if (!link) {
    link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  const families = fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800`).join('&');
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export function ThemeProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(null);
  const [theme, setTheme] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConfig = useCallback(async () => {
    try {
      const res = await siteConfigAPI.get();
      setSiteConfig(res.data.config);
      if (res.data.theme) {
        setTheme(res.data.theme);
        applyThemeToDOM(res.data.theme);
      }
    } catch (err) {
      console.error('Failed to load site config:', err);
    }
    setLoading(false);
  }, []);

  const loadThemes = useCallback(async () => {
    try {
      const res = await siteConfigAPI.getThemes();
      setThemes(res.data.themes);
    } catch (err) {
      console.error('Failed to load themes:', err);
    }
  }, []);

  useEffect(() => {
    loadConfig();
    loadThemes();
  }, [loadConfig, loadThemes]);

  const switchTheme = async (themeId) => {
    try {
      const res = await siteConfigAPI.activateTheme(themeId);
      setSiteConfig(res.data.config);
      setTheme(res.data.theme);
      applyThemeToDOM(res.data.theme);
    } catch (err) {
      console.error('Failed to switch theme:', err);
    }
  };

  const previewTheme = (themeData) => {
    applyThemeToDOM(themeData);
  };

  const applyActiveTheme = () => {
    if (theme) applyThemeToDOM(theme);
  };

  const updateConfig = async (data) => {
    const res = await siteConfigAPI.update(data);
    setSiteConfig(res.data.config);
    return res.data.config;
  };

  const getLogoUrl = () => {
    if (!siteConfig?.branding?.logoUrl) return null;
    const logo = siteConfig.branding.logoUrl;
    if (logo.startsWith('http')) return logo;
    return `${BACKEND_BASE}${logo}`;
  };

  return (
    <ThemeContext.Provider value={{
      siteConfig, theme, themes, loading,
      switchTheme, previewTheme, applyActiveTheme,
      updateConfig, loadConfig, loadThemes, getLogoUrl,
      applyThemeToDOM,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
