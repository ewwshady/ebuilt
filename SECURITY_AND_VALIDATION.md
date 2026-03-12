# Security and Validation Documentation

## Overview

This document outlines the security measures, validation rules, and best practices implemented in the eBuilt multi-tenant eCommerce platform.

---

## Email Configuration (Resend API)

### Setup

The platform uses **Resend** for sending transactional emails (OTP, password resets, notifications).

### Environment Configuration

Add the following to your `.env.local`:

```bash
RESEND_API_KEY=your_api_key_here
RESEND_FROM_EMAIL=noreply@your-domain.com
```

### How to Get Resend API Key

1. Go to https://resend.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Add it to `.env.local`

### Email Types Sent

1. **Email Verification OTP** - 6-digit code sent during registration
2. **Password Reset OTP** - 6-digit code for password recovery
3. **Welcome Email** - Sent after email verification
4. **Order Confirmation** - Sent after successful order placement

---

## Input Validation

### Validation Strategy

All user inputs are validated both **client-side** and **server-side** to prevent malicious activity and ensure data integrity.

### Validation Rules

#### Email Validation
- Required field
- Must follow RFC 5322 simplified format
- Maximum 254 characters
- Cannot start or end with a dot
- Cannot contain consecutive dots

**Example Usage:**
```typescript
import { validateEmail } from "@/lib/validation"

const result = validateEmail("user@example.com")
if (!result.valid) {
  console.error(result.error)
}
```

#### Password Validation
- Minimum 8 characters
- Maximum 128 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character: `!@#$%^&*()_+-=[]{}';:"\\|,.<>/?`

**Password Examples:**
- ✅ `SecurePass123!`
- ✅ `MyP@ssw0rd`
- ❌ `password123` (no uppercase, no special char)
- ❌ `Pass123` (too short, no special char)

#### Name Validation
- Minimum 2 characters
- Maximum 100 characters
- Only letters, spaces, hyphens, and apostrophes allowed

**Example Usage:**
```typescript
import { validateName } from "@/lib/validation"

const result = validateName("John O'Brien-Smith")
if (!result.valid) {
  console.error(result.error)
}
```

#### Phone Number Validation
- International format support
- 1-15 digits
- Optional leading `+` sign
- No spaces (removed automatically)

#### OTP Validation
- Exactly 6 digits
- Numbers only

#### Address Validation
- Street address: 3-100 characters
- City: minimum 2 characters
- State/Province: required
- ZIP/Postal code: required
- Country: required

#### Product Information
- **Product Name**: 3-200 characters
- **Price**: 0 to 9,999,999.99
- **Quantity**: 0 to 999,999 (whole numbers)
- **Description**: 10-5000 characters

#### Subdomain Validation
- Minimum 3 characters
- Maximum 63 characters
- Lowercase letters, numbers, and hyphens only
- Must start and end with alphanumeric character

**Example Subdomains:**
- ✅ `my-store`
- ✅ `store123`
- ❌ `-mystore` (starts with hyphen)
- ❌ `mystore-` (ends with hyphen)

#### Store Name Validation
- Minimum 2 characters
- Maximum 100 characters

#### URL Validation
- Must be valid URL format
- Supports both HTTP and HTTPS
- Must include protocol

#### Coupon Code Validation
- Minimum 3 characters
- Maximum 50 characters
- Letters, numbers, and hyphens only
- Converted to uppercase

---

## Client-Side Validation Hook

Use the `useValidation` hook in React components for real-time validation:

```typescript
import { useValidation } from "@/lib/hooks/useValidation"

export function LoginForm() {
  const { errors, validateField, clearError, hasErrors } = useValidation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateField("email", value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validateField("password", value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (hasErrors) {
      return // Don't submit if validation errors exist
    }

    // Submit form
    await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit" disabled={hasErrors}>
        Login
      </button>
    </form>
  )
}
```

---

## Server-Side Validation

All API endpoints validate input using strict validation rules:

```typescript
// Example from /app/api/auth/register/route.ts
import { validateEmail, validatePassword, validateName, validateBatch } from "@/lib/validation"

const validations = [
  ["email", validateEmail(email)],
  ["password", validatePassword(password)],
  ["name", validateName(name)],
] as const

const { valid: allValid, errors } = validateBatch(validations)

if (!allValid) {
  return NextResponse.json({ error: "Validation failed", errors }, { status: 400 })
}
```

---

## OTP (One-Time Password) System

### How OTP Works

1. **Generation**: 6-digit random code generated
2. **Storage**: Stored in database with:
   - Email address
   - Purpose (email_verification or password_reset)
   - Expiration time (10 minutes)
   - Attempt counter (max 5 attempts)
3. **Transmission**: Sent via email using Resend API
4. **Verification**: User enters OTP, verified against stored value
5. **Cleanup**: Deleted after successful verification

### OTP Features

- **Time-based expiration**: 10 minutes
- **Attempt limiting**: Maximum 5 incorrect attempts
- **One-time use**: Deleted after successful verification
- **Purpose-specific**: Different OTPs for different operations

### API Endpoints

**Request Email Verification OTP:**
```bash
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Verify Email with OTP:**
```bash
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "tenantId": "tenant_id_here"
}
```

**Request Password Reset OTP:**
```bash
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Reset Password with OTP:**
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

---

## Security Best Practices

### 1. Password Security
- Passwords are hashed using **bcryptjs** before storage
- Never store plain-text passwords
- Passwords are not returned in API responses
- Minimum complexity requirements enforced

### 2. Session Management
- Sessions are JWT-based with secure signing
- HTTP-only cookies prevent XSS attacks
- SameSite=Lax prevents CSRF attacks
- Sessions expire after 7 days
- Secure flag enabled in production

### 3. Database Security
- Input sanitization prevents MongoDB injection
- Parameterized queries used throughout
- Role-based access control enforced
- Tenant isolation verified for all operations

### 4. Email Security
- All emails are sent over HTTPS via Resend
- Email addresses are normalized (lowercase)
- No sensitive data in email content
- Generic messages for non-existent users

### 5. API Security
- Rate limiting recommended at reverse proxy level
- CORS properly configured
- Input validation on all endpoints
- Output encoding for JSON responses
- Error messages don't reveal system details

### 6. Frontend Security
- Client-side validation prevents malicious input
- HTTPS only in production
- Content Security Policy recommended
- XSS protection via template escaping
- CSRF tokens for state-changing operations

---

## Common Attack Prevention

### SQL Injection Prevention
✅ Uses MongoDB with parameter binding
✅ Never concatenates user input into queries
✅ Validates all input before database operations

### XSS (Cross-Site Scripting) Prevention
✅ React automatically escapes JSX content
✅ DOMPurify recommended for rich text
✅ Content Security Policy headers recommended

### CSRF (Cross-Site Request Forgery) Prevention
✅ SameSite=Lax cookies
✅ Origin validation
✅ State change operations require POST

### Brute Force Prevention
✅ OTP attempt limiting (5 attempts)
✅ Rate limiting recommended
✅ Account lockout mechanisms can be added

### Email Enumeration Prevention
✅ Generic response messages for both cases:
   - "If an account exists, you'll receive a reset code"
✅ Consistent response times

---

## Testing Validation

### Unit Testing Example

```typescript
import { validateEmail, validatePassword } from "@/lib/validation"

describe("Validation", () => {
  test("validateEmail should reject invalid emails", () => {
    expect(validateEmail("invalid").valid).toBe(false)
    expect(validateEmail("user@").valid).toBe(false)
    expect(validateEmail("@example.com").valid).toBe(false)
  })

  test("validatePassword should enforce requirements", () => {
    expect(validatePassword("weak").valid).toBe(false)
    expect(validatePassword("NoNumber!").valid).toBe(false)
    expect(validatePassword("NoUpper123!").valid).toBe(false)
    expect(validatePassword("NoSpecial123").valid).toBe(false)
  })

  test("validatePassword should accept valid passwords", () => {
    expect(validatePassword("SecurePass123!").valid).toBe(true)
    expect(validatePassword("MyP@ssw0rd").valid).toBe(true)
  })
})
```

---

## Migration Checklist

Before production deployment:

- [ ] Set `RESEND_API_KEY` in environment variables
- [ ] Set `RESEND_FROM_EMAIL` to your domain
- [ ] Test OTP email delivery
- [ ] Configure MongoDB connection
- [ ] Set `JWT_SECRET` to a strong random value
- [ ] Enable HTTPS only in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure error monitoring (Sentry)
- [ ] Set up email templates for all languages
- [ ] Test all authentication flows
- [ ] Verify password reset works end-to-end
- [ ] Load test OTP system

---

## Support

For issues with validation or security:
1. Check this documentation
2. Review error messages carefully
3. Check server logs for detailed errors
4. Verify all environment variables are set
5. Test with curl or Postman first

---

**Last Updated**: 2024
**Status**: Production Ready
