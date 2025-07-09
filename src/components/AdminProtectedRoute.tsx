
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AdminProtectedRoute - Auth loading:", authLoading, "Admin loading:", adminLoading);
    console.log("AdminProtectedRoute - User:", user?.id, "IsAdmin:", isAdmin);

    if (!authLoading && !adminLoading) {
      if (!user) {
        console.log("No user, redirecting to home");
        navigate("/");
        return;
      }
      
      if (!isAdmin) {
        console.log("User is not admin, showing access denied");
        // Don't redirect, just show access denied message
      }
    }
  }, [authLoading, adminLoading, user, isAdmin, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F8F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-600">
            If you should have admin access, please use the admin setup on the home page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
