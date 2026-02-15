import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ChefRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-green-600"></span>
    </div>;
  }

  if (!user || user.role !== "chef") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ChefRoute;
