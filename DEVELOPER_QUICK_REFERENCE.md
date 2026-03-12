# Developer Quick Reference Guide

## Getting Started (5 Minutes)

### Install & Run
```bash
# Clone
git clone <repo>
cd ebuilt

# Install
npm install

# Configure
cp .env.example .env.local
# Fill in MONGODB_URI, RESEND_API_KEY, etc.

# Run
npm run dev
```

Visit http://localhost:3000

---

## Common Tasks

### Add New Product Feature
```typescript
// 1. Update schema (lib/schemas.ts)
interface Product {
  // Add new field
  newField: string
}

// 2. Create API (app/api/products/new-feature/route.ts)
export async function POST(req: Request) {
  const db = await getDb()
  // Implement logic
}

// 3. Update database collection
db.products.updateMany({}, { $set: { newField: null } })
```

### Add Tenant Feature
```typescript
// 1. Add to tenant schema
interface Tenant {
  newFeature: {
    enabled: boolean
    config: {}
  }
}

// 2. Create admin API
app/api/tenants/new-feature/route.ts

// 3. Create admin UI
app/dashboard/new-feature/page.tsx
```

### Add Search/Filter
```typescript
// Already implemented for products!
// Add to existing filter in app/api/storefront/products/route.ts

// Query parameters:
// ?category=electronics&minPrice=100&maxPrice=5000&inStock=true&sort=price-asc
```

---

## Database Snippets

### Create Text Index
```javascript
db.products.createIndex({
  name: "text",
  description: "text",
  category: "text",
  tags: "text"
})
```

### Find Low Stock Products
```javascript
db.products.find({
  "inventory.trackInventory": true,
  $expr: {
    $lte: [
      "$inventory.quantity",
      { $ifNull: ["$inventory.lowStockThreshold", 5] }
    ]
  }
})
```

### Get Recent Orders
```javascript
db.orders.find({ tenantId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .limit(10)
```

### Search Products
```javascript
db.products.find({
  $text: { $search: "query" },
  tenantId: ObjectId("...")
}).sort({ score: { $meta: "textScore" } })
```

---

## API Quick Examples

### Search Products
```bash
curl "http://localhost:3000/api/storefront/search?q=laptop&page=1&limit=20"
```

### Filter Products
```bash
curl "http://localhost:3000/api/storefront/products?category=electronics&minPrice=1000&maxPrice=50000&inStock=true&sort=price-asc"
```

### Create Address
```bash
curl -X POST http://localhost:3000/api/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "street": "123 Main St",
    "city": "Kathmandu",
    "state": "Bagmati",
    "zip": "44600",
    "country": "Nepal",
    "type": "shipping",
    "isDefault": true
  }'
```

### Check Inventory
```javascript
const product = await db.collection("products").findOne({
  _id: ObjectId("...")
})
console.log(product.inventory.quantity)
```

### Deduct Inventory
```javascript
db.products.updateOne(
  { _id: ObjectId("...") },
  { $inc: { "inventory.quantity": -5 } }
)
```

### Get Low Stock Items
```bash
curl http://localhost:3000/api/tenants/inventory/low-stock \
  -H "Cookie: session=your_token"
```

---

## Common Errors & Solutions

### "Tenant not found"
- Check subdomain in URL
- Verify tenant exists in database
- Check `getTenantFromSubdomainHeader()` function

### "Inventory insufficient"
- Check `inventory.quantity` in products
- Verify stock tracking enabled
- Check order items quantities

### "Search returns no results"
- Verify text index exists: `db.products.getIndexes()`
- Check query length (minimum 2 chars)
- Verify products have name/description

### "Session not found"
- Check cookie is set
- Verify session token valid
- Check getSession() implementation

### "Email not sent"
- Check RESEND_API_KEY
- Verify RESEND_FROM_EMAIL
- Check email format in recipient

---

## Performance Tips

### Optimize Queries
```typescript
// Good - with index
db.products.find({ tenantId, category })

// Bad - no index
db.products.find({ customField: value })

// Add index for custom field
db.products.createIndex({ customField: 1 })
```

### Use Pagination
```typescript
const skip = (page - 1) * limit
const items = await collection.find(query)
  .skip(skip)
  .limit(limit)
  .toArray()
```

### Batch Operations
```typescript
// Better than individual inserts
db.collection.insertMany(items)

// Better than individual updates
db.collection.bulkWrite([
  { updateOne: { filter: {}, update: { $set: {} } } }
])
```

---

## Testing Checklist

Before deploying:
- [ ] All APIs tested with valid data
- [ ] Error cases tested (invalid input, missing data)
- [ ] Database indexes created
- [ ] Environment variables configured
- [ ] Tenant isolation verified
- [ ] Authentication working
- [ ] Search functional
- [ ] Filters working
- [ ] Inventory logic correct
- [ ] Payments processing
- [ ] Admin operations working

---

## Debugging Tips

### Enable Debug Logging
```typescript
// In any route
console.log("[v0] Variable:", variable)

// Check in terminal output
```

### Database Debug
```javascript
// In MongoDB client
db.currentOp()                    // Active operations
db.stats()                        // Database stats
db.collection.find({}).explain()  // Query explanation
```

### API Testing
```bash
# Use curl with verbose
curl -v http://localhost:3000/api/endpoint

# Or use Postman
# Import curl command into Postman
```

### Check Indexes
```javascript
db.products.getIndexes()
db.orders.getIndexes()
db.users.getIndexes()
```

---

## File Navigation

| Task | File |
|------|------|
| Search logic | `lib/search-service.ts` |
| Inventory logic | `lib/inventory-service.ts` |
| Database | `lib/mongodb.ts` |
| Validation | `lib/validation.ts` |
| Schemas | `lib/schemas.ts` |
| Session | `lib/session.ts` |
| Search API | `app/api/storefront/search/route.ts` |
| Products API | `app/api/storefront/products/route.ts` |
| Addresses API | `app/api/addresses/route.ts` |
| Inventory API | `app/api/tenants/inventory/` |
| Products Page | `app/storefront/products/page.tsx` |
| Search Page | `app/storefront/search/page.tsx` |
| Dashboard | `app/dashboard/page.tsx` |

---

## Environment Variables

```env
# Required
MONGODB_URI=mongodb+srv://...
DATABASE_NAME=ebuilt
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Optional
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm...
```

---

## Deployment Commands

```bash
# Build
npm run build

# Test build locally
npm start

# Deploy to Vercel
git push origin main
# Vercel auto-deploys

# Deploy to other platforms
# Set environment variables
# Run: npm run build && npm start
```

---

## Documentation Links

- **Schemas**: `lib/schemas.ts` - All data structures
- **APIs**: `FEATURES_IMPLEMENTATION_GUIDE.md` - All endpoints
- **Deployment**: `DEPLOYMENT_CHECKLIST.md` - Production setup
- **Audit**: `SYSTEM_AUDIT_REPORT.md` - Feature analysis
- **Summary**: `PROJECT_COMPLETION_SUMMARY.md` - Overview

---

## Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run build:analyze    # Analyze bundle

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Database
npm run db:init          # Initialize database
npm run db:indexes       # Create indexes
npm run db:seed          # Seed sample data

# Formatting
npm run format           # Format code
npm run lint             # Lint code
npm run type-check       # Check types
```

---

## Getting Help

1. **Check Documentation**
   - README.md - Setup
   - FEATURES_IMPLEMENTATION_GUIDE.md - Features
   - DEPLOYMENT_CHECKLIST.md - Deployment

2. **Check Code Examples**
   - Browse `app/api/` for API patterns
   - Browse `app/storefront/` for UI patterns
   - Browse `lib/` for utility patterns

3. **Database Queries**
   - Use MongoDB Compass for visualization
   - Test queries in MongoDB client first
   - Check indexes with `getIndexes()`

4. **API Testing**
   - Use Postman or curl
   - Check request body format
   - Verify authentication headers

---

## Common Patterns

### API Endpoint Pattern
```typescript
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDb()
    const data = await db.collection("...").find({...}).toArray()

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "..." }, { status: 500 })
  }
}
```

### Service Function Pattern
```typescript
import { Db, ObjectId } from "mongodb"

export async function myService(
  db: Db,
  tenantId: string,
  data: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate
    if (!data) return { success: false, error: "Data required" }

    // Execute
    const result = await db.collection("...").updateOne({...})

    return { success: result.modifiedCount > 0 }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
```

### Component Pattern
```typescript
"use client"

import { useEffect, useState } from "react"

export function MyComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/...")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  return <div>{/* Render */}</div>
}
```

---

**Last Updated:** [Current Date]
**Version:** 1.0.0
