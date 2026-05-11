import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome, FiUser, FiShoppingBag, FiStar, FiHeart,
  FiPlusCircle, FiList, FiClipboard, FiUsers,
  FiBarChart2, FiLogOut, FiMenu, FiX, FiChevronRight
} from "react-icons/fi";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const userLinks = [
  { to: "/dashboard/my-profile",  icon: <FiUser />,       label: "My Profile"     },
  { to: "/dashboard/my-orders",   icon: <FiShoppingBag />, label: "My Orders"      },
  { to: "/dashboard/my-reviews",  icon: <FiStar />,        label: "My Reviews"     },
  { to: "/dashboard/favorites",   icon: <FiHeart />,       label: "Favorite Meals" },
];

const chefLinks = [
  { to: "/dashboard/chef-profile",    icon: <FiUser />,       label: "My Profile"     },
  { to: "/dashboard/create-meal",     icon: <FiPlusCircle />, label: "Create Meal"    },
  { to: "/dashboard/my-meals",        icon: <FiList />,       label: "My Meals"       },
  { to: "/dashboard/order-requests",  icon: <FiClipboard />,  label: "Order Requests" },
];

const adminLinks = [
  { to: "/dashboard/admin-profile",    icon: <FiUser />,      label: "My Profile"       },
  { to: "/dashboard/manage-users",     icon: <FiUsers />,     label: "Manage Users"     },
  { to: "/dashboard/manage-requests",  icon: <FiClipboard />, label: "Manage Requests"  },
  { to: "/dashboard/statistics",       icon: <FiBarChart2 />, label: "Statistics"       },
];

const roleConfig = {
  admin: { label: "Admin",  color: "bg-yellow-400 text-dark",  avatar: "🛡️" },
  chef:  { label: "Chef",   color: "bg-blue-400 text-white",   avatar: "👨‍🍳" },
  user:  { label: "Member", color: "bg-green-400 text-white",  avatar: "👤" },
};

const DashboardLayout = () => {
  const { dbUser, user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Dashboard | LocalChefBazaar";
  }, []);

  if (!dbUser) return <LoadingSpinner />;

  const links     = dbUser.role === "admin" ? adminLinks : dbUser.role === "chef" ? chefLinks : userLinks;
  const config    = roleConfig[dbUser.role] || roleConfig.user;

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Brand ───────────────────────────────── */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 mb-5">
          <span className="text-2xl">🍽️</span>
          <span className="font-display font-bold text-lg text-white">
            Local<span className="text-yellow-400">Chef</span>
          </span>
        </Link>

        {/* User card */}
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/48"}
              alt={dbUser.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/30"
            />
            <span className="absolute -bottom-1 -right-1 text-base">{config.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{dbUser.name}</p>
            <p className="text-white/50 text-xs truncate">{dbUser.email}</p>
            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Nav Links ────────────────────────────── */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="text-base">{icon}</span>
            <span className="flex-1">{label}</span>
            <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom ──────────────────────────────── */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <FiHome /> <span>Back to Home</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Desktop Sidebar ──────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-[#0f2027] via-[#1a3a2a] to-[#14532d] flex-col min-h-screen fixed left-0 top-0 z-40 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ────────────────── */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0f2027] via-[#1a3a2a] to-[#14532d] z-50 shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <FiX size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="lg:ml-64 flex-1 min-h-screen flex flex-col">

        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-sm"
          >
            <FiMenu size={20} />
          </button>
          <span className="font-display font-bold text-dark text-sm">
            Local<span className="text-primary">Chef</span>Bazaar
          </span>
          <img
            src={user?.photoURL || "https://i.pravatar.cc/32"}
            className="w-8 h-8 rounded-full"
            alt=""
          />
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <span>Dashboard</span>
            <FiChevronRight size={12} />
            <span className="text-primary font-medium capitalize">{dbUser.role}</span>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
