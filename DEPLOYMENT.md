# Deployment Guide

This guide covers deploying the EV Charging Station Finder application to various platforms.

## Prerequisites

Before deploying, ensure you have:
- ✅ Environment variables configured (Supabase URL, Anon Key, Mapbox Token)
- ✅ Database schema and seed data applied to Supabase
- ✅ All tests passing (`npm run test:e2e`)

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent support for Vite/React applications with zero configuration.

#### Quick Deploy

1. **Install Vercel CLI** (optional, for local deployment):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Deploy via Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Add environment variables in project settings:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_MAPBOX_TOKEN`
   - Deploy!

#### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_MAPBOX_TOKEN` - Your Mapbox access token

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

### Option 2: Netlify

Netlify is another excellent option for static site hosting.

#### Quick Deploy

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via CLI**:
   ```bash
   netlify deploy --prod
   ```

3. **Deploy via Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder, OR
   - Connect your Git repository
   - Add environment variables in Site settings → Environment variables
   - Deploy!

#### Environment Variables

Add in Netlify Dashboard → Site settings → Environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MAPBOX_TOKEN`

#### Build Settings

Netlify will auto-detect from `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`

---

### Option 3: GitHub Pages

Free hosting option for public repositories.

#### Setup

1. **Update `vite.config.ts`** (if using custom path):
   ```typescript
   base: '/evcharging/', // Replace 'evcharging' with your repo name
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Configure GitHub Pages**:
   - Go to Repository → Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on push to `main`

4. **Add Secrets** (Repository → Settings → Secrets and variables → Actions):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MAPBOX_TOKEN`

#### Access Your Site

Your site will be available at:
`https://<username>.github.io/<repository-name>/`

---

## Pre-Deployment Checklist

- [ ] Build succeeds locally: `npm run build`
- [ ] All environment variables are set
- [ ] Database is set up and seeded
- [ ] Tests pass: `npm run test:e2e`
- [ ] No console errors in production build
- [ ] Mapbox token has correct domain restrictions
- [ ] Supabase RLS policies are configured correctly

## Post-Deployment

### Verify Deployment

1. **Check Application**:
   - Visit deployed URL
   - Verify map loads correctly
   - Test search functionality
   - Test filters
   - Test authentication flow

2. **Check Console**:
   - Open browser DevTools
   - Check for errors in Console
   - Verify network requests succeed

3. **Test Features**:
   - Search by city/PIN
   - Apply filters
   - Click map markers
   - Test geolocation
   - Test authentication

### Troubleshooting

#### Map Not Loading
- Verify Mapbox token is set correctly
- Check Mapbox token domain restrictions
- Verify token has correct permissions

#### Supabase Connection Issues
- Verify Supabase URL and anon key
- Check Supabase project is active
- Verify RLS policies allow public read access

#### 404 Errors on Routes
- Ensure redirect rules are configured (all routes → index.html)
- Verify base path in `vite.config.ts` matches deployment path

#### Environment Variables Not Working
- Verify variables are prefixed with `VITE_`
- Rebuild after adding new variables
- Check variable names match exactly

## Continuous Deployment

All platforms support automatic deployments:
- **Vercel**: Auto-deploys on push to main branch
- **Netlify**: Auto-deploys on push to main branch
- **GitHub Pages**: Uses GitHub Actions workflow (configured in `.github/workflows/deploy.yml`)

## Monitoring

Consider setting up:
- Error tracking (Sentry, LogRocket)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot, Pingdom)

## Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Keep Supabase anon key public (it's safe with RLS)
- Restrict Mapbox token to specific domains
- Regularly rotate API keys

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs
- Check environment variables
- Verify build output in `dist/` folder

