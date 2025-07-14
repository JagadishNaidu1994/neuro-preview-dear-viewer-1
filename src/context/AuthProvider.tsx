import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        // Handle refresh token errors by clearing the session
        if (error && (
          error.message?.includes('Refresh Token Not Found') ||
          error.message?.includes('invalid_grant') ||
          error.message?.includes('refresh_token_not_found')
        )) {
          console.log('🔄 Clearing invalid session due to refresh token error');
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error('🔴 Auth initialization error:', err);
        // Clear any potentially corrupted session
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // ✅ Sync Google user metadata to users table
      if (session?.user) {
        const { id, email, user_metadata } = session.user;

        let first_name = user_metadata?.given_name || "";
        let last_name = user_metadata?.family_name || "";

        // Fallback if only full_name is provided
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
