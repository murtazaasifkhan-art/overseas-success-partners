const express = require('express');
const { authenticate } = require('../middleware/auth');
const Country = require('../models/Country');
const { evaluateEligibility } = require('../utils/eligibility');

const router = express.Router();

router.get('/check', authenticate, async (req, res) => {
  try {
    const { country: countryCode } = req.query;
    const profile = req.user.profile;

    if (!profile || !profile.academicBackground?.highestDegree) {
      return res.status(400).json({
        error: 'Please complete your profile before checking eligibility.',
      });
    }

    if (countryCode) {
      const country = await Country.findOne({
        code: countryCode.toUpperCase(),
        isActive: true,
      });
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
      const result = evaluateEligibility(profile, country);
      return res.json({ results: [result] });
    }

    const countries = await Country.find({ isActive: true });
    const results = countries.map((c) => evaluateEligibility(profile, c));
    res.json({ results });
  } catch (err) {
    console.error('Eligibility check error:', err);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

router.post('/check-guest', async (req, res) => {
  try {
    const { profile, countryCode } = req.body;

    if (!profile?.academicBackground?.highestDegree) {
      return res.status(400).json({
        error: 'Academic background is required for eligibility check.',
      });
    }

    if (countryCode) {
      const country = await Country.findOne({
        code: countryCode.toUpperCase(),
        isActive: true,
      });
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
      const result = evaluateEligibility(profile, country);
      return res.json({ results: [result] });
    }

    const countries = await Country.find({ isActive: true });
    const results = countries.map((c) => evaluateEligibility(profile, c));
    res.json({ results });
  } catch (err) {
    console.error('Guest eligibility check error:', err);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

module.exports = router;
