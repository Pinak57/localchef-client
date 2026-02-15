import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UserDashboard from "./Dashboard/UserDashboard";
import ChefDashboard from "./Dashboard/ChefDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  // ✅ Not logged in
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-semibold">Please login to view dashboard</p>
      </div>
    );
  }

  // ✅ Role-based dashboard switch
switch (user?.role) {
  case "admin":
    return <AdminDashboard />;
  case "chef":
    return <ChefDashboard />;
  case "user":
  default:
    return <UserDashboard />;
}

};

export default Dashboard;
