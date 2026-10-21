import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzzvnqizkqapdrpprjte.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_BflWhUL4alMnJgkoWC6mjw_flectkWD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
