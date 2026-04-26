const express = require('express');
const Country = require('../models/Country');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true });
    res.json({ countries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const country = await Country.findOne({
      code: req.params.code.toUpperCase(),
      isActive: true,
    });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json({ country });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch country' });
  }
});

router.get('/:code/guide', async (req, res) => {
  try {
    const country = await Country.findOne({
      code: req.params.code.toUpperCase(),
      isActive: true,
    });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json({
      country: country.name,
      code: country.code,
      studyGuide: country.studyGuide,
      eligibilityCriteria: country.eligibilityCriteria,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study guide' });
  }
});

module.exports = router;
