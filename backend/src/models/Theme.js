const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mode: { type: String, enum: ['light', 'dark'], default: 'light' },
  colors: {
    primary: { type: String, default: '#2563eb' },
    primaryDark: { type: String, default: '#1d4ed8' },
    primaryLight: { type: String, default: '#dbeafe' },
    secondary: { type: String, default: '#059669' },
    secondaryLight: { type: String, default: '#d1fae5' },
    accent: { type: String, default: '#7c3aed' },
    accentLight: { type: String, default: '#ede9fe' },
    danger: { type: String, default: '#dc2626' },
    dangerLight: { type: String, default: '#fee2e2' },
    warning: { type: String, default: '#d97706' },
    warningLight: { type: String, default: '#fef3c7' },
    background: { type: String, default: '#f8fafc' },
    surface: { type: String, default: '#ffffff' },
    surfaceHover: { type: String, default: '#f1f5f9' },
    textPrimary: { type: String, default: '#0f172a' },
    textSecondary: { type: String, default: '#475569' },
    textMuted: { type: String, default: '#94a3b8' },
    border: { type: String, default: '#e2e8f0' },
    borderLight: { type: String, default: '#f1f5f9' },
    heroGradientStart: { type: String, default: '#2563eb' },
    heroGradientEnd: { type: String, default: '#7c3aed' },
    navBackground: { type: String, default: '#ffffff' },
    navText: { type: String, default: '#475569' },
    footerBackground: { type: String, default: '#ffffff' },
    footerText: { type: String, default: '#94a3b8' },
  },
  typography: {
    fontFamily: { type: String, default: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    fontFamilyHeading: { type: String, default: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    baseFontSize: { type: String, default: '16px' },
    headingWeight: { type: String, default: '700' },
    bodyWeight: { type: String, default: '400' },
    lineHeight: { type: String, default: '1.6' },
    googleFont: { type: String, default: 'Inter' },
    googleFontHeading: { type: String, default: '' },
  },
  buttons: {
    borderRadius: { type: String, default: '8px' },
    padding: { type: String, default: '0.6rem 1.5rem' },
    fontWeight: { type: String, default: '600' },
    shadow: { type: String, default: '0 1px 3px rgba(0,0,0,0.1)' },
    hoverShadow: { type: String, default: '0 4px 12px rgba(0,0,0,0.15)' },
    textTransform: { type: String, default: 'none' },
  },
  cards: {
    borderRadius: { type: String, default: '12px' },
    shadow: { type: String, default: '0 1px 3px rgba(0,0,0,0.08)' },
    hoverShadow: { type: String, default: '0 8px 30px rgba(0,0,0,0.12)' },
    borderWidth: { type: String, default: '1px' },
  },
  layout: {
    maxWidth: { type: String, default: '1280px' },
    sidebarWidth: { type: String, default: '260px' },
    navHeight: { type: String, default: '68px' },
    contentPadding: { type: String, default: '2rem' },
    sectionGap: { type: String, default: '2rem' },
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

themeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Theme', themeSchema);
