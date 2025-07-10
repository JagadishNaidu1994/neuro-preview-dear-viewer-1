
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log("useAdmin - Checking admin status for user:", user?.id, "email:", user?.email);
      
      if (!user) {
        console.log("useAdmin - No user found");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // First check if user exists in users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email")
          .eq("id", user.id)
          .single();

        console.log("useAdmin - User data from users table:", userData, "error:", userError);

        if (userError) {
          console.error("useAdmin - Error fetching user data:", userError);
          // If user doesn't exist in users table, try to create them
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
            console.error("useAdmin - Error creating user:", insertError);
          } else {
            console.log("useAdmin - User created successfully");
          }
        }

        // Now check admin status
        const { data, error } = await supabase
          .from("admin_users")
          .select("role, user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        console.log("useAdmin - Admin check result:", data, "error:", error);

        if (error) {
          console.error("useAdmin - Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!data;
          console.log("useAdmin - Setting admin status to:", adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("useAdmin - Unexpected error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  console.log("useAdmin - Hook returning:", { isAdmin, loading });
  return { isAdmin, loading };
};
