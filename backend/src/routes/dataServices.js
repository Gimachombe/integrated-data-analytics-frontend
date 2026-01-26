const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const pool = require('../db/config');

// Create data service request
router.post(
  '/request',
  auth,
  [
    body('serviceType').isIn(['mining', 'cleaning', 'collection', 'analysis']),
    body('requirements').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceType, dataSource, requirements } = req.body;

    try {
      const newRequest = await pool.query(
        `INSERT INTO data_services 
       (user_id, service_type, data_source, requirements, status) 
       VALUES ($1, $2, $3, $4, 'pending') 
       RETURNING *`,
        [req.userId, serviceType, dataSource, requirements]
      );

      // Create notification
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message) 
       VALUES ($1, 'service_request', 'New Data Service Request', 
       'Your ${serviceType} request has been submitted successfully')`,
        [req.userId]
      );

      res.status(201).json(newRequest.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get user's data service requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await pool.query(
      `SELECT * FROM data_services 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    );

    res.json(requests.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload documents for data service
router.post('/:id/upload', auth, async (req, res) => {
  // Implementation for document upload
  res.json({ message: 'Document upload endpoint' });
});

// Download report
router.get('/:id/report', auth, async (req, res) => {
  try {
    const service = await pool.query(
      `SELECT report_url FROM data_services 
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.userId]
    );

    if (service.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Return report URL or stream file
    res.json({ reportUrl: service.rows[0].report_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get all data service requests
router.get('/admin/requests', auth, async (req, res) => {
  if (req.userRole !== 'admin' && req.userRole !== 'staff') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const requests = await pool.query(
      `SELECT ds.*, u.first_name, u.last_name, u.email 
       FROM data_services ds
       JOIN users u ON ds.user_id = u.id
       ORDER BY ds.created_at DESC`
    );

    res.json(requests.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
