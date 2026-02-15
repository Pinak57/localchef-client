import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

const MainLayout = () => {
  const location = useLocation();

  // ✅ Dynamic Title per route
  useEffect(() => {
    const path = location.pathname;
    let title = "LocalChefBazaar";

    if (path === "/") title = "Home | LocalChefBazaar";
    else if (path.startsWith("/meals")) title = "Meals | LocalChefBazaar";
    else if (path.startsWith("/profile")) title = "Profile | LocalChefBazaar";
    else if (path.startsWith("/favorites")) title = "Favorites | LocalChefBazaar";
    else if (path.startsWith("/my-orders")) title = "My Orders | LocalChefBazaar";
    else if (path.startsWith("/my-reviews")) title = "My Reviews | LocalChefBazaar";
    else if (path.startsWith("/my-meals")) title = "My Meals | LocalChefBazaar";
    else if (path.startsWith("/create-meal")) title = "Create Meal | LocalChefBazaar";
    else if (path.startsWith("/order-requests")) title = "Order Requests | LocalChefBazaar";
    else if (path.startsWith("/manage-users")) title = "Manage Users | LocalChefBazaar";
    else if (path.startsWith("/manage-requests")) title = "Manage Requests | LocalChefBazaar";
    else if (path.startsWith("/platform-stats")) title = "Platform Stats | LocalChefBazaar";
    else if (path.startsWith("/login")) title = "Login | LocalChefBazaar";
    else if (path.startsWith("/register")) title = "Register | LocalChefBazaar";

    document.title = title;
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Navbar */}
      <Navbar />

      {/* ✅ Main Content */}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
