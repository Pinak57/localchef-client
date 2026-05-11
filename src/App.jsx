import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const pageTitles = {
  "/": "Home | LocalChefBazaar",
  "/meals": "Meals | LocalChefBazaar",
  "/login": "Login | LocalChefBazaar",
  "/register": "Register | LocalChefBazaar",
  "/payment-success": "Payment Success | LocalChefBazaar",
};

const App = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = pageTitles[location.pathname] || "LocalChefBazaar";
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-light font-body">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
