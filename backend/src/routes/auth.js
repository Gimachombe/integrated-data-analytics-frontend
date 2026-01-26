const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const pool = require('../db/config');

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, companyName, kraPin } = req.body;

    try {
      // Check if user exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const newUser = await pool.query(
        `INSERT INTO users 
         (email, password_hash, first_name, last_name, phone, company_name, kra_pin, role) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING id, email, first_name, last_name, role, company_name`,
        [email, passwordHash, firstName, lastName, phone, companyName, kraPin, 'client']
      );

      // Create JWT token
      const token = jwt.sign(
        { userId: newUser.rows[0].id, role: newUser.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: newUser.rows[0].id,
          email: newUser.rows[0].email,
          firstName: newUser.rows[0].first_name,
          lastName: newUser.rows[0].last_name,
          role: newUser.rows[0].role,
          companyName: newUser.rows[0].company_name,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
);

// Login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (user.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.rows[0].id, role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.rows[0].id,
          email: user.rows[0].email,
          firstName: user.rows[0].first_name,
          lastName: user.rows[0].last_name,
          role: user.rows[0].role,
          companyName: user.rows[0].company_name,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// Forgot Password - Request reset link
router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    // Find user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      // Don't reveal that user doesn't exist for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, a reset link will be sent.',
      });
    }

    const userId = user.rows[0].id;

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Check if password_reset_tokens table exists, create if not
    try {
      await pool.query(`
          CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token_hash VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id)
          )
        `);
    } catch (tableError) {
      console.log('Password reset tokens table already exists or error:', tableError);
    }

    // Save token to database
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) 
         DO UPDATE SET token_hash = $2, expires_at = $3, created_at = NOW()`,
      [userId, tokenHash, tokenExpiry]
    );

    // In development: log the reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    console.log('=== PASSWORD RESET LINK (DEVELOPMENT MODE) ===');
    console.log('Reset Link:', resetLink);
    console.log('For User:', user.rows[0].email);
    console.log('Token (save this):', resetToken);
    console.log('Expires at:', tokenExpiry);
    console.log('=============================================');

    // In production, you would send an email here
    // Example email sending code:
    // const emailSent = await sendPasswordResetEmail(user.rows[0].email, resetLink);
    // if (!emailSent) {
    //   return res.status(500).json({ error: 'Failed to send reset email' });
    // }

    res.json({
      success: true,
      message: 'Password reset link has been sent to your email.',
      // Only include resetLink in development for testing
      ...(process.env.NODE_ENV === 'development' && { resetLink }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while processing password reset request',
    });
  }
});

// Validate reset token
router.post('/validate-reset-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Reset token is required',
      });
    }

    // Hash the token to compare with database
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const tokenData = await pool.query(
      `SELECT prt.*, u.email 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token_hash = $1 AND prt.expires_at > NOW()`,
      [tokenHash]
    );

    if (tokenData.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    res.json({
      success: true,
      valid: true,
      email: tokenData.rows[0].email,
    });
  } catch (error) {
    console.error('Validate token error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while validating reset token',
    });
  }
});

// Reset Password with token
router.post(
  '/reset-password',
  [body('token').notEmpty(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { token, password } = req.body;

      // Hash the token to compare with database
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      // Find valid token with user information
      const tokenData = await pool.query(
        `SELECT prt.*, u.id as user_id, u.email
         FROM password_reset_tokens prt
         JOIN users u ON prt.user_id = u.id
         WHERE prt.token_hash = $1 AND prt.expires_at > NOW()`,
        [tokenHash]
      );

      if (tokenData.rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token',
        });
      }

      const userId = tokenData.rows[0].user_id;
      const userEmail = tokenData.rows[0].email;

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Update user password
      await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
        passwordHash,
        userId,
      ]);

      // Delete used token
      await pool.query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash]);

      // Log password reset for security auditing
      console.log(`Password reset successful for user: ${userEmail} (ID: ${userId})`);

      res.json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.',
        email: userEmail,
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while resetting password',
      });
    }
  }
);

// Change Password (when user is logged in)
router.post(
  '/change-password',
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;

      // Get user ID from JWT token (requires auth middleware)
      // This assumes you have auth middleware that adds userId to req
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      // Get current password hash
      const user = await pool.query('SELECT id, email, password_hash FROM users WHERE id = $1', [
        userId,
      ]);

      if (user.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect',
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Update password
      await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
        newPasswordHash,
        userId,
      ]);

      console.log(`Password changed for user ID: ${userId}`);

      res.json({
        success: true,
        message: 'Password changed successfully.',
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while changing password',
      });
    }
  }
);

// Verify token (for protected routes)
router.post('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists
    const user = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists',
      });
    }

    res.json({
      success: true,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        role: user.rows[0].role,
      },
      valid: true,
    });
  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        expired: true,
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during token verification',
    });
  }
});

module.exports = router;
