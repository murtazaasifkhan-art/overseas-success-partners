const express = require('express');
const { authenticate } = require('../middleware/auth');
const Country = require('../models/Country');
const University = require('../models/University');
const { generateRecommendations } = require('../utils/eligibility');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const profile = req.user.profile;

    if (!profile || !profile.academicBackground?.highestDegree) {
      return res.status(400).json({
        error: 'Please complete your profile to get recommendations.',
      });
    }

    const [countries, universities] = await Promise.all([
      Country.find({ isActive: true }),
      University.find({ isActive: true }),
    ]);

    const recommendations = generateRecommendations(profile, countries, universities);
    res.json({ recommendations });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

module.exports = router;
