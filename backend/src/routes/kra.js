const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const pool = require('../db/config');

// Request KRA PIN registration
router.post(
  '/pin-registration',
  auth,
  [
    body('idNumber').notEmpty(),
    body('fullName').notEmpty(),
    body('dob').isISO8601(),
    body('address').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { idNumber, fullName, dob, address, documents } = req.body;

    try {
      const newService = await pool.query(
        `INSERT INTO kra_services 
       (user_id, service_type, documents, status) 
       VALUES ($1, 'pin_registration', $2, 'pending') 
       RETURNING *`,
        [req.userId, { idNumber, fullName, dob, address, ...documents }]
      );

      res.status(201).json(newService.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// File tax returns
router.post(
  '/tax-filing',
  auth,
  [
    body('taxType').isIn(['income', 'vat', 'paye', 'withholding']),
    body('period').notEmpty(),
    body('amount').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taxType, period, amount, documents } = req.body;

    try {
      const newFiling = await pool.query(
        `INSERT INTO kra_services 
       (user_id, service_type, tax_type, period, documents, status) 
       VALUES ($1, 'tax_filing', $2, $3, $4, 'pending') 
       RETURNING *`,
        [req.userId, taxType, period, { amount, ...documents }]
      );

      res.status(201).json(newFiling.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get KRA compliance certificate
router.get('/compliance-certificate', auth, async (req, res) => {
  try {
    // Mock response - integrate with KRA API in production
    const mockCertificate = {
      pin: 'A123456789B',
      name: 'Test Business Ltd',
      status: 'Compliant',
      lastFiling: '2024-01-15',
      expiryDate: '2024-12-31',
      certificateUrl: 'https://example.com/certificate.pdf',
    };

    res.json(mockCertificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's KRA services
router.get('/my-services', auth, async (req, res) => {
  try {
    const services = await pool.query(
      `SELECT * FROM kra_services 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    );

    res.json(services.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
