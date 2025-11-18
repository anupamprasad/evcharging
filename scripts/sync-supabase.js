#!/usr/bin/env node

/**
 * Supabase Database Sync Script
 * This script helps sync the database schema and seed data to Supabase
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { readFileSync as readEnv } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file
const envPath = join(__dirname, '..', '.env');
let envContent = '';
try {
  envContent = readEnv(envPath, 'utf-8');
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Parse .env file
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.+)$`, 'm'));
  return match ? match[1].trim() : null;
};

// Get Supabase credentials from .env
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase credentials not found in .env file');
  console.error('   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Validate URL format
if (supabaseUrl.includes('dashboard') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Error: Invalid Supabase URL');
  console.error('   Your URL should be: https://xxxxx.supabase.co');
  console.error('   Current URL:', supabaseUrl);
  console.error('\n   To get the correct URL:');
  console.error('   1. Go to your Supabase project dashboard');
  console.error('   2. Navigate to Settings → API');
  console.error('   3. Copy the "Project URL" (not the dashboard URL)');
  process.exit(1);
}

console.log('🚀 Syncing Supabase Database...\n');
console.log('📋 Project URL:', supabaseUrl);
console.log('');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read SQL files
const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
const seedPath = join(__dirname, '..', 'supabase', 'seed.sql');

let schemaSQL, seedSQL;

try {
  schemaSQL = readFileSync(schemaPath, 'utf-8');
  seedSQL = readFileSync(seedPath, 'utf-8');
} catch (error) {
  console.error('❌ Error reading SQL files:', error.message);
  process.exit(1);
}

// Function to execute SQL via Supabase REST API
async function executeSQL(sql) {
  // Note: Supabase doesn't allow direct SQL execution via the client
  // This script provides instructions instead
  return sql;
}

console.log('📝 Database Schema SQL:');
console.log('='.repeat(50));
console.log(schemaSQL);
console.log('='.repeat(50));
console.log('');

console.log('🌱 Seed Data SQL:');
console.log('='.repeat(50));
console.log(seedSQL);
console.log('='.repeat(50));
console.log('');

console.log('📋 Instructions:');
console.log('===============');
console.log('');
console.log('Since Supabase requires SQL execution through the dashboard,');
console.log('please follow these steps:');
console.log('');
console.log('1. Go to your Supabase Dashboard:');
console.log(`   ${supabaseUrl.replace('.supabase.co', '.supabase.co/project/gtxiikfbkgxnuvbsnhpo')}`);
console.log('');
console.log('2. Navigate to SQL Editor (left sidebar)');
console.log('');
console.log('3. Create a new query and paste the Schema SQL above');
console.log('   Click "Run" to execute');
console.log('');
console.log('4. Create another query and paste the Seed SQL above');
console.log('   Click "Run" to insert sample data');
console.log('');
console.log('5. Verify the data:');
console.log('   - Go to Table Editor');
console.log('   - Check the "stations" table has 20 records');
console.log('   - Verify "user_profiles" and "favorites" tables exist');
console.log('');

// Test connection
console.log('🔍 Testing Supabase connection...');
supabase.from('stations').select('count').limit(1)
  .then(({ error }) => {
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Tables not found - this is expected if schema hasn\'t been run yet');
        console.log('   Please run the schema SQL in Supabase SQL Editor first');
      } else {
        console.log('⚠️  Connection test:', error.message);
      }
    } else {
      console.log('✅ Connection successful!');
    }
  })
  .catch((error) => {
    console.log('⚠️  Connection test failed:', error.message);
  });

console.log('');
console.log('💡 Tip: You can also copy the SQL files directly:');
console.log('   - Schema: supabase/schema.sql');
console.log('   - Seed: supabase/seed.sql');
console.log('');

