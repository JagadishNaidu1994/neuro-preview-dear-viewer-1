import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bptuqhvcsfgjohguykct.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHVxaHZjc2Znam9oZ3V5a2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Nzc5NTcsImV4cCI6MjA2NjQ1Mzk1N30.YxxoYtnV8kmL55DNz3htu0AcGcf9V3B50HuRgDYyEZM'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
