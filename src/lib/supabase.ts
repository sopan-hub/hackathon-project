
import { createClient } from '@supabase/supabase-js';

// Since authentication is removed, we are providing dummy values.
// The Supabase client will not be used for authentication.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Supabase URL or anonymous key is not set. This is expected if running without authentication. Dummy values will be used.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
