
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // First ensure user exists in users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email")
          .eq("id", user.id)
          .single();

        if (userError && userError.code === 'PGRST116') {
          // User doesn't exist, create them
          const { error: insertError } = await supabase
            .from("users")
            .upsert({
              id: user.id,
              email: user.email || '',
              first_name: user.user_metadata?.given_name || user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.family_name || user.user_metadata?.last_name || '',
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error("Error creating user:", insertError);
            setIsAdmin(false);
            setLoading(false);
            return;
          }
        }

        // Now check admin status - RLS policies are fixed so this should work
        const { data, error } = await supabase
          .from("admin_users")
          .select("role, user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
