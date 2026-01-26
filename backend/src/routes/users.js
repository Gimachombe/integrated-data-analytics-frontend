const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/config');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        id, email, first_name, last_name, phone, 
        company_name, kra_pin, address, role, created_at
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone || '',
      companyName: user.company_name || '',
      kraPin: user.kra_pin || '',
      address: user.address || '',
      role: user.role,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone, companyName, kraPin, address } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const result = await pool.query(
      `UPDATE users 
       SET 
         first_name = $1,
         last_name = $2,
         phone = $3,
         company_name = $4,
         kra_pin = $5,
         address = $6,
         updated_at = NOW()
       WHERE id = $7
       RETURNING id, email, first_name, last_name, phone, company_name, kra_pin, address, role`,
      [firstName, lastName, phone, companyName, kraPin, address, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        companyName: user.company_name,
        kraPin: user.kra_pin,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get notification settings
router.get('/notification-settings', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Check if user_notification_settings table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_notification_settings'
      )
    `);

    if (!tableExists.rows[0].exists) {
      // Return default settings if table doesn't exist
      return res.json({
        emailNotifications: true,
        smsNotifications: false,
        paymentAlerts: true,
        serviceUpdates: true,
        marketingEmails: false,
      });
    }

    const result = await pool.query(
      `SELECT 
        email_notifications, sms_notifications, 
        payment_alerts, service_updates, marketing_emails
       FROM user_notification_settings 
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Return default settings if no settings found
      return res.json({
        emailNotifications: true,
        smsNotifications: false,
        paymentAlerts: true,
        serviceUpdates: true,
        marketingEmails: false,
      });
    }

    const settings = result.rows[0];

    res.json({
      emailNotifications: settings.email_notifications,
      smsNotifications: settings.sms_notifications,
      paymentAlerts: settings.payment_alerts,
      serviceUpdates: settings.service_updates,
      marketingEmails: settings.marketing_emails,
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update notification settings
router.put('/notification-settings', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { emailNotifications, smsNotifications, paymentAlerts, serviceUpdates, marketingEmails } =
      req.body;

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_notification_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email_notifications BOOLEAN DEFAULT true,
        sms_notifications BOOLEAN DEFAULT false,
        payment_alerts BOOLEAN DEFAULT true,
        service_updates BOOLEAN DEFAULT true,
        marketing_emails BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert or update settings
    const result = await pool.query(
      `INSERT INTO user_notification_settings 
       (user_id, email_notifications, sms_notifications, payment_alerts, service_updates, marketing_emails)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         email_notifications = $2,
         sms_notifications = $3,
         payment_alerts = $4,
         service_updates = $5,
         marketing_emails = $6,
         updated_at = NOW()
       RETURNING *`,
      [userId, emailNotifications, smsNotifications, paymentAlerts, serviceUpdates, marketingEmails]
    );

    res.json({
      message: 'Notification settings updated successfully',
      settings: {
        emailNotifications: result.rows[0].email_notifications,
        smsNotifications: result.rows[0].sms_notifications,
        paymentAlerts: result.rows[0].payment_alerts,
        serviceUpdates: result.rows[0].service_updates,
        marketingEmails: result.rows[0].marketing_emails,
      },
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle two-factor authentication
router.post('/two-factor', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { enabled } = req.body;

    // This is a simplified implementation
    // In a real app, you would integrate with a 2FA service
    // and store the 2FA secret in the database

    res.json({
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`,
      enabled,
    });
  } catch (error) {
    console.error('2FA toggle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
