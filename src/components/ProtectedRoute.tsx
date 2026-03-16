import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FullPageLoader from "./FullPageLoader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader label="Signing you in..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
