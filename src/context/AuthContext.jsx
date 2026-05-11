import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

// ─── Context ─────────────────────────────────────────
export const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const googleProvider = new GoogleAuthProvider();

// ─── Provider ─────────────────────────────────────────
const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [dbUser, setDbUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Register with email/password ──────────────────
  const register = async (name, email, password, profileImage, address) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name, photoURL: profileImage });

    // Save user to MongoDB
    await axios.post(`${API}/auth/register`, {
      name,
      email,
      address,
      profileImage,
    });

    // Get fresh JWT
    const loginRes = await axios.post(`${API}/auth/login`, { email });
    localStorage.setItem("token", loginRes.data.token);
    setDbUser(loginRes.data.user);

    return result;
  };

  // ── Login with email/password ─────────────────────
  const login = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Get fresh JWT with latest role from DB
    const loginRes = await axios.post(`${API}/auth/login`, { email });
    localStorage.setItem("token", loginRes.data.token);
    setDbUser(loginRes.data.user);

    return result;
  };

  // ── Google Login ──────────────────────────────────
  const googleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;

    // Save to MongoDB if new user (ignore error if already exists)
    try {
      await axios.post(`${API}/auth/register`, {
        name: displayName,
        email,
        profileImage: photoURL,
        address: "",
      });
    } catch {
      // Already exists — fine, continue
    }

    // Get fresh JWT
    const loginRes = await axios.post(`${API}/auth/login`, { email });
    localStorage.setItem("token", loginRes.data.token);
    setDbUser(loginRes.data.user);

    return result;
  };

  // ── Logout ────────────────────────────────────────
  const logout = async () => {
    localStorage.removeItem("token");
    setDbUser(null);
    await signOut(auth);
  };

  // ── Refresh user from DB + get fresh JWT ──────────
  // Called on page reload and after role changes
  const refreshUser = async (email) => {
    try {
      // If email is passed, get a fresh token (after role change)
      if (email) {
        const loginRes = await axios.post(`${API}/auth/login`, { email });
        localStorage.setItem("token", loginRes.data.token);
        setDbUser(loginRes.data.user);
        return;
      }

      // Otherwise just fetch current user info using existing token
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Also refresh JWT so role is always up to date
      const loginRes = await axios.post(`${API}/auth/login`, {
        email: res.data.user.email,
      });
      localStorage.setItem("token", loginRes.data.token);
      setDbUser(loginRes.data.user);

    } catch {
      setDbUser(null);
    }
  };

  // ── Listen to Firebase auth state changes ─────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // ✅ Always refresh JWT on page load so role is fresh
        await refreshUser(currentUser.email);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    dbUser,
    loading,
    register,
    login,
    googleLogin,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── useAuth Hook ─────────────────────────────────────
// ✅ Exported from here so both import styles work:
// import { useAuth } from "../context/AuthContext"
// import useAuth from "../hooks/useAuth"
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
