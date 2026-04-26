const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const Country = require('../models/Country');
const University = require('../models/University');
const User = require('../models/User');

const router = express.Router();

router.use(authenticate, requireAdmin);

// --- Stats ---
router.get('/stats', async (req, res) => {
  try {
    const [users, countries, universities] = await Promise.all([
      User.countDocuments(),
      Country.countDocuments(),
      University.countDocuments(),
    ]);
    res.json({ stats: { users, countries, universities } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// --- Countries ---
router.get('/countries', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json({ countries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

router.post('/countries', async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json({ country });
  } catch (err) {
    console.error('Create country error:', err);
    res.status(500).json({ error: 'Failed to create country' });
  }
});

router.put('/countries/:id', async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json({ country });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update country' });
  }
});

router.delete('/countries/:id', async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.json({ message: 'Country deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete country' });
  }
});

// --- Universities ---
router.get('/universities', async (req, res) => {
  try {
    const universities = await University.find();
    res.json({ universities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

router.post('/universities', async (req, res) => {
  try {
    const university = new University(req.body);
    await university.save();
    res.status(201).json({ university });
  } catch (err) {
    console.error('Create university error:', err);
    res.status(500).json({ error: 'Failed to create university' });
  }
});

router.put('/universities/:id', async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!university) return res.status(404).json({ error: 'University not found' });
    res.json({ university });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update university' });
  }
});

router.delete('/universities/:id', async (req, res) => {
  try {
    await University.findByIdAndDelete(req.params.id);
    res.json({ message: 'University deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete university' });
  }
});

// --- Users ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
