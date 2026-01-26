const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const pool = require('../db/config');

// Request bookkeeping service
router.post(
  '/request',
  auth,
  [
    body('serviceType').isIn(['bookkeeping', 'audit_prep']),
    body('financialPeriod').notEmpty(),
    body('businessSize').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceType, financialPeriod, businessSize, requirements, documents } = req.body;

    try {
      const newService = await pool.query(
        `INSERT INTO bookkeeping_services 
       (user_id, service_type, financial_period, documents, status) 
       VALUES ($1, $2, $3, $4, 'pending') 
       RETURNING *`,
        [req.userId, serviceType, financialPeriod, { businessSize, requirements, ...documents }]
      );

      res.status(201).json(newService.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Upload financial documents
router.post('/upload-financials', auth, async (req, res) => {
  const { serviceId, documents } = req.body;

  try {
    // Update service with uploaded documents
    await pool.query(
      `UPDATE bookkeeping_services 
       SET documents = documents || $1 
       WHERE id = $2 AND user_id = $3`,
      [documents, serviceId, req.userId]
    );

    res.json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get financial reports
router.get('/reports/:serviceId', auth, async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await pool.query(
      `SELECT * FROM bookkeeping_services 
       WHERE id = $1 AND user_id = $2`,
      [serviceId, req.userId]
    );

    if (service.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Mock reports - generate actual reports in production
    const mockReports = {
      trialBalance: { url: 'https://example.com/trial-balance.pdf' },
      profitLoss: { url: 'https://example.com/pnl.pdf' },
      balanceSheet: { url: 'https://example.com/balance-sheet.pdf' },
      cashFlow: { url: 'https://example.com/cash-flow.pdf' },
    };

    res.json(mockReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's bookkeeping services
router.get('/my-services', auth, async (req, res) => {
  try {
    const services = await pool.query(
      `SELECT * FROM bookkeeping_services 
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
