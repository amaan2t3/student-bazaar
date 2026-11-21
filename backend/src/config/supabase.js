import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

// Polyfill WebSocket for Node.js 18
if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocket;
}

const configuredUrl = process.env.SUPABASE_URL;
const configuredAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  configuredUrl &&
  configuredAnonKey &&
  !configuredUrl.includes('your-project') &&
  configuredAnonKey !== 'your-anon-public-key'
);
const supabaseUrl = configuredUrl || 'http://127.0.0.1:54321';
const supabaseAnonKey = configuredAnonKey || 'supabase-not-configured';

if (!isSupabaseConfigured) {
  console.warn('[Supabase] Authentication and protected API routes are disabled until SUPABASE_URL and SUPABASE_ANON_KEY are configured.');
}

// Public client for user-authenticated operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const createSupabaseAuthClient = () => {
  if (!isSupabaseConfigured) throw new Error('Supabase Auth is not configured.');
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const createSupabaseUserClient = (accessToken) => {
  if (!isSupabaseConfigured) throw new Error('Supabase Auth is not configured.');
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
};

export default supabase;
