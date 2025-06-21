import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bianoepgtibsmgfmzfve.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpYW5vZXBndGlic21nZm16ZnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTkwNDEsImV4cCI6MjA2NjAzNTA0MX0.rN599ZtlKGl3Q0yLCDMqx5mNk59Mxsqhk_cKhFEWLGs";

console.log("🔧 Configuration Supabase:", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyPreview: supabaseAnonKey?.substring(0, 20) + "..."
});

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
