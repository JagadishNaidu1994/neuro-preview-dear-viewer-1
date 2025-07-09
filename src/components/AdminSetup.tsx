
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";

const AdminSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setMessage("Please log in first");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('add_current_user_as_admin');
      
      if (error) {
        console.error("Error making user admin:", error);
        setMessage("Error: " + error.message);
      } else {
        setMessage("Successfully added as admin! Please refresh the page.");
      }
    } catch (error) {
      console.error("Error making user admin:", error);
      setMessage("Error making user admin");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 max-w-md">
      <h3 className="font-semibold mb-2">Admin Setup (Development)</h3>
      <p className="text-sm text-gray-600 mb-3">
        Click below to make yourself an admin user.
      </p>
      <Button 
        onClick={makeCurrentUserAdmin} 
        disabled={loading}
        size="sm"
      >
        {loading ? "Processing..." : "Make Me Admin"}
      </Button>
      {message && (
        <p className="text-sm mt-2 text-blue-600">{message}</p>
      )}
    </div>
  );
};

export default AdminSetup;
