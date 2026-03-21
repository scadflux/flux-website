/**
 * Database Connection Test Script
 * Run this to verify Supabase connection and permissions
 *
 * Usage: node test-db-connection.js
 *
 * Before running, set your environment variables:
 * export VITE_SUPABASE_URL="your-url"
 * export VITE_SUPABASE_ANON_KEY="your-key"
 *
 * Or create a .env file and run: source .env && node test-db-connection.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// If not in env, try to load from .env file
if (!supabaseUrl || !supabaseAnonKey) {
  try {
    const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
    const envLines = envFile.split('\n');
    envLines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = value;
      if (key === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = value;
    });
  } catch (error) {
    // Ignore if .env file doesn't exist
  }
}

console.log('\n🔍 Testing Supabase Connection...\n');
console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing environment variables. Check your .env file.\n');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
  try {
    console.log('\n📊 Testing Database Tables...\n');

    // Test 1: Check if we can read from member_applications (should work for admins)
    console.log('1. Testing member_applications table read access...');
    const { data: apps, error: appsError } = await supabase
      .from('member_applications')
      .select('count')
      .limit(1);

    if (appsError) {
      console.log('   ⚠️  Cannot read (expected for anon users):', appsError.message);
    } else {
      console.log('   ✅ Can read applications');
    }

    // Test 2: Check if we can insert into member_applications (should work)
    console.log('\n2. Testing member_applications insert access...');
    const testApplication = {
      name: 'Test User ' + Date.now(),
      email: `test${Date.now()}@example.com`,
      year: '2024',
      campus: 'SAV CAMPUS',
      bio: 'This is a test application to verify database permissions.',
      portfolio_url: 'https://example.com',
      photo_url: null,
      reason_for_joining: 'Testing database connection and RLS policies.',
      status: 'pending'
    };

    const { data: insertedApp, error: insertError } = await supabase
      .from('member_applications')
      .insert([testApplication])
      .select()
      .single();

    if (insertError) {
      console.log('   ❌ Cannot insert:', insertError.message);
      console.log('   Error code:', insertError.code);
      console.log('   Error details:', insertError.details);
      console.log('   Error hint:', insertError.hint);
    } else {
      console.log('   ✅ Successfully inserted test application');
      console.log('   Application ID:', insertedApp.id);

      // Clean up test data
      console.log('\n3. Cleaning up test application...');
      const { error: deleteError } = await supabase
        .from('member_applications')
        .delete()
        .eq('id', insertedApp.id);

      if (deleteError) {
        console.log('   ⚠️  Could not delete (expected for anon users)');
        console.log('   Please delete manually: ID =', insertedApp.id);
      } else {
        console.log('   ✅ Test application deleted');
      }
    }

    // Test 3: Check storage bucket access
    console.log('\n4. Testing storage bucket access...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.log('   ⚠️  Cannot list buckets:', bucketsError.message);
    } else {
      console.log('   ✅ Storage accessible');
      console.log('   Buckets:', buckets.map(b => b.name).join(', '));

      // Check if our buckets exist
      const hasMemberPhotos = buckets.some(b => b.name === 'member-photos');
      const hasEventPhotos = buckets.some(b => b.name === 'event-photos');
      console.log('   member-photos:', hasMemberPhotos ? '✅' : '❌');
      console.log('   event-photos:', hasEventPhotos ? '✅' : '❌');
    }

    // Test 4: Check members table (should be readable)
    console.log('\n5. Testing members table access...');
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('count')
      .limit(1);

    if (membersError) {
      console.log('   ❌ Cannot read members:', membersError.message);
    } else {
      console.log('   ✅ Can read members table');
    }

    console.log('\n✅ Database connection test complete!\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
testDatabaseConnection();
