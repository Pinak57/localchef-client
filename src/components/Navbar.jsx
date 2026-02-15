import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-orange-600 font-semibold" : ""
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/meals"
          className={({ isActive }) =>
            isActive ? "text-orange-600 font-semibold" : ""
          }
        >
          Meals
        </NavLink>
      </li>

      {/* ✅ Dashboard visible only after login */}
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-orange-600 font-semibold" : ""
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-white shadow-md px-4">
      {/* ✅ Left Side */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          LocalChefBazaar
        </Link>
      </div>

      {/* ✅ Right Side */}
      <div className="flex-none flex items-center">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>

        {user ? (
          <>
            {/* ✅ Profile Picture with fallback */}
            <img
              src={user.avatar || "https://i.postimg.cc/vTXMGYpR/pas6.png"}
              alt="profile"
              className="w-8 h-8 rounded-full ml-4 border"
            />
            <button
              onClick={handleLogout}
              className="btn btn-error btn-sm ml-4 text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-primary btn-sm ml-4 text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary btn-sm ml-2 text-white"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
