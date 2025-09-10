
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// The `!` is removed to avoid throwing an error if the variables are not set during build time.
// The app will fail gracefully at runtime if the variables are not provided in the deployment environment.
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
