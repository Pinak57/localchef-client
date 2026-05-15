/* eslint-disable react-refresh/only-export-components */

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

// ─── Context ───────────────────────────────
export const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const googleProvider = new GoogleAuthProvider();

// ─── Provider ───────────────────────────────
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Register ─────────────────────────────
  const register = async (name, email, password, profileImage, address) => {
    setLoading(true);

    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(result.user, {
      displayName: name,
      photoURL: profileImage,
    });

    await axios.post(`${API}/auth/register`, {
      name,
      email,
      address,
      profileImage,
    });

    const loginRes = await axios.post(`${API}/auth/login`, { email });
    localStorage.setItem("token", loginRes.data.token);
    setDbUser(loginRes.data.user);

    return result;
  };

  // ── Login ────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);

    const result = await signInWithEmailAndPassword(auth, email, password);

    const loginRes = await axios.post(`${API}/auth/login`, { email });
    localStorage.setItem("token", loginRes.data.token);
    setDbUser(loginRes.data.user);

    return result;
  };

  // ── Google Login ─────────────────────────
  const googleLogin = async () => {
    setLoading(true);

    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;

    try {
      await axios.post(`${API}/auth/register`, {
        name: displayName,
        email,
        profileImage: photoURL,
        address: "",
      });
    } catch {
      // user already exists
    }

    const loginRes = await axios.post(`${API}/auth/login`, { email });
    localStorage.setItem("token", loginRes.data.token);
    setDbUser(loginRes.data.user);

    return result;
  };

  // ── Logout ───────────────────────────────
  const logout = async () => {
    localStorage.removeItem("token");
    setDbUser(null);
    await signOut(auth);
  };

  // ── Refresh User ─────────────────────────
  const refreshUser = async (email) => {
    try {
      if (email) {
        const loginRes = await axios.post(`${API}/auth/login`, {
          email,
        });

        localStorage.setItem("token", loginRes.data.token);
        setDbUser(loginRes.data.user);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const loginRes = await axios.post(`${API}/auth/login`, {
        email: res.data.user.email,
      });

      localStorage.setItem("token", loginRes.data.token);
      setDbUser(loginRes.data.user);
    } catch {
      setDbUser(null);
    }
  };

  // ── Firebase Listener ────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await refreshUser(currentUser.email);
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Context Value ───────────────────────
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

// ─── Hook (same file allowed) ─────────────
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;