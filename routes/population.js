// routes/population.js
const express = require('express');
const router = express.Router();
const db = require('../db/index'); // make sure this path is correct!

// Route to get all population data
router.get('/', async (req, res) => {
  console.log('📡 GET /api/population called'); // DEBUG LOG

  try {
    const [rows] = await db.query('SELECT * FROM population');
    console.log('✅ Data fetched from DB:', rows); // DEBUG LOG

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching population data:', err); // LOG error
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
