// src/context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const init = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);

    // 🔁 Automatically sync Google user profile to users table
    if (session?.user) {
      const { id, email, user_metadata } = session.user;

      let first_name = user_metadata?.given_name || "";
      let last_name = user_metadata?.family_name || "";

      // Fallback if Google only provides full name
      if ((!first_name || !last_name) && user_metadata?.full_name) {
        const [first, ...rest] = user_metadata.full_name.split(" ");
        first_name ||= first;
        last_name ||= rest.join(" ");
      }

      const { error } = await supabase
        .from("users")
        .upsert(
          [
            {
              id,
              email,
              first_name,
              last_name,
              created_at: new Date().toISOString(),
            },
          ],
          { onConflict: "id" }
        );

      if (error) {
        console.error("🔴 Failed to upsert Google profile:", error.message);
      } else {
        console.log("✅ Google profile synced to users table");
      }
    }
  };

  init();

  const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => {
    listener?.subscription.unsubscribe();
  };
}, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
