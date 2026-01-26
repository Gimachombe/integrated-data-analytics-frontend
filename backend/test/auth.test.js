const request = require('supertest');
const app = require('../src/server');
const pool = require('../src/db/config');

describe('Authentication API', () => {
  beforeAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['test_%@example.com']);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test_user@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+254712345678',
        companyName: 'Test Company',
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'test_user@example.com',
        password: 'AnotherPassword123!',
        firstName: 'Another',
        lastName: 'User',
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test_user@example.com',
        password: 'TestPassword123!',
      };

      const response = await request(app).post('/api/auth/login').send(credentials).expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(credentials.email);
    });

    it('should reject invalid credentials', async () => {
      const credentials = {
        email: 'test_user@example.com',
        password: 'WrongPassword',
      };

      const response = await request(app).post('/api/auth/login').send(credentials).expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
