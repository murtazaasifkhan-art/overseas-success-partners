const express = require('express');
const University = require('../models/University');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { country, budget, program, level, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (country) filter.country = country;
    if (budget) filter['tuitionRange.max'] = { $lte: Number(budget) };
    if (program) filter['programs.field'] = { $regex: program, $options: 'i' };
    if (level) filter['programs.level'] = level;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { 'programs.name': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [universities, total] = await Promise.all([
      University.find(filter).skip(skip).limit(Number(limit)).sort({ ranking: 1 }),
      University.countDocuments(filter),
    ]);

    res.json({
      universities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error('University fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }
    res.json({ university });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch university' });
  }
});

module.exports = router;
