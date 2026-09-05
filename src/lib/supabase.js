import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

let client;

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.error("Please provide a valid Supabase URL and Anon Key in the .env file. Using a mock client for now.");
  
  const mockResult = { data: null, error: null, count: 0 };
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    upsert: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    contains: () => mockQueryBuilder,
    containedBy: () => mockQueryBuilder,
    range: () => mockQueryBuilder,
    single: async () => mockResult,
    maybeSingle: async () => mockResult,
    limit: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    then: (onfulfilled) => Promise.resolve(mockResult).then(onfulfilled),
    catch: (onrejected) => Promise.resolve(mockResult).catch(onrejected)
  };

  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signUp: async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
      signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => mockQueryBuilder,
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }),
      subscribe: () => ({ unsubscribe: () => { } }),
    }),
    removeChannel: () => { },
    removeAllChannels: () => { },
    rpc: async () => mockResult,
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error("Supabase not configured") }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: async () => ({ data: null, error: new Error("Supabase not configured") }),
      })
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
