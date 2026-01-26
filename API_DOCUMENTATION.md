# Data & Business Services Platform - API Documentation

## Base URL


## Authentication
All endpoints (except public ones) require JWT authentication.

### Headers


## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset

### Data Services
- `POST /data-services/request` - Create data service request
- `GET /data-services/my-requests` - Get user's requests
- `GET /data-services/:id/report` - Download report
- `GET /admin/data-services` - Admin: Get all requests

### Business Services
- `GET /business/search-name` - Search business name
- `POST /business/register` - Register business
- `GET /business/my-registrations` - Get user's registrations

### KRA Services
- `POST /kra/pin-registration` - Request KRA PIN registration
- `POST /kra/tax-filing` - File tax returns
- `GET /kra/compliance-certificate` - Get compliance certificate

### Bookkeeping
- `POST /bookkeeping/request` - Request bookkeeping service
- `POST /bookkeeping/upload-financials` - Upload financial documents
- `GET /bookkeeping/reports/:serviceId` - Get financial reports

### Payments
- `POST /payments/mpesa` - Initiate M-Pesa payment
- `POST /payments/stripe` - Initiate card payment
- `POST /payments/bank-transfer` - Initiate bank transfer
- `GET /payments/status/:transactionId` - Check payment status
- `GET /payments/history` - Get payment history
- `GET /payments/invoice/:paymentId` - Generate invoice

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users/notifications` - Get notifications

### Admin
- `GET /admin/dashboard-stats` - Get dashboard statistics
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/status` - Update user status
- `PUT /admin/users/:id/role` - Update user role
- `GET /admin/service-requests` - Get all service requests
- `PUT /admin/service-requests/:id` - Update request status

## Error Responses

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Additional error details"]
}


Success Responses

{
  "success": true,
  "data": {},
  "message": "Success message"
}


## 8. **Environment Configuration**

### `.env.example`
```env
# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-cool-cloud-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
S3_ENDPOINT=https://s3.amazonaws.com

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@databizpro.com

# M-Pesa (Safaricom Daraja API)
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_INITIATOR_NAME=your_initiator_name
MPESA_INITIATOR_PASSWORD=your_initiator_password

# Stripe
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100