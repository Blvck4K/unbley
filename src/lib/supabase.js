import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

let client;

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.error("Please provide a valid Supabase URL and Anon Key in the .env file. Using a mock client for now.");
  client = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signUp: async () => ({ error: new Error("Please configure Supabase credentials in .env") }),
      signInWithPassword: async () => ({ error: new Error("Please configure Supabase credentials in .env") }),
      signOut: async () => ({ error: null }),
    }
  };
} else {
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export async function signInWithGoogle() {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}

export const supabase = client;
