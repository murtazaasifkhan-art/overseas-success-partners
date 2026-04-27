const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  branding: {
    appName: { type: String, default: 'Overseas Success Partners' },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
  },
  homepage: {
    heroTitle: { type: String, default: 'Your Journey to Study in Europe Starts Here' },
    heroSubtitle: { type: String, default: 'Evaluate your eligibility, explore top universities, and get personalized guidance for studying in Germany, France, Italy, Netherlands, and Romania.' },
    features: [{
      icon: String,
      title: String,
      description: String,
    }],
  },
  activeThemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', default: null },
  updatedAt: { type: Date, default: Date.now },
});

siteConfigSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
