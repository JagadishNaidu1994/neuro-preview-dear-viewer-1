import { useAuth } from "@/context/AuthProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();

  // ✅ Show nothing while checking auth
  if (loading) return null;

  // ❌ No session? Redirect
  if (!session) {
    return <Navigate to="/" />;
  }

  // ✅ Authenticated, render page
  return children;
};

export default ProtectedRoute;
