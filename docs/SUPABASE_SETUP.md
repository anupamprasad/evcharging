# Supabase Setup Guide

This guide will help you configure Supabase for the EV Charging Station Finder application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js 18+ installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: evcharging (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to be set up (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy the `anon` `public` key (this is safe to expose in frontend)

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the schema
5. Verify the tables were created by going to **Table Editor**

## Step 5: Seed the Database (Optional)

To populate the database with sample charging station data:

1. In the **SQL Editor**, create a new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Click "Run" to insert the sample data
4. Verify the data in **Table Editor** → `stations` table

## Step 6: Configure Row Level Security (RLS)

The schema already includes RLS policies, but verify they're active:

1. Go to **Authentication** → **Policies**
2. Verify that:
   - `stations` table has public read access
   - `user_profiles` and `favorites` tables have user-specific access

## Step 7: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (already enabled by default)
3. Optionally configure:
   - Email templates
   - Redirect URLs
   - Password requirements

## Step 8: Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Check the browser console for any Supabase connection errors
4. Try signing up a new user to test authentication

## Step 9: Configure for Production (Vercel)

If deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MAPBOX_TOKEN`
4. Redeploy your application

## Troubleshooting

### Connection Issues

- **Error: "Invalid API key"**: Double-check your `VITE_SUPABASE_ANON_KEY` in `.env`
- **Error: "Failed to fetch"**: Verify your `VITE_SUPABASE_URL` is correct
- **CORS errors**: Check that your domain is allowed in Supabase settings

### Database Issues

- **Tables not found**: Make sure you ran `schema.sql` in the SQL Editor
- **RLS blocking queries**: Verify RLS policies are correctly set up
- **Seed data not appearing**: Check for errors in the SQL Editor after running `seed.sql`

### Authentication Issues

- **Sign up not working**: Check that Email provider is enabled
- **Email not received**: Check spam folder, verify email templates in Supabase
- **Redirect issues**: Configure redirect URLs in Authentication settings

## Security Best Practices

1. **Never commit `.env` file**: It's already in `.gitignore`
2. **Use RLS**: Row Level Security is enabled to protect user data
3. **Anon key is safe**: The anon key is designed to be public, but RLS protects your data
4. **Service role key**: Never expose the service role key in frontend code

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

