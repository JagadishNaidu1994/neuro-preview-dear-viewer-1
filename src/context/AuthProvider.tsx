import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://bptuqhvcsfgjohguykct.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHVxaHZjc2Znam9oZ3V5a2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Nzc5NTcsImV4cCI6MjA2NjQ1Mzk1N30.YxxoYtnV8kmL55DNz3htu0AcGcf9V3B50HuRgDYyEZM");

export const SupabaseContext = createContext({ session: null, supabase });

export const useSupabase = () => useContext(SupabaseContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data?.session ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};
