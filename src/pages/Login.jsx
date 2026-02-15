import { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthContext"; // ✅ global context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const axiosSecure = useAxiosSecure();
  const { setUser } = useContext(AuthContext); // ✅ context setter

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // ✅ Fetch user profile from backend (MongoDB)
      const { data } = await axiosSecure.post("/auth/login", {
        email: userCredential.user.email,
      });

      if (data.success) {
        // ✅ Save user profile in context
        setUser(data.user);

        toast.success("Login successful!");
        navigate(from, { replace: true });
      } else {
        toast.error("User profile not found in database.");
      }
    } catch (err) {
      console.error("Login error:", err);

      // ✅ Handle Firebase specific errors
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email. Please register.");
        navigate("/register");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password. Try again.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else {
        toast.error(err.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-orange-600 font-semibold">
            Register
          </Link>
        </p>

        <p className="text-center text-sm mt-2">
          Forgot your password?{" "}
          <Link to="/reset-password" className="text-blue-600 font-semibold">
            Reset
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
