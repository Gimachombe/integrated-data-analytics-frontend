const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/config');

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Admin dashboard stats
router.get('/dashboard-stats', auth, isAdmin, async (req, res) => {
  try {
    const [usersCount, activeServices, pendingPayments, revenue, newUsers, totalServices] =
      await Promise.all([
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query("SELECT COUNT(*) FROM data_services WHERE status = 'in_progress'"),
        pool.query("SELECT COUNT(*) FROM payments WHERE status = 'pending'"),
        pool.query("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed'"),
        pool.query("SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'"),
        pool.query('SELECT COUNT(*) FROM data_services'),
      ]);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      activeServices: parseInt(activeServices.rows[0].count),
      pendingPayments: parseInt(pendingPayments.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].coalesce),
      newUsers: parseInt(newUsers.rows[0].count),
      totalServices: parseInt(totalServices.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Recent activities
router.get('/recent-activities', auth, isAdmin, async (req, res) => {
  try {
    const activities = await pool.query(`
      SELECT 
        'data_service' as type,
        id,
        'Data Service: ' || service_type as title,
        status,
        created_at as date,
        'Service request for ' || service_type as description
      FROM data_services
      UNION ALL
      SELECT 
        'payment' as type,
        id,
        'Payment: KES ' || amount as title,
        status,
        created_at as date,
        'Payment for service' as description
      FROM payments
      UNION ALL
      SELECT 
        'user' as type,
        id,
        'New User: ' || email as title,
        'completed' as status,
        created_at as date,
        'User registration' as description
      FROM users
      ORDER BY date DESC
      LIMIT 10
    `);

    res.json(activities.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Revenue data
router.get('/revenue-data', auth, isAdmin, async (req, res) => {
  try {
    const revenueData = await pool.query(`
      SELECT 
        TO_CHAR(paid_at, 'Mon') as month,
        EXTRACT(MONTH FROM paid_at) as month_num,
        COALESCE(SUM(amount), 0) as revenue
      FROM payments 
      WHERE status = 'completed' 
        AND paid_at >= NOW() - INTERVAL '6 months'
      GROUP BY month, month_num
      ORDER BY month_num
    `);

    res.json(revenueData.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User growth data
router.get('/user-growth', auth, isAdmin, async (req, res) => {
  try {
    const userGrowth = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        EXTRACT(MONTH FROM created_at) as month_num,
        COUNT(*) as users
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month, month_num
      ORDER BY month_num
    `);

    res.json(userGrowth.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
