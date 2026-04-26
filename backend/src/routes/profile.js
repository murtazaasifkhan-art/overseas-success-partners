const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ profile: user.profile, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    const allowedFields = [
      'age', 'nationality', 'academicBackground', 'englishProficiency',
      'budgetRange', 'preferredCountries', 'preferredDegreeLevel',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[`profile.${field}`] = req.body[field];
      }
    }

    if (req.body.name) {
      updates.name = req.body.name;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ profile: user.profile, name: user.name });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
