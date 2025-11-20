# Login Feature Troubleshooting Guide

## Common Issues and Solutions

### 1. "Invalid login credentials" Error

**Possible Causes:**
- Wrong email or password
- Email not confirmed (if email confirmation is enabled)
- User doesn't exist (need to sign up first)

**Solutions:**
- Double-check your email and password
- If you just signed up, check your email for confirmation link
- Try signing up again if the account doesn't exist

### 2. Sign Up Not Working

**Possible Causes:**
- Email confirmation required but email not sent
- Supabase authentication not properly configured
- Network/CORS issues

**Solutions:**
1. Check Supabase Dashboard → Authentication → Providers
   - Ensure "Email" provider is enabled
   - Check email confirmation settings
2. Check browser console for errors
3. Verify environment variables are set correctly

### 3. Email Confirmation Required

**If email confirmation is enabled in Supabase:**
- After signing up, check your email inbox (and spam folder)
- Click the confirmation link in the email
- Then try signing in

**To disable email confirmation (for testing):**
1. Go to Supabase Dashboard
2. Authentication → Settings
3. Disable "Enable email confirmations"
4. Note: This is not recommended for production

### 4. Network/CORS Errors

**Symptoms:**
- "Failed to fetch" errors
- Network request failed

**Solutions:**
1. Check Supabase URL is correct in `.env`
2. Verify Supabase project is active
3. Check browser console for CORS errors
4. Ensure Vercel environment variables are set (for production)

### 5. Environment Variables Not Loaded

**Symptoms:**
- "Supabase credentials not found" warning
- Authentication requests fail

**Solutions:**
1. Verify `.env` file exists in project root
2. Check variables are named correctly:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Restart dev server after changing `.env`
4. For production, set variables in Vercel dashboard

## Debugging Steps

1. **Open Browser Console** (F12)
   - Look for Supabase initialization messages
   - Check for error messages during login
   - Look for network errors

2. **Check Supabase Dashboard**
   - Go to Authentication → Users
   - See if user was created
   - Check user's email confirmation status

3. **Test with Browser DevTools**
   - Network tab: Check if requests are being made
   - Console tab: Look for error messages
   - Application tab: Check localStorage for Supabase session

4. **Verify Supabase Configuration**
   - Authentication → Providers → Email (should be enabled)
   - Authentication → URL Configuration (check redirect URLs)
   - Settings → API (verify URL and keys)

## Quick Test

1. Try signing up with a new email
2. Check browser console for any errors
3. Check Supabase Dashboard → Authentication → Users
4. If user appears but can't sign in, check email confirmation status

## Getting Help

If issues persist:
1. Check browser console for detailed error messages
2. Check Supabase logs: Dashboard → Logs → Auth
3. Verify all environment variables are set correctly
4. Ensure Supabase project is active and not paused

