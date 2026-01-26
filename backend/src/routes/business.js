const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const pool = require('../db/config');

// Business name search
router.get('/search-name', auth, async (req, res) => {
  const { query } = req.query;

  try {
    // Simulate business name search (in production, integrate with business registry API)
    const mockResults = [
      { name: `${query} Enterprises`, status: 'available' },
      { name: `${query} Solutions`, status: 'taken' },
      { name: `${query} Technologies`, status: 'available' },
    ];

    res.json(mockResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit business registration
router.post(
  '/register',
  auth,
  [
    body('businessName').notEmpty(),
    body('registrationType').isIn(['name_search', 'incorporation']),
    body('businessType').notEmpty(),
    body('owners').isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { businessName, registrationType, businessType, owners, documents } = req.body;

    try {
      const newRegistration = await pool.query(
        `INSERT INTO business_registrations 
       (user_id, business_name, registration_type, documents, status) 
       VALUES ($1, $2, $3, $4, 'pending') 
       RETURNING *`,
        [req.userId, businessName, registrationType, { businessType, owners, ...documents }]
      );

      // Generate tracking number
      const trackingNumber = `BR-${Date.now()}-${req.userId}`;
      await pool.query('UPDATE business_registrations SET tracking_number = $1 WHERE id = $2', [
        trackingNumber,
        newRegistration.rows[0].id,
      ]);

      res.status(201).json({
        ...newRegistration.rows[0],
        trackingNumber,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get user's business registrations
router.get('/my-registrations', auth, async (req, res) => {
  try {
    const registrations = await pool.query(
      `SELECT * FROM business_registrations 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    );

    res.json(registrations.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload registration documents
router.post('/:id/upload', auth, async (req, res) => {
  const { id } = req.params;
  // Implementation for document upload
  res.json({ message: 'Document upload endpoint for registration' });
});

module.exports = router;
