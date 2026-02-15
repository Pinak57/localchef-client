import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Create axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // ✅ JWT httpOnly cookie attach হবে
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Request Interceptor → সব request এ JSON header attach হবে
    axiosSecure.interceptors.request.use(
      (config) => {
        config.headers["Content-Type"] = "application/json";
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response Interceptor → Unauthorized হলে redirect করবে
    axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Unauthorized → redirect to login
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
