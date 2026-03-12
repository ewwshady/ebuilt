# Quick Start Guide

Get eBuilt running in 5 minutes.

## Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or Atlas)
- Resend account (for emails)

## 1. Setup Environment (2 minutes)

```bash
# Clone repository
git clone <repo-url>
cd ebuilt

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

## 2. Configure Environment Variables (2 minutes)

Edit `.env.local`:

```env
# REQUIRED: MongoDB connection
MONGODB_URI=mongodb://localhost:27017/ebuilt

# REQUIRED: Resend Email API
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Get from https://resend.com
RESEND_FROM_EMAIL=noreply@ebuilt.com

# REQUIRED: JWT Secret (generate random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Get Resend API Key

1. Go to https://resend.com
2. Sign up for free account
3. Navigate to "API Keys"
4. Click "Create API Key"
5. Copy key to `.env.local`

## 3. Start Development Server (1 minute)

```bash
npm run dev
# or
yarn dev
```

Server runs at `http://localhost:3000`

## 4. Test the System

### Test Customer Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User",
    "tenantId": "TENANT_ID_HERE"
  }'
```

### Create Test Tenant
```bash
curl -X POST http://localhost:3000/api/tenants/create \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "Test Store",
    "subdomain": "test-store",
    "ownerName": "Store Owner",
    "email": "owner@example.com",
    "password": "AdminPass123!",
    "description": "Test store"
  }'
```

## 5. Verify Email Works

1. Register a user - OTP will be "sent" via Resend
2. Check `.env.local` - if Resend is not configured, check logs
3. You should see email logs in console during development

## Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (create from .env.example) |
| `lib/validation.ts` | All input validation rules |
| `lib/email.ts` | Email service (Resend API) |
| `lib/otp.ts` | OTP generation and verification |
| `SECURITY_AND_VALIDATION.md` | Complete security documentation |
| `API_TESTING_GUIDE.md` | API endpoint examples |

## Validation Rules (Quick Reference)

### Email
- Valid format (RFC 5322)
- Max 254 characters
- Normalized to lowercase

### Password
- Minimum 8 characters
- Uppercase letter required
- Lowercase letter required
- Number required
- Special character required

### OTP
- 6 digits
- 10 minute expiration
- 5 attempt limit

### Name
- 2-100 characters
- Letters, spaces, hyphens, apostrophes only

### Subdomain
- 3-63 characters
- Lowercase letters, numbers, hyphens
- Must start and end with alphanumeric

## Common Tasks

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
npm start
```

### Check Linting
```bash
npm run lint
```

## Troubleshooting

### "RESEND_API_KEY is not configured"
- Check `.env.local` has `RESEND_API_KEY`
- Verify key is from resend.com
- Emails will fail until configured

### "MongoDB connection failed"
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB is running
- Verify connection string format

### "JWT_SECRET is not configured"
- Add `JWT_SECRET` to `.env.local`
- Use random string (min 32 characters)
- Generate with: `openssl rand -hex 32`

### Email Not Sending
- Check `.env.local` has `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
- Check logs for Resend API errors
- Verify email domain is verified in Resend

### Validation Failing
- Check validation error messages in response
- See `lib/validation.ts` for exact rules
- Review `SECURITY_AND_VALIDATION.md`

## API Endpoints (Quick Reference)

### Authentication
- `POST /api/auth/register` - Register customer
- `POST /api/auth/login` - Login customer
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/request-password-reset` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### Tenants
- `POST /api/tenants/create` - Create new store
- `POST /api/tenants/auth/login` - Login as store admin
- `POST /api/tenants/apply-theme` - Change store theme
- `GET /api/tenants/analytics` - Get store analytics
- `POST /api/tenants/payment-settings/update` - Configure payment

### Orders
- `GET /api/storefront/orders/[id]/track` - Track order
- `PATCH /api/tenants/orders/[id]/update-status` - Update order status

### Reviews
- `POST /api/storefront/reviews/submit` - Submit review
- `GET /api/storefront/reviews/product/[id]` - Get product reviews

### Payments
- `POST /api/payments/esewa/initiate` - Start eSewa payment
- `POST /api/payments/esewa/verify` - Verify payment

## Full Documentation

- **SECURITY_AND_VALIDATION.md** - Complete security guide
- **IMPLEMENTATION_CHECKLIST.md** - Feature status and checklist
- **API_TESTING_GUIDE.md** - Detailed API examples
- **ENHANCEMENTS_SUMMARY.md** - Full feature overview

## Next Steps

1. ✅ Start development server (`npm run dev`)
2. ✅ Create a test tenant
3. ✅ Register test user
4. ✅ Verify OTP email works
5. ✅ Test password reset flow
6. ✅ Build frontend components
7. ✅ Setup payment gateway
8. ✅ Deploy to production

## Need Help?

1. Check **SECURITY_AND_VALIDATION.md** for validation rules
2. Check **API_TESTING_GUIDE.md** for endpoint examples
3. Check server logs for error details
4. Verify all environment variables are set
5. Test with curl/Postman before frontend

## What's Included

✅ User authentication with OTP verification
✅ Multi-tenant store system
✅ Password reset functionality
✅ Theme system with 6 themes
✅ Order management and tracking
✅ Review and rating system
✅ eSewa payment integration
✅ Store analytics dashboard
✅ Admin analytics dashboard
✅ Comprehensive input validation
✅ Security best practices
✅ Error handling and logging
✅ Resend email API integration

## What's Not Included Yet

- Frontend React components
- Admin dashboard UI
- Customer storefront UI
- Payment gateway UI forms
- Image upload and management
- Advanced filtering and search
- Recommendation engine
- Email template builder

---

**Ready to go!** 🚀

Next: Review `API_TESTING_GUIDE.md` for endpoint examples
