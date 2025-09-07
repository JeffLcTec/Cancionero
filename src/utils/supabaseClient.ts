// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Estas variables vienen de tu .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
