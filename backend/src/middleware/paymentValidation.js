const { body, validationResult } = require('express-validator');

const validateMpesaPayment = [
  body('phoneNumber')
    .matches(/^(?:254|\+254|0)?(7\d{8})$/)
    .withMessage('Invalid Kenyan phone number format'),
  body('amount')
    .isFloat({ min: 1, max: 150000 })
    .withMessage('Amount must be between KES 1 and 150,000'),
  body('serviceId').optional().isInt(),
  body('serviceType').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateCardPayment = [
  body('amount').isFloat({ min: 0.5 }).withMessage('Amount must be at least KES 0.50'),
  body('currency').optional().isIn(['kes', 'usd', 'eur']),
  body('customerEmail').isEmail().withMessage('Valid email is required for card payments'),
  body('customerName').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateBankTransfer = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least KES 1'),
  body('bankName').optional().isString(),
  body('accountNumber').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateMpesaPayment,
  validateCardPayment,
  validateBankTransfer,
};
