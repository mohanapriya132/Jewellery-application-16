// Initialize Supabase client using the service role key
// The service role key bypasses RLS — safe to use ONLY on the backend
const { createClient } = require('@supabase/supabase-js');

let supabase = null;

try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseUrl.startsWith('http')) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.error('⚠️  Supabase client not initialized: SUPABASE_URL is missing or invalid.');
  }
} catch (error) {
  console.error('⚠️  Failed to initialize Supabase client:', error.message);
}

module.exports = supabase;

