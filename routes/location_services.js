// routes/location_services.js
const express = require('express');
const router = express.Router();
const db = require('../db/index'); // adjust this path if needed

// Route to get all location services data
router.get('/', async (req, res) => {
  console.log('📡 GET /api/location_services called'); // DEBUG LOG

  try {
    const [rows] = await db.query('SELECT * FROM location_services');
    console.log('✅ Data fetched from DB:', rows.length, 'records'); // DEBUG LOG

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching location_services data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
