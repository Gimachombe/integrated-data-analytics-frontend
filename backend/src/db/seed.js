const pool = require('./config');

async function seedSampleData() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get admin user ID
    const adminResult = await client.query(
      "SELECT id FROM users WHERE email = 'admin@databizpro.com'"
    );
    const adminId = adminResult.rows[0]?.id;

    if (!adminId) {
      throw new Error('Admin user not found');
    }

    // Insert sample data services
    await client.query(
      `
      INSERT INTO data_services (user_id, service_type, data_source, requirements, status, report_url)
      VALUES 
      ($1, 'analysis', 'web', 'Customer behavior analysis for Q4 2024', 'completed', 'https://example.com/report1.pdf'),
      ($1, 'cleaning', 'database', 'Clean customer database for marketing campaign', 'in_progress', null),
      ($1, 'mining', 'api', 'Extract social media data for brand monitoring', 'pending', null)
    `,
      [adminId]
    );

    // Insert sample business registrations
    await client.query(
      `
      INSERT INTO business_registrations (user_id, business_name, registration_type, status, tracking_number)
      VALUES 
      ($1, 'Tech Innovations Ltd', 'incorporation', 'completed', 'BR-20240001'),
      ($1, 'Green Solutions', 'name_search', 'pending', 'BR-20240002')
    `,
      [adminId]
    );

    // Insert sample payments
    await client.query(
      `
      INSERT INTO payments (user_id, service_id, service_type, amount, payment_method, transaction_id, status, paid_at)
      VALUES 
      ($1, 1, 'data_service', 15000.00, 'mpesa', 'MP-20240001', 'completed', NOW() - INTERVAL '2 days'),
      ($1, 2, 'business_reg', 5000.00, 'card', 'ST-20240001', 'completed', NOW() - INTERVAL '1 day'),
      ($1, 3, 'kra_service', 3000.00, 'bank_transfer', 'BT-20240001', 'pending', null)
    `,
      [adminId]
    );

    // Insert sample notifications
    await client.query(
      `
      INSERT INTO notifications (user_id, type, title, message)
      VALUES 
      ($1, 'payment_success', 'Payment Successful', 'Your payment of KES 15,000 has been received.'),
      ($1, 'service_update', 'Service In Progress', 'Your data cleaning request is being processed.'),
      ($1, 'system_alert', 'Welcome to DataBizPro', 'Thank you for joining our platform!')
    `,
      [adminId]
    );

    await client.query('COMMIT');
    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = seedSampleData;
