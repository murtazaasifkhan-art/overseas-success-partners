const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const SiteConfig = require('../models/SiteConfig');
const Theme = require('../models/Theme');

const router = express.Router();

// Public: get active site config + theme
router.get('/', async (req, res) => {
  try {
    let config = await SiteConfig.findOne({ key: 'main' });
    if (!config) {
      config = await SiteConfig.create({ key: 'main' });
    }
    let theme = null;
    if (config.activeThemeId) {
      theme = await Theme.findById(config.activeThemeId);
    }
    if (!theme) {
      theme = await Theme.findOne({ isDefault: true });
    }
    res.json({ config, theme });
  } catch (err) {
    console.error('SiteConfig fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch site config' });
  }
});

// Admin: update site config
router.put('/', authenticate, requireAdmin, async (req, res) => {
  try {
    let config = await SiteConfig.findOne({ key: 'main' });
    if (!config) {
      config = new SiteConfig({ key: 'main' });
    }
    const { branding, homepage, activeThemeId } = req.body;
    if (branding) config.branding = { ...config.branding.toObject?.() || config.branding, ...branding };
    if (homepage) config.homepage = { ...config.homepage.toObject?.() || config.homepage, ...homepage };
    if (activeThemeId !== undefined) config.activeThemeId = activeThemeId;
    await config.save();
    res.json({ config });
  } catch (err) {
    console.error('SiteConfig update error:', err);
    res.status(500).json({ error: 'Failed to update site config' });
  }
});

// --- Themes ---
router.get('/themes', async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    res.json({ themes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch themes' });
  }
});

router.get('/themes/:id', async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) return res.status(404).json({ error: 'Theme not found' });
    res.json({ theme });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
});

router.post('/themes', authenticate, requireAdmin, async (req, res) => {
  try {
    const theme = new Theme(req.body);
    await theme.save();
    res.status(201).json({ theme });
  } catch (err) {
    console.error('Theme create error:', err);
    res.status(500).json({ error: 'Failed to create theme' });
  }
});

router.put('/themes/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const theme = await Theme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!theme) return res.status(404).json({ error: 'Theme not found' });
    res.json({ theme });
  } catch (err) {
    console.error('Theme update error:', err);
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

router.delete('/themes/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) return res.status(404).json({ error: 'Theme not found' });
    if (theme.isDefault) return res.status(400).json({ error: 'Cannot delete default theme' });
    await Theme.findByIdAndDelete(req.params.id);
    // If this was the active theme, clear it
    await SiteConfig.updateMany({ activeThemeId: req.params.id }, { $set: { activeThemeId: null } });
    res.json({ message: 'Theme deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete theme' });
  }
});

router.post('/themes/:id/activate', authenticate, requireAdmin, async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) return res.status(404).json({ error: 'Theme not found' });
    let config = await SiteConfig.findOne({ key: 'main' });
    if (!config) config = new SiteConfig({ key: 'main' });
    config.activeThemeId = theme._id;
    await config.save();
    res.json({ config, theme });
  } catch (err) {
    res.status(500).json({ error: 'Failed to activate theme' });
  }
});

module.exports = router;
