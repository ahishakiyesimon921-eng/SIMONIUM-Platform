/**
 * SIMONIUM Platform
 * Supabase Database Connection
 *
 * Provides a centralized connection to the SIMONIUM backend.
 * Authentication and database operations will use this client.
 */

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

/**
 * Check whether the required Supabase environment variables
 * are available.
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return Boolean(url && anonKey);
}

/**
 * Get the shared Supabase client.
 *
 * The client is created only when valid configuration
 * is available.
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL " +
        "and VITE_SUPABASE_ANON_KEY in the environment.",
    );
  }

  supabaseClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseClient;
}
