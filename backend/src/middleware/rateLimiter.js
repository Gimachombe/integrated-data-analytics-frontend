const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Payment endpoint limiter
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Too many payment attempts, please try again later.',
});

module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter,
};
