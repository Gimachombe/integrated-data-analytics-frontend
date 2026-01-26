const crypto = require('crypto');

/**
 * Generate a unique reference number
 */
const generateReference = (prefix = 'REF') => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Sanitize user input
 */
const sanitizeInput = input => {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .trim()
      .substring(0, 5000); // Limit length
  }
  return input;
};

/**
 * Validate email
 */
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Kenyan phone number
 */
const isValidKenyanPhone = phone => {
  const phoneRegex = /^(?:254|\+254|0)?(7\d{8})$/;
  return phoneRegex.test(phone);
};

/**
 * Generate random password
 */
const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

/**
 * Calculate tax (16% VAT)
 */
const calculateTax = amount => {
  return amount * 0.16;
};

/**
 * Format date for display
 */
const formatDate = (date, format = 'short') => {
  const d = new Date(date);

  if (format === 'short') {
    return d.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toISOString();
};

/**
 * Debounce function
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

module.exports = {
  generateReference,
  formatCurrency,
  sanitizeInput,
  isValidEmail,
  isValidKenyanPhone,
  generatePassword,
  calculateTax,
  formatDate,
  debounce,
};
