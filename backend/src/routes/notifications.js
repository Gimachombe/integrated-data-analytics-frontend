const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/config');

// Get all notifications for user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      notifications: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;

    // Verify notification belongs to user
    const notification = await pool.query(
      'SELECT * FROM notifications WHERE id = $1 AND user_id = $2',
      [notificationId, userId]
    );

    if (notification.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Update notification
    await pool.query('UPDATE notifications SET read = true, read_at = NOW() WHERE id = $1', [
      notificationId,
    ]);

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.userId;

    await pool.query(
      'UPDATE notifications SET read = true, read_at = NOW() WHERE user_id = $1 AND read = false',
      [userId]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.userId;

    // Verify notification belongs to user
    const notification = await pool.query(
      'SELECT * FROM notifications WHERE id = $1 AND user_id = $2',
      [notificationId, userId]
    );

    if (notification.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Delete notification
    await pool.query('DELETE FROM notifications WHERE id = $1', [notificationId]);

    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear all notifications
router.delete('/clear-all', auth, async (req, res) => {
  try {
    const userId = req.userId;

    await pool.query('DELETE FROM notifications WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      message: 'All notifications cleared',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
