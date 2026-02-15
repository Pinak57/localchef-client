import axios from "axios";

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // change to your backend URL
  withCredentials: true,            // send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor: attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // JWT stored in httpOnly cookie, but if you also keep a token in localStorage for fallback:
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Unauthorized, redirecting to login...");
      // Optionally clear token
      localStorage.removeItem("accessToken");
      // Optional redirect
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
