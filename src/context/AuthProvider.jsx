import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Login
  const login = async (email) => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data?.user) {
        setUser(data.user); // role সহ user আসবে
        toast.success("Login successful!");
        return { success: true, user: data.user };
      }
      toast.error(data.message || "Login failed");
      return { success: false, message: data.message };
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed");
      return { success: false, message: "Login failed" };
    }
  };

  // ✅ Register
  const register = async (name, email, address, avatar) => {
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          address,
          avatar,
          role: "user", // default role
          status: "active",
        }),
      });
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        toast.success("Registration successful!");
        return { success: true, user: data.user };
      }
      toast.error(data.message || "Registration failed");
      return { success: false, message: data.message };
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Registration failed");
      return { success: false, message: "Registration failed" };
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  // ✅ Check current user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          credentials: "include",
        });
        if (res.status === 401) {
          setUser(null);
          return;
        }
        const data = await res.json();
        if (data?.user) {
          setUser(data.user); // role সহ user আসবে
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const authInfo = {
    user,
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
