import { Navigate } from "react-router-dom";
import { useSupabase } from "../context/AuthProvider";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session } = useSupabase();

  if (!session) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
