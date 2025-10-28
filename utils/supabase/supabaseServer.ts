import { createClient } from '@supabase/supabase-js';

export const supabaseServer = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check if environment variables are set
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not set');
    return null;
  }

  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
    return null;
  }

  try {
    const client = createClient(supabaseUrl, supabaseServiceKey);
    return client;
  } catch (error) {
    console.error('Failed to initialize Supabase server client:', error);
    return null;
  }
};
