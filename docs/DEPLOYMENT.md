# Deployment Guide - Rigveda

**Last Updated**: 2025-11-02
**Status**: Production Ready ✅

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Deployment Options](#deployment-options)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- ✅ All 124 tests passing
- ✅ Production build successful
- ✅ Node.js 18+ installed
- ✅ Git repository set up
- ✅ Domain name (optional but recommended)

### Recommended

- GitHub account (for CI/CD)
- Vercel/Netlify account (for hosting)
- Sentry account (for error monitoring)
- Google Analytics account (for analytics)

---

## Quick Start

### 1. Final Pre-Deployment Checks

```bash
# Run all tests
npm test

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### 2. Verify Build Output

Check `dist/` directory:
- Total bundle size: ~282 kB (gzipped: ~89 kB) ✅
- Assets properly split
- index.html generated
- No console errors

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Automatic deployments
- Built-in CDN
- Free SSL
- Excellent performance

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

**Configuration (`vercel.json`):**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy
   ```

4. **Production**
   ```bash
   netlify deploy --prod
   ```

**Configuration (`netlify.toml`):**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages**
   ```bash
   npm i -D gh-pages
   ```

2. **Add to package.json**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository settings
   - Enable GitHub Pages
   - Set branch to `gh-pages`

### Option 4: Custom Server (Docker)

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Deploy:**

```bash
# Build image
docker build -t Rigveda .

# Run container
docker run -d -p 80:80 Rigveda
```

---

## Environment Configuration

### Environment Variables (if needed)

Create `.env.production`:

```bash
# API Configuration (if using external API)
VITE_API_URL=https://api.rigved.vercel.app

# Analytics (optional)
VITE_GA_ID=G-XXXXXXXXXX

# Error Monitoring (optional)
VITE_SENTRY_DSN=https://...
```

### Build Configuration

No special environment variables required for basic deployment.

---

## Post-Deployment

### 1. Verify Deployment

**Manual Testing:**
- [ ] Navigate to homepage
- [ ] Test navigation between pages
- [ ] Test search functionality
- [ ] Test filters
- [ ] Test theme switching
- [ ] Test responsive design
- [ ] Check console for errors

**Automated Testing:**
```bash
# Run Lighthouse audit
npx lighthouse https://rigved.vercel.app --view

# Check for broken links
npx broken-link-checker https://rigved.vercel.app
```

### 2. Configure Custom Domain

**Vercel:**
```bash
vercel domains add rigved.vercel.app
```

**Netlify:**
- Go to Domain Settings
- Add custom domain
- Configure DNS (A/CNAME records)

### 3. SSL Certificate

Both Vercel and Netlify provide free SSL automatically via Let's Encrypt.

For custom servers:
```bash
# Using Certbot
sudo certbot --nginx -d rigved.vercel.app
```

### 4. DNS Configuration

Point your domain to the hosting provider:

**Vercel:**
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

**Netlify:**
```
A     @    75.2.60.5
CNAME www  your-site.netlify.app
```

### 5. Submit to Search Engines

**Google Search Console:**
1. Verify domain ownership
2. Submit sitemap: `https://rigved.vercel.app/sitemap.xml`
3. Request indexing

**Bing Webmaster Tools:**
1. Verify domain
2. Submit sitemap
3. Request crawling

---

## Monitoring & Maintenance

### Error Monitoring (Sentry)

**1. Install Sentry:**
```bash
npm i @sentry/react @sentry/vite-plugin
```

**2. Configure (`src/main.tsx`):**
```typescript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### Analytics (Google Analytics)

**1. Install:**
```bash
npm i react-ga4
```

**2. Configure:**
```typescript
import ReactGA from 'react-ga4';

if (import.meta.env.PROD) {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}
```

### Performance Monitoring

**Web Vitals:**
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  // Send to your analytics service
  console.log({ name, value, id });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Uptime Monitoring

**Recommended Services:**
- UptimeRobot (free)
- Pingdom
- StatusCake
- Better Uptime

### CI/CD Monitoring

GitHub Actions workflow (`.github/workflows/ci.yml`) already configured:
- Runs tests on every PR
- Builds production bundle
- Checks bundle size
- Comments on PR with results

---

## Troubleshooting

### Build Fails

**Issue:** "Out of memory"
```bash
# Increase Node memory
NODE_OPTIONS='--max-old-space-size=8192' npm run build
```

**Issue:** TypeScript errors
```bash
# Check for errors
npx tsc --noEmit

# Fix errors and rebuild
npm run build
```

### Routing Issues (404 on refresh)

**Solution:** Ensure SPA redirect is configured:

**Vercel:** Add to `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify:** Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Slow Performance

**Check:**
1. Lighthouse audit
2. Bundle sizes
3. Number of requests
4. Time to First Byte (TTFB)

**Optimize:**
- Enable CDN
- Enable compression (gzip/brotli)
- Add caching headers
- Optimize images (if any)

### CORS Issues

If using external API, configure CORS headers on the API server:
```
Access-Control-Allow-Origin: https://rigved.vercel.app
```

---

## Rollback Procedure

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify
```bash
# List deploys
netlify deploy list

# Restore specific deploy
netlify deploy restore [deploy-id]
```

### Manual
```bash
# Revert to previous commit
git revert HEAD
git push

# Or checkout previous version
git checkout [commit-hash]
npm run build
# Redeploy
```

---

## Security Checklist

Before going live:

- [x] All dependencies updated
- [x] No console.log in production
- [x] Security headers configured
- [x] HTTPS enabled
- [ ] CSP headers configured (optional)
- [ ] Rate limiting (if using API)
- [ ] Input sanitization (if accepting user input)
- [x] robots.txt configured
- [x] sitemap.xml created

---

## Performance Targets

Verify these targets are met:

- [x] Lighthouse Performance: >85
- [x] Lighthouse Accessibility: >85
- [ ] Lighthouse Best Practices: >90
- [ ] Lighthouse SEO: >90
- [x] First Contentful Paint: <1.5s
- [x] Time to Interactive: <3.5s
- [x] Total Bundle Size: <300kB gzipped

---

## Support & Resources

### Documentation
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

### Community
- GitHub Issues: Report bugs and request features
- Stack Overflow: Technical questions

### Contact
- Email: support@rigved.vercel.app (update this)
- GitHub: https://github.com/your-org/Rigveda

---

## Changelog

### v1.0.0 (2025-11-02)
- Initial production release
- 124 tests passing
- Full TypeScript coverage
- Comprehensive documentation
- CI/CD pipeline configured
- SEO optimized
- Accessibility compliant (~75% WCAG AA)

---

**Maintained By**: Development Team
**Last Review**: 2025-11-02
**Next Review**: After first deployment

🚀 **Ready for deployment!**
