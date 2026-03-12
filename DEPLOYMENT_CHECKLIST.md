# Deployment Checklist - eBuilt Platform

## Pre-Deployment Setup

### Database Configuration
- [ ] MongoDB connection string configured
- [ ] Text index created on products collection
- [ ] Indexes created for optimal query performance
- [ ] `inventoryLogs` collection created
- [ ] `searchLogs` collection created
- [ ] `wishlist` collection exists
- [ ] `orders` collection exists
- [ ] `users` collection has proper schema

### Environment Variables
```env
# Required
MONGODB_URI=your_mongodb_uri
DATABASE_NAME=ebuilt

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Session Management
SESSION_SECRET=your_random_secret_key

# Payment Gateway
ESEWA_MERCHANT_CODE=your_code
ESEWA_SECRET_KEY=your_secret
NEXT_PUBLIC_ESEWA_PAYMENT_URL=https://esewa.com.np/epay/main

# Optional
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Code Quality Checks
- [ ] All console.log debug statements removed
- [ ] No hardcoded secrets or credentials
- [ ] Error handling implemented
- [ ] Validation schemas in place
- [ ] Type safety verified (TypeScript)

### Testing
- [ ] Unit tests for utilities
- [ ] Integration tests for API endpoints
- [ ] E2E tests for user flows
- [ ] Search functionality tested
- [ ] Filtering tested
- [ ] Inventory deduction verified
- [ ] Order cancellation tested
- [ ] Address management verified
- [ ] Cart functionality tested
- [ ] Wishlist functionality tested
- [ ] Payment flow tested

### Security Review
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (MongoDB)
- [ ] XSS prevention (React escaping)
- [ ] CSRF protection (SameSite cookies)
- [ ] Sensitive data not logged
- [ ] No exposed API keys
- [ ] Authentication required on protected routes
- [ ] Tenant isolation verified

---

## Performance Optimization Checklist

### Database
- [ ] Indexes on frequently queried fields
- [ ] Text index on products for search
- [ ] Connection pooling configured
- [ ] Query optimization verified
- [ ] No N+1 queries

### Frontend
- [ ] Image optimization (next/image)
- [ ] Code splitting enabled
- [ ] CSS minification
- [ ] JavaScript minification
- [ ] Lazy loading implemented
- [ ] Caching headers set
- [ ] CDN configured for static assets

### API
- [ ] Pagination implemented
- [ ] Limit request size
- [ ] Gzip compression enabled
- [ ] Response caching where appropriate
- [ ] Database connection pooling

### Monitoring
- [ ] Error tracking setup (Sentry recommended)
- [ ] Performance monitoring (New Relic, Datadog)
- [ ] Database monitoring
- [ ] API response time tracking
- [ ] Search query analytics

---

## Deployment Steps

### 1. Development Environment
```bash
# Clone repository
git clone <repo-url>
cd ebuilt

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in all required environment variables

# Run database migrations
npm run db:migrate

# Create indexes
npm run db:indexes

# Run development server
npm run dev
```

### 2. Staging Environment
```bash
# Build for staging
npm run build

# Run staging server
NODE_ENV=staging npm start

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

### 3. Production Deployment

#### Using Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Vercel automatically deploys on push
# Configure environment variables in Vercel dashboard
# Set DATABASE_NAME to production database
```

#### Using Docker
```bash
# Build Docker image
docker build -t ebuilt:latest .

# Push to registry
docker tag ebuilt:latest registry.example.com/ebuilt:latest
docker push registry.example.com/ebuilt:latest

# Deploy to Kubernetes
kubectl apply -f deployment.yaml
```

#### Manual Deployment
```bash
# Build application
npm run build

# Start production server
NODE_ENV=production npm start

# Monitor logs
tail -f logs/app.log
```

---

## Post-Deployment Verification

### Functional Testing
- [ ] Home page loads correctly
- [ ] Product listing works
- [ ] Search functionality works
- [ ] Filtering works
- [ ] Product detail page loads
- [ ] Cart operations work
- [ ] Wishlist operations work
- [ ] Checkout process works
- [ ] Payment processing works
- [ ] Order confirmation works
- [ ] User login/register works
- [ ] Profile page works
- [ ] Order history shows correctly
- [ ] Reviews can be submitted
- [ ] Admin dashboard accessible
- [ ] Theme switching works
- [ ] Admin inventory management works
- [ ] Admin order management works

### Performance Testing
- [ ] Homepage load time < 3s
- [ ] Product listing load time < 2s
- [ ] Search results load time < 2s
- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] No 404 errors on assets
- [ ] Images optimized and loading

### Security Testing
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] XSS protection working
- [ ] CSRF token validation working
- [ ] Authentication working
- [ ] Authorization checks working
- [ ] Rate limiting working
- [ ] Error messages don't expose sensitive info

### Monitoring Setup
- [ ] Uptime monitoring configured
- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] Log aggregation configured
- [ ] Alerts configured
- [ ] Dashboard setup

---

## Rollback Plan

### If Issues Occur
1. **Immediate Rollback**
   ```bash
   # Revert to previous deployment
   git revert HEAD
   npm run build
   npm start
   ```

2. **Database Rollback**
   - Keep database backups
   - Restore from snapshot if data corruption

3. **Communication**
   - Notify users of temporary outage
   - Post status update
   - Provide ETA for recovery

4. **Post-Mortem**
   - Document issue
   - Root cause analysis
   - Implementation of fix
   - Deployment of fix
   - Monitoring for recurrence

---

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review database metrics
- [ ] Check payment processing

### Weekly
- [ ] Review search logs for trends
- [ ] Check low-stock inventory items
- [ ] Review customer feedback
- [ ] Monitor storage usage

### Monthly
- [ ] Database maintenance
- [ ] Security updates
- [ ] Performance analysis
- [ ] Analytics review
- [ ] Clean up old logs
- [ ] Backup verification

### Quarterly
- [ ] Security audit
- [ ] Code quality review
- [ ] Performance optimization
- [ ] Feature roadmap planning
- [ ] Infrastructure assessment

---

## Backup & Disaster Recovery

### Database Backups
```bash
# Daily automatic backups to:
- MongoDB Atlas (if using Atlas)
- AWS S3
- Local encrypted backup

# Retention: 30 days
# Recovery RTO: 1 hour
# Recovery RPO: 24 hours
```

### File Backups
```bash
# Images and uploads to:
- AWS S3
- Cloudinary (images)
- Local encrypted storage

# Retention: 90 days
```

### Testing Backups
- [ ] Monthly restore test
- [ ] Document restoration process
- [ ] Time restoration process

---

## Scaling Strategy

### Horizontal Scaling
- [ ] Load balancer configured
- [ ] Multiple server instances
- [ ] Session storage in Redis
- [ ] Database read replicas

### Vertical Scaling
- [ ] Increase server resources
- [ ] Increase database capacity
- [ ] Increase memory allocation
- [ ] Increase storage

### When to Scale
- CPU usage > 70%
- Memory usage > 80%
- Database connections > 80% capacity
- Response times > 1s

---

## Monitoring & Alerting

### Critical Alerts
- [ ] Application down
- [ ] Database connection lost
- [ ] High error rate (> 5%)
- [ ] High response time (> 2s)
- [ ] Payment processing failures
- [ ] Storage space low

### Warning Alerts
- [ ] CPU usage > 70%
- [ ] Memory usage > 75%
- [ ] Database replication lag
- [ ] API rate limit approaching

### Contacts for Alerts
- [ ] DevOps team
- [ ] Database team
- [ ] Security team
- [ ] Payment team

---

## Success Metrics

After deployment, monitor these metrics:

| Metric | Target | Current |
|--------|--------|---------|
| Uptime | 99.9% | - |
| Average Response Time | < 500ms | - |
| Page Load Time | < 3s | - |
| Search Time | < 2s | - |
| Error Rate | < 0.5% | - |
| Successful Payments | > 99% | - |
| Customer Satisfaction | > 4.5/5 | - |

---

## Sign-Off

- [ ] Development Lead: _____________ Date: _______
- [ ] QA Lead: _____________ Date: _______
- [ ] DevOps Lead: _____________ Date: _______
- [ ] Product Manager: _____________ Date: _______
- [ ] Security Officer: _____________ Date: _______

---

## Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| DevOps | | | |
| Database Admin | | | |
| Security | | | |
| Payment Support | | | |
| Escalation | | | |

---

## Notes

Record any deployment-specific notes, issues, or observations here:

```
[Add notes here]
```

---

**Last Updated:** [Date]
**Deployed By:** [Name]
**Version:** [Version Number]
