import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FiMenu } from "react-icons/fi";

const getDashboardPath = (role) => {
  if (role === "admin") return "/dashboard/admin-profile";
  if (role === "chef") return "/dashboard/chef-profile";
  return "/dashboard/my-profile";
};

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = getDashboardPath(dbUser?.role);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "hover:text-primary transition-colors";

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/meals" className={linkClass}>
          Meals
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to={dashboardPath} className={linkClass}>
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className="navbar bg-white shadow-sm sticky top-0 z-50 px-4 lg:px-10">
      {/* Logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <FiMenu className="text-2xl" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-lg bg-white rounded-2xl w-52 gap-1"
          >
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🍽️</span>
          <span className="font-display font-bold text-xl text-dark">
            Local<span className="text-primary">Chef</span>Bazaar
          </span>
        </Link>
      </div>

      {/* Center Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1 font-medium text-dark">
          {navLinks}
        </ul>
      </div>

      {/* Auth */}
      <div className="navbar-end gap-3">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-1">
                <img
                  src={user?.photoURL || "https://i.pravatar.cc/40"}
                  alt={user?.displayName}
                  referrerPolicy="no-referrer"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-50 p-3 shadow-lg bg-white rounded-2xl w-52 gap-1"
            >
              <li className="px-3 py-1 text-sm text-gray-600 font-semibold">
                {user?.displayName}
              </li>
              <li className="px-3 pb-1 text-xs text-primary capitalize font-medium">
                {dbUser?.role}
              </li>
              <div className="divider my-0"></div>
              <li>
                <Link to={dashboardPath}>Dashboard</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-ghost btn-sm font-medium text-dark"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-primary btn-sm text-white font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
