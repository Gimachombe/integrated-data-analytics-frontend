const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');
    await client.query(schemaSQL);

    // Create migration tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert seed data
    await seedDatabase(client);

    await client.query('COMMIT');
    console.log('✅ Database migrated successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function seedDatabase(client) {
  // Insert admin user (password: Admin123!)
  const adminPasswordHash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq5g3q7p.6M1wqkL9JQ8Fq1t2B3n4C'; // Hashed password
  await client.query(
    `
    INSERT INTO users (email, password_hash, first_name, last_name, role, phone, company_name, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (email) DO NOTHING
  `,
    [
      'admin@databizpro.com',
      adminPasswordHash,
      'System',
      'Administrator',
      'admin',
      '+254700000000',
      'DataBizPro Ltd',
      true,
    ]
  );

  // Insert sample staff
  const staffPasswordHash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq5g3q7p.6M1wqkL9JQ8Fq1t2B3n4C'; // Same hash for demo
  await client.query(
    `
    INSERT INTO users (email, password_hash, first_name, last_name, role, phone, company_name, is_active)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8),
    ($9, $10, $11, $12, $13, $14, $15, $16)
    ON CONFLICT (email) DO NOTHING
  `,
    [
      'john@databizpro.com',
      staffPasswordHash,
      'John',
      'Doe',
      'staff',
      '+254711111111',
      'DataBizPro Ltd',
      true,
      'jane@databizpro.com',
      staffPasswordHash,
      'Jane',
      'Smith',
      'staff',
      '+254722222222',
      'DataBizPro Ltd',
      true,
    ]
  );

  console.log('✅ Database seeded successfully');
}

// Run migrations
if (require.main === module) {
  runMigrations().catch(console.error);
}

module.exports = runMigrations;
