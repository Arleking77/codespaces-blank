import { createClient } from '@supabase/supabase-client';

// Intenta leer desde el entorno de producción (Vercel) o usa las credenciales fijas como respaldo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://soowpphfhmniqwahzpc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BGSXgbJkkh7OGcHknTfidQ_wYOO45hj';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las credenciales de conexión con Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);