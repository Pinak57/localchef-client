import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const RoleRoute = ({ children, allowedRoles }) => {
  const { dbUser, loading, user } = useAuth();

  // ✅ Wait for both firebase user AND dbUser to load
  if (loading || (user && !dbUser)) return <LoadingSpinner />;

  if (!dbUser || !allowedRoles.includes(dbUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;