#!/usr/bin/env node

/**
 * Run Supabase Schema Script
 * This script helps you execute the database schema in Supabase
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read schema file
const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql');
let schemaSQL;

try {
  schemaSQL = readFileSync(schemaPath, 'utf-8');
} catch (error) {
  console.error('❌ Error reading schema file:', error.message);
  process.exit(1);
}

console.log('📋 Supabase Schema SQL');
console.log('='.repeat(60));
console.log('');
console.log('Copy the SQL below and run it in your Supabase Dashboard:');
console.log('');
console.log('─'.repeat(60));
console.log(schemaSQL);
console.log('─'.repeat(60));
console.log('');
console.log('📝 Instructions:');
console.log('===============');
console.log('');
console.log('1. Go to your Supabase Dashboard:');
console.log('   https://gtxiikfbkgxnuvbsnhpo.supabase.co/project/gtxiikfbkgxnuvbsnhpo');
console.log('');
console.log('2. Navigate to SQL Editor (left sidebar)');
console.log('');
console.log('3. Click "New query"');
console.log('');
console.log('4. Paste the SQL above into the editor');
console.log('');
console.log('5. Click "Run" (or press Cmd/Ctrl + Enter)');
console.log('');
console.log('6. Verify the tables were created:');
console.log('   - Go to Table Editor');
console.log('   - You should see: stations, user_profiles, favorites');
console.log('');
console.log('💡 Tip: You can also copy the file directly:');
console.log('   cat supabase/schema.sql');
console.log('');

