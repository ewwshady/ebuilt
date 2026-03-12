# API Testing Guide

Quick reference for testing the eBuilt API endpoints using curl or Postman.

## Base URL

```
http://localhost:3000
```

## Authentication Endpoints

### Register Customer

**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "tenantId": "TENANT_ID_HERE"
  }'
```

**Expected Response (201):**
```json
{
  "message": "Registration successful. Please verify your email to complete signup.",
  "user": {
    "id": "USER_ID",
    "email": "customer@example.com",
    "name": "John Doe",
    "tenantId": "TENANT_ID"
  },
  "requiresEmailVerification": true
}
```

### Verify Email

**Endpoint:** `POST /api/auth/verify-email`

First, check your email for the OTP code, then:

```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "otp": "123456",
    "tenantId": "TENANT_ID_HERE"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "USER_ID",
    "email": "customer@example.com",
    "name": "John Doe"
  }
}
```

### Customer Login

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecurePass123!"
  }'
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "USER_ID",
    "email": "customer@example.com",
    "name": "John Doe",
    "role": "customer",
    "tenantId": "TENANT_ID"
  },
  "token": "JWT_TOKEN_HERE"
}
```

### Request Password Reset

**Endpoint:** `POST /api/auth/request-password-reset`

```bash
curl -X POST http://localhost:3000/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com"
  }'
```

**Expected Response (200):**
```json
{
  "message": "If an account exists with this email, you'll receive a password reset code."
}
```

### Reset Password

**Endpoint:** `POST /api/auth/reset-password`

After receiving OTP via email:

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "otp": "123456",
    "newPassword": "NewSecurePass456!",
    "confirmPassword": "NewSecurePass456!"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

## Tenant Endpoints

### Create Tenant Store

**Endpoint:** `POST /api/tenants/create`

```bash
curl -X POST http://localhost:3000/api/tenants/create \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "My Awesome Shop",
    "subdomain": "my-shop",
    "ownerName": "Shop Owner",
    "email": "owner@example.com",
    "password": "AdminPass123!",
    "description": "A great online store"
  }'
```

**Expected Response (201):**
```json
{
  "tenant": {
    "_id": "TENANT_ID",
    "subdomain": "my-shop",
    "name": "My Awesome Shop",
    "themeKey": "beauty-test",
    "theme": {
      "primaryColor": "#ec4899",
      "secondaryColor": "#ffffff"
    }
  }
}
```

### Tenant Admin Login

**Endpoint:** `POST /api/tenants/auth/login`

Headers (subdomain-based):
```
Host: my-shop.localhost:3000
```

```bash
curl -X POST http://my-shop.localhost:3000/api/tenants/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "AdminPass123!"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "USER_ID",
    "email": "owner@example.com",
    "name": "Shop Owner"
  }
}
```

### Apply Theme

**Endpoint:** `POST /api/tenants/apply-theme`

```bash
curl -X POST http://my-shop.localhost:3000/api/tenants/apply-theme \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "themeId": "electronics",
    "colors": {
      "primary": "#2196F3",
      "secondary": "#00BCD4",
      "accent": "#B3E5FC",
      "background": "#F5F5F5",
      "text": "#1A1A1A"
    }
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Theme \"Electronics\" applied successfully",
  "theme": {
    "id": "electronics",
    "name": "Electronics",
    "config": {
      "baseTheme": "electronics",
      "colors": { ... }
    }
  }
}
```

### Update Payment Settings

**Endpoint:** `POST /api/tenants/payment-settings/update`

```bash
curl -X POST http://my-shop.localhost:3000/api/tenants/payment-settings/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "paymentMethod": "esewa",
    "apiKey": "YOUR_ESEWA_MERCHANT_CODE",
    "secretKey": "YOUR_ESEWA_SECRET_KEY",
    "enabled": true
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Payment settings updated successfully"
}
```

### Get Analytics

**Endpoint:** `GET /api/tenants/analytics`

```bash
curl -X GET http://my-shop.localhost:3000/api/tenants/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response (200):**
```json
{
  "analytics": {
    "totalRevenue": 50000,
    "recentRevenue": 12000,
    "totalOrders": 150,
    "pendingOrders": 5,
    "totalProducts": 75,
    "activeProducts": 70,
    "topProducts": [
      {
        "productId": "PRODUCT_ID",
        "name": "Product Name",
        "quantity": 45,
        "revenue": 9000
      }
    ],
    "dailyRevenue": [
      { "date": "2024-01-01", "revenue": 1200 }
    ]
  }
}
```

---

## Order Endpoints

### Update Order Status

**Endpoint:** `PATCH /api/tenants/orders/[id]/update-status`

```bash
curl -X PATCH http://my-shop.localhost:3000/api/tenants/orders/ORDER_ID/update-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "shipped",
    "tracking": {
      "carrier": "FedEx",
      "trackingNumber": "1Z999AA10123456784",
      "estimatedDelivery": "2024-01-15T12:00:00Z"
    }
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

### Track Order (Customer)

**Endpoint:** `GET /api/storefront/orders/[id]/track`

```bash
curl -X GET http://localhost:3000/api/storefront/orders/ORDER_ID/track \
  -H "Authorization: Bearer CUSTOMER_JWT_TOKEN"
```

**Expected Response (200):**
```json
{
  "order": {
    "_id": "ORDER_ID",
    "orderNumber": "ORD-2024-001",
    "status": "shipped",
    "paymentStatus": "paid",
    "tracking": {
      "carrier": "FedEx",
      "trackingNumber": "1Z999AA10123456784",
      "estimatedDelivery": "2024-01-15T12:00:00Z"
    }
  }
}
```

---

## Review Endpoints

### Submit Review

**Endpoint:** `POST /api/storefront/reviews/submit`

Must have purchased the product:

```bash
curl -X POST http://localhost:3000/api/storefront/reviews/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_JWT_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "tenantId": "TENANT_ID",
    "rating": 5,
    "title": "Excellent Product!",
    "content": "This product exceeded my expectations. Highly recommended!"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "review": {
    "_id": "REVIEW_ID",
    "productId": "PRODUCT_ID",
    "rating": 5,
    "status": "pending"
  }
}
```

### Get Product Reviews

**Endpoint:** `GET /api/storefront/reviews/product/[id]`

```bash
curl -X GET http://localhost:3000/api/storefront/reviews/product/PRODUCT_ID?page=1&limit=10
```

**Expected Response (200):**
```json
{
  "reviews": [
    {
      "_id": "REVIEW_ID",
      "productId": "PRODUCT_ID",
      "rating": 5,
      "title": "Excellent Product!",
      "content": "...",
      "status": "approved",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "stats": {
    "averageRating": 4.5,
    "totalReviews": 20,
    "distribution": {
      "5": 15,
      "4": 3,
      "3": 2,
      "2": 0,
      "1": 0
    }
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20
  }
}
```

---

## Payment Endpoints

### Initiate eSewa Payment

**Endpoint:** `POST /api/payments/esewa/initiate`

```bash
curl -X POST http://localhost:3000/api/payments/esewa/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID",
    "tenantId": "TENANT_ID",
    "amount": 1000
  }'
```

**Expected Response (200):**
```json
{
  "url": "https://esewa.com.np/epay/main",
  "formData": {
    "amount": "1000",
    "tax_amount": "0",
    "total_amount": "1000",
    "transaction_uuid": "UUID",
    "product_code": "MERCHANT_CODE",
    "signature": "SIGNATURE",
    "success_url": "...",
    "failure_url": "..."
  }
}
```

### Verify eSewa Payment

**Endpoint:** `POST /api/payments/esewa/verify`

```bash
curl -X POST http://localhost:3000/api/payments/esewa/verify \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID",
    "tenantId": "TENANT_ID",
    "transactionUuid": "UUID",
    "status": "success"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

## Admin Endpoints

### Get Super Admin Analytics

**Endpoint:** `GET /api/admin/super-analytics`

```bash
curl -X GET http://localhost:3000/api/admin/super-analytics \
  -H "Authorization: Bearer SUPER_ADMIN_JWT_TOKEN"
```

**Expected Response (200):**
```json
{
  "analytics": {
    "totalRevenue": 500000,
    "totalOrders": 1500,
    "totalCustomers": 300,
    "activeStores": 25,
    "topStores": [
      {
        "tenantId": "TENANT_ID",
        "storeName": "Top Store",
        "revenue": 50000,
        "orders": 150
      }
    ],
    "paymentBreakdown": {
      "esewa": 400000,
      "cod": 100000
    }
  }
}
```

---

## Error Response Examples

### Validation Error

```json
{
  "error": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

### Unauthorized Error

```json
{
  "error": "Unauthorized"
}
```

### Not Found Error

```json
{
  "error": "Order not found"
}
```

### Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Testing with Postman

1. Import the API endpoints as a collection
2. Set `{{base_url}}` environment variable to `http://localhost:3000`
3. Create variables for:
   - `{{jwt_token}}` - Customer JWT
   - `{{admin_jwt_token}}` - Admin JWT
   - `{{tenant_id}}` - Tenant ID
   - `{{order_id}}` - Order ID
4. Use pre-request scripts to automatically update variables
5. Use tests to validate responses

---

## Common Issues & Solutions

### Email Not Received

- Check `RESEND_API_KEY` is set correctly
- Check `RESEND_FROM_EMAIL` is set
- Verify email address in database
- Check logs for API errors

### Password Reset Not Working

- Verify email exists in database
- Check OTP expiration (10 minutes)
- Verify OTP is 6 digits
- Check attempt count (max 5)

### Payment Verification Failing

- Verify eSewa credentials in payment settings
- Check transaction UUID format
- Verify order exists and belongs to tenant
- Check payment status value

### Analytics Empty

- Verify orders exist with correct tenant ID
- Check order status is "completed" for revenue
- Verify date ranges
- Check database aggregation pipeline

---

**Last Updated**: 2024
**API Version**: 1.0
