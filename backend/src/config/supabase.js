import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

// Polyfill WebSocket for Node.js 18
if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocket;
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'demo-anon-key';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'demo-service-key';

export const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && 
  process.env.SUPABASE_ANON_KEY && 
  !process.env.SUPABASE_URL.includes('your-project')
);

if (!isSupabaseConfigured) {
  console.log('⚠️ [Supabase] Running in local simulated mode. Set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env for live Supabase connection.');
}

// Public client for user-authenticated operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Admin client with privileged access for backend role management & storage administration
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;
