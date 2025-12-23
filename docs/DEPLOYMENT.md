# Deployment Guide

This document covers the CI/CD pipeline and deployment process for the Crew Fireworks frontend.

## Overview

The frontend is deployed to **Fly.io** and served at **crewfireworks.com**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Pipeline                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   PR Created/Updated          Push to main                  │
│         │                          │                        │
│         ▼                          ▼                        │
│   Quality Checks              Quality Checks                │
│   (lint, type, test)          (lint, type, test, build)    │
│         │                          │                        │
│         ▼                          ▼                        │
│   PR Status ✓/✗              Deploy to Fly.io              │
│                                    │                        │
│                                    ▼                        │
│                              crewfireworks.com              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## CI/CD Workflows

### Pull Request Quality Checks

**Trigger:** Pull requests to `main` branch

**File:** `.github/workflows/quality-checks.yml`

**Steps:**
1. Checkout code (with submodules)
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run linting (`npm run lint`)
5. Run type checking (`npm run type-check`)
6. Run tests (`npm test -- --run`)
7. Build verification (`npm run build`)

**Outcome:** PR shows ✓ or ✗ status check

### Production Deployment

**Trigger:** Push to `main` branch (when frontend files change)

**File:** `.github/workflows/deploy-production.yml`

**Steps:**
1. **Quality Job:**
   - All quality checks (lint, type-check, test, build)

2. **Deploy Job** (runs after quality passes):
   - Setup Fly.io CLI
   - Deploy to Fly.io (`flyctl deploy --remote-only`)
   - Log completion

## Environment Configuration

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `FLY_API_TOKEN` | Fly.io deployment token |

To create/update:
1. Go to repository Settings → Secrets and variables → Actions
2. Add/update the secret

### Fly.io Configuration

The frontend uses `fly.toml` for configuration:

```toml
app = "crew-fireworks-frontend"
primary_region = "ord"

[http_service]
  internal_port = 80
  force_https = true
```

## Manual Deployment

If needed, you can deploy manually:

```bash
cd ecommerce-shop-frontend

# Login to Fly.io (first time only)
flyctl auth login

# Deploy
flyctl deploy

# Check status
flyctl status

# View logs
flyctl logs
```

## Monitoring Deployments

### Fly.io Dashboard

View deployment status, metrics, and logs:
- Dashboard: https://fly.io/apps/crew-fireworks-frontend

### Sentry

Error monitoring and performance:
- Check Sentry dashboard for any deployment-related errors
- Domain tags help identify issues: `cart`, `profile`, `products`, `admin`

### Health Check

After deployment, verify:
1. Homepage loads: https://crewfireworks.com
2. Products page works: https://crewfireworks.com/products
3. No console errors in browser DevTools

## Rollback

### Via Fly.io Dashboard

1. Go to https://fly.io/apps/crew-fireworks-frontend
2. Navigate to "Releases"
3. Find previous working release
4. Click "Rollback to this release"

### Via CLI

```bash
# List recent deployments
flyctl releases -a crew-fireworks-frontend

# Rollback to specific version
flyctl releases rollback <version> -a crew-fireworks-frontend
```

## Troubleshooting

### Build Fails in CI

**Check the workflow logs:**
1. Go to repository → Actions tab
2. Find the failed workflow run
3. Expand the failed step

**Common issues:**
- TypeScript errors: Run `npm run type-check` locally
- Lint errors: Run `npm run lint` locally
- Test failures: Run `npm test -- --run` locally

### Deployment Fails

**Check Fly.io logs:**
```bash
flyctl logs -a crew-fireworks-frontend
```

**Common issues:**
- Invalid `fly.toml` configuration
- Missing environment variables
- Docker build failure

### Site Not Loading After Deploy

1. Check Fly.io status: `flyctl status`
2. Check recent logs: `flyctl logs`
3. Verify DNS is pointing correctly
4. Try hard refresh (Ctrl+Shift+R)

## Environment Variables

### Build-time (Vite)

Set in `.env` or via CI environment:

```env
VITE_API_BASE_URL=https://api.crewfireworks.com
```

These are baked into the build at compile time.

### Fly.io Secrets (if needed)

```bash
# Set a secret
flyctl secrets set MY_SECRET=value -a crew-fireworks-frontend

# List secrets
flyctl secrets list -a crew-fireworks-frontend
```

## Best Practices

### Before Merging to Main

Always ensure:
- [ ] All CI checks pass
- [ ] Local build works (`npm run build`)
- [ ] Changes tested in development
- [ ] No breaking changes to API contracts

### After Deployment

- [ ] Verify site loads correctly
- [ ] Check critical user flows work
- [ ] Monitor Sentry for new errors
- [ ] Watch Fly.io metrics for anomalies

### Staging Environment

For major changes, consider:
1. Creating a staging Fly.io app
2. Deploying to staging first
3. Testing thoroughly
4. Then merging to main for production

See `docs/plans/2025-12-22-staging-setup-guide.md` for staging setup instructions.
