// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Estas variables vienen de tu .env
const supabaseUrl = import.meta.env.SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.SUPABASE_SERVICE_ROLE as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
