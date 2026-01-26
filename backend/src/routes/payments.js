const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db/config');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Get all payments for user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;

    console.log('Fetching payments for user:', userId);

    // Check if payments table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payments'
      )
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Payments table does not exist');
      return res.json({
        success: true,
        payments: [],
        message: 'Payments table not found, using mock data',
        mock: true,
      });
    }

    // Query with your schema's column names
    const result = await pool.query(
      `SELECT 
        p.id,
        p.amount,
        p.currency,
        p.description,
        p.service_type,
        p.payment_method,
        p.status,
        p.transaction_id as reference,
        p.mpesa_number,
        p.mpesa_receipt,
        p.card_last4,
        p.card_brand,
        p.bank_name,
        p.bank_reference,
        p.invoice_number,
        p.invoice_url,
        p.tax_amount,
        p.tax_rate,
        p.paid_at,
        p.created_at,
        p.updated_at,
        -- Map service_type to readable names
        CASE 
          WHEN p.service_type = 'data_service' THEN 'Data Services'
          WHEN p.service_type = 'business_registration' THEN 'Business Registration'
          WHEN p.service_type = 'kra_service' THEN 'KRA Services'
          WHEN p.service_type = 'bookkeeping' THEN 'Bookkeeping'
          WHEN p.service_type = 'subscription' THEN 'Subscription'
          ELSE p.service_type
        END as service_name,
        -- Map payment_method to readable names
        CASE 
          WHEN p.payment_method = 'mpesa' THEN 'M-Pesa'
          WHEN p.payment_method = 'card' THEN 'Card'
          WHEN p.payment_method = 'bank_transfer' THEN 'Bank Transfer'
          WHEN p.payment_method = 'cash' THEN 'Cash'
          WHEN p.payment_method = 'cheque' THEN 'Cheque'
          ELSE p.payment_method
        END as method_name,
        -- Calculate totals (amount already includes tax and fees)
        p.amount as total_amount
       FROM payments p
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    console.log(`Found ${result.rows.length} payments for user ${userId}`);

    // Transform data to match frontend expectations
 const transformedPayments = result.rows.map(payment => ({
  id: payment.id,
  amount: parseFloat(payment.amount),
  service: payment.service_name || payment.service_type,
  service_type: payment.service_type,
  method: payment.method_name || payment.payment_method,
  payment_method: payment.payment_method,
  status: payment.status === 'successful' ? 'completed' : payment.status,
  date: payment.paid_at
    ? new Date(payment.paid_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : payment.created_at
      ? new Date(payment.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
  // ADD THESE NEW FIELDS FOR TIMESTAMP
  // date_full: payment.paid_at || payment.created_at || new Date().toISOString(),
  timestamp: payment.paid_at 
    ? new Date(payment.paid_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    : payment.created_at
      ? new Date(payment.created_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      : new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
 
  // Include additional details
  mpesa_number: payment.mpesa_number,
  mpesa_receipt: payment.mpesa_receipt,
  card_last4: payment.card_last4,
  invoice_number: payment.invoice_number,
  // For detailed view
  full_payment: payment 
}));

    res.json({
      success: true,
      payments: transformedPayments,
      count: transformedPayments.length,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payments',
      message: error.message,
      mock: true,
    });
  }
});

// Get single payment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const paymentId = req.params.id;
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        p.*,
        -- Map service_type to readable names
        CASE 
          WHEN p.service_type = 'data_service' THEN 'Data Services'
          WHEN p.service_type = 'business_registration' THEN 'Business Registration'
          WHEN p.service_type = 'kra_service' THEN 'KRA Services'
          WHEN p.service_type = 'bookkeeping' THEN 'Bookkeeping'
          WHEN p.service_type = 'subscription' THEN 'Subscription'
          ELSE p.service_type
        END as service_name,
        -- Map payment_method to readable names
        CASE 
          WHEN p.payment_method = 'mpesa' THEN 'M-Pesa'
          WHEN p.payment_method = 'card' THEN 'Card'
          WHEN p.payment_method = 'bank_transfer' THEN 'Bank Transfer'
          WHEN p.payment_method = 'cash' THEN 'Cash'
          WHEN p.payment_method = 'cheque' THEN 'Cheque'
          ELSE p.payment_method
        END as method_name
       FROM payments p
       WHERE id = $1 AND user_id = $2`,
      [paymentId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    const payment = result.rows[0];

    // Format response
    const formattedPayment = {
      id: payment.id,
      amount: parseFloat(payment.amount),
      service: payment.service_name || payment.service_type,
      service_type: payment.service_type,
      method: payment.method_name || payment.payment_method,
      payment_method: payment.payment_method,
      status: payment.status === 'successful' ? 'completed' : payment.status,
      date: payment.paid_at
        ? new Date(payment.paid_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : payment.created_at
          ? new Date(payment.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
      reference: payment.transaction_id || payment.invoice_number || `TX-${payment.id}`,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      user_id: userId,
      description: payment.description,
      tax_amount: 0,
      total_amount: parseFloat(payment.amount),
      processing_fee: 0,
      mpesa_number: payment.mpesa_number,
      mpesa_receipt: payment.mpesa_receipt,
      card_last4: payment.card_last4,
      invoice_number: payment.invoice_number,
      // Full details
      full_details: {
        transaction_id: payment.transaction_id,
        invoice_url: payment.invoice_url,
        bank_name: payment.bank_name,
        bank_reference: payment.bank_reference,
        metadata: payment.metadata,
        currency: payment.currency,
      },
    };

    res.json({
      success: true,
      payment: formattedPayment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payment',
    });
  }
});

// Create new payment - CORRECTED VERSION (No VAT or processing fees)
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { service_type, amount, payment_method, description,  phone_number } = req.body;

    console.log('Creating payment request:', req.body);

    // Validate required fields
    if (!service_type || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        error: 'Service type, amount, and payment method are required',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0',
      });
    }

    // Normalize and map service type
    const normalizedServiceType = service_type.toLowerCase().trim();
    let finalServiceType = normalizedServiceType;

    // Map common variations to correct values
    const serviceTypeMap = {
      dataservices: 'data_service',
      'data services': 'data_service',
      dataservice: 'data_service',
      businessregistration: 'business_registration',
      'business registration': 'business_registration',
      businesregistration: 'business_registration',
      kraservices: 'kra_service',
      'kra services': 'kra_service',
      kraservice: 'kra_service',
      'book keeping': 'bookkeeping',
      'book-keeping': 'bookkeeping',
      bookkeeping: 'bookkeeping',
      subscription: 'subscription',
      other: 'other',
    };

    if (serviceTypeMap[normalizedServiceType]) {
      finalServiceType = serviceTypeMap[normalizedServiceType];
    }

    // Normalize and map payment method
    const normalizedPaymentMethod = payment_method.toLowerCase().trim();
    let finalPaymentMethod = normalizedPaymentMethod;

    const paymentMethodMap = {
      bank: 'bank_transfer',
      banktransfer: 'bank_transfer',
      'bank transfer': 'bank_transfer',
      'bank-transfer': 'bank_transfer',
      mpesa: 'mpesa',
      'm-pesa': 'mpesa',
      card: 'card',
      creditcard: 'card',
      'credit card': 'card',
      cash: 'cash',
      cheque: 'cheque',
      check: 'cheque',
    };

    if (paymentMethodMap[normalizedPaymentMethod]) {
      finalPaymentMethod = paymentMethodMap[normalizedPaymentMethod];
    }

    console.log('Normalized values:', {
      originalServiceType: service_type,
      finalServiceType,
      originalPaymentMethod: payment_method,
      finalPaymentMethod,
    });

    // Validate against allowed values
    const allowedServiceTypes = [
      'data_service',
      'business_registration',
      'kra_service',
      'bookkeeping',
      'subscription',
      'other',
    ];

    if (!allowedServiceTypes.includes(finalServiceType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid service type. Must be one of: ${allowedServiceTypes.join(', ')}`,
        received: service_type,
        normalized: finalServiceType,
      });
    }

    const allowedPaymentMethods = ['mpesa', 'card', 'bank_transfer', 'cash', 'cheque'];

    if (!allowedPaymentMethods.includes(finalPaymentMethod)) {
      return res.status(400).json({
        success: false,
        error: `Invalid payment method. Must be one of: ${allowedPaymentMethods.join(', ')}`,
        received: payment_method,
        normalized: finalPaymentMethod,
      });
    }

    // Generate unique IDs
    const paymentId = uuidv4();
    const transactionId = `TX-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const invoiceNumber = `INV-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // NO VAT or processing fees - amount is the total amount
    const taxAmount = 0;
    const taxRate = 0;

    // Prepare metadata
    const metadata = {};
    if (finalPaymentMethod === 'mpesa' && phone_number) {
      metadata.phoneNumber = phone_number;
    }

    // Insert payment
    const insertParams = [
      paymentId,
      userId,
      parseFloat(amount), // This is the total amount (no additional fees)
      finalServiceType,
      finalPaymentMethod,
      transactionId,
      'pending',
      description || `Payment for ${finalServiceType.replace(/_/g, ' ')}`,
      taxAmount,
      taxRate,
      invoiceNumber,
      JSON.stringify(metadata),
    ];

    // Add mpesa_number if applicable
    let mpesaNumberParam = '';
    if (finalPaymentMethod === 'mpesa' && phone_number) {
      insertParams.push(phone_number);
      mpesaNumberParam = ', mpesa_number';
    }

    const insertQuery = `
      INSERT INTO payments 
      (id, user_id, amount, service_type, payment_method, 
       transaction_id, status, description, tax_amount, tax_rate,
       invoice_number, metadata, created_at, updated_at, currency
       ${mpesaNumberParam})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW(), 'KES'
        ${mpesaNumberParam ? ', $13' : ''})
      RETURNING *
    `;

    console.log('Executing insert query with params:', insertParams);

    const result = await pool.query(insertQuery, insertParams);
    const payment = result.rows[0];

    console.log('Payment created successfully:', {
      id: payment.id,
      amount: payment.amount,
      reference: payment.transaction_id,
      service_type: payment.service_type,
      payment_method: payment.payment_method,
      status: payment.status,
    });

    // Send immediate response
    const responseData = {
      success: true,
      message: 'Payment initiated successfully',
      payment: {
        id: payment.id,
        reference: payment.transaction_id,
        invoice_number: payment.invoice_number,
        amount: parseFloat(payment.amount),
        status: payment.status,
        service_type: payment.service_type,
        payment_method: payment.payment_method,
        total_amount: parseFloat(payment.amount), // Same as amount (no extra fees)
      },
    };

    res.json(responseData);

    // Auto-update M-Pesa payments to successful after delay
    if (finalPaymentMethod === 'mpesa') {
      setTimeout(async () => {
        try {
          console.log(`Auto-updating M-Pesa payment ${payment.id} to successful`);

          const mpesaReceipt = `MP${Date.now().toString().slice(-8)}`;

          await pool.query(
            `UPDATE payments 
             SET status = 'successful', 
                 updated_at = NOW(),
                 paid_at = NOW(),
                 mpesa_receipt = $1
             WHERE id = $2`,
            [mpesaReceipt, payment.id]
          );

          console.log(`Payment ${payment.id} updated to successful with receipt ${mpesaReceipt}`);
        } catch (updateError) {
          console.error(`Failed to auto-update payment ${payment.id}:`, updateError.message);
        }
      }, 3000);
    }
  } catch (error) {
    console.error('Create payment error:', error);

    // Detailed error response
    let errorResponse = {
      success: false,
      error: 'Server error while creating payment',
      details: error.message,
    };

    // Add constraint error details
    if (error.code === '23514') {
      errorResponse = {
        ...errorResponse,
        error: 'Data validation failed',
        hint: 'Check service_type and payment_method values',
        constraint: error.constraint,
        detail: error.detail,
      };
    }

    res.status(500).json(errorResponse);
  }
});

// Update payment status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const paymentId = req.params.id;
    const userId = req.userId;
    const { status, transaction_reference } = req.body;

    console.log('Updating payment status:', {
      paymentId,
      userId,
      status,
      transaction_reference,
    });

    // Validate status
    const allowedStatuses = [
      'pending',
      'processing',
      'successful',
      'failed',
      'cancelled',
      'refunded',
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    // Validate payment belongs to user
    const paymentCheck = await pool.query(
      'SELECT id FROM payments WHERE id = $1 AND user_id = $2',
      [paymentId, userId]
    );

    if (paymentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    // Build update query
    const updateFields = ['status = $1', 'updated_at = NOW()'];
    const queryParams = [status];

    if (transaction_reference) {
      updateFields.push('transaction_id = $2');
      queryParams.push(transaction_reference);
    }

    if (status === 'successful') {
      updateFields.push('paid_at = NOW()');
    } else if (status === 'failed') {
      updateFields.push('failed_at = NOW()');
    } else if (status === 'refunded') {
      updateFields.push('refunded_at = NOW()');
    }

    // Add payment ID as last parameter
    const paymentIdIndex = queryParams.length + 1;
    queryParams.push(paymentId);

    const query = `
      UPDATE payments 
      SET ${updateFields.join(', ')}
      WHERE id = $${paymentIdIndex}
      RETURNING *
    `;

    console.log('Executing update query:', query);
    console.log('With parameters:', queryParams);

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      payment: result.rows[0],
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating payment status',
      details: error.message,
    });
  }
});

// Get payment statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payments'
      )
    `);

    if (!tableExists.rows[0].exists) {
      return res.json({
        success: true,
        stats: {
          total_payments: 0,
          completed_payments: 0,
          pending_payments: 0,
          total_amount: 0,
        },
        mock: true,
      });
    }

    const [totalResult, completedResult, pendingResult, amountResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM payments WHERE user_id = $1', [userId]),
      pool.query("SELECT COUNT(*) FROM payments WHERE user_id = $1 AND status = 'successful'", [
        userId,
      ]),
      pool.query("SELECT COUNT(*) FROM payments WHERE user_id = $1 AND status = 'pending'", [
        userId,
      ]),
      pool.query(
        "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE user_id = $1 AND status = 'successful'",
        [userId]
      ),
    ]);

    res.json({
      success: true,
      stats: {
        total_payments: parseInt(totalResult.rows[0].count),
        completed_payments: parseInt(completedResult.rows[0].count),
        pending_payments: parseInt(pendingResult.rows[0].count),
        total_amount: parseFloat(amountResult.rows[0].coalesce),
      },
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payment statistics',
    });
  }
});

// Insert sample payments for testing
router.post('/seed-sample', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const samplePayments = req.body.payments || [
      {
        service_type: 'data_service',
        amount: 15000,
        payment_method: 'mpesa',
        description: 'Data analysis service payment',
      },
      {
        service_type: 'business_registration',
        amount: 8000,
        payment_method: 'card',
        description: 'Company registration fee',
      },
      {
        service_type: 'kra_service',
        amount: 3000,
        payment_method: 'bank_transfer',
        description: 'KRA PIN registration service',
      },
      {
        service_type: 'bookkeeping',
        amount: 4000,
        payment_method: 'mpesa',
        description: 'Monthly bookkeeping service',
      },
    ];

    const insertedPayments = [];

    for (const sample of samplePayments) {
      const paymentId = uuidv4();
      const transactionId = `TX-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const invoiceNumber = `INV-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      const taxAmount = 0; // No VAT

      const result = await pool.query(
        `INSERT INTO payments 
         (id, user_id, amount, service_type, payment_method, 
          transaction_id, status, description, tax_amount, tax_rate,
          invoice_number, metadata, paid_at, created_at, updated_at, currency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), 
                 NOW(), NOW(), 'KES')
         RETURNING *`,
        [
          paymentId,
          userId,
          sample.amount,
          sample.service_type,
          sample.payment_method,
          transactionId,
          'successful',
          sample.description,
          taxAmount,
          0,
          invoiceNumber,
          JSON.stringify({ source: 'sample_data' }),
        ]
      );

      insertedPayments.push(result.rows[0]);
    }

    res.json({
      success: true,
      message: 'Sample payments inserted successfully',
      count: insertedPayments.length,
      payments: insertedPayments,
    });
  } catch (error) {
    console.error('Seed sample payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to insert sample payments',
      details: error.message,
    });
  }
});

module.exports = router;
