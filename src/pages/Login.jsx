import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

// ✅ Change these to your actual demo accounts in MongoDB + Firebase
const DEMO_ACCOUNTS = [
  {
    label: "User",
    emoji: "👤",
    email: "tanvir@user.com",
    password: "123456",
    color: "btn-success",
  },
  {
    label: "Chef",
    emoji: "👨‍🍳",
    email: "polash@gmail.com",
    password: "123456",
    color: "btn-info",
  },
  {
    label: "Admin",
    emoji: "🛡️",
    email: "monir@admin.com",
    password: "123456",
    color: "btn-warning",
  },
];
const Login = () => {
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    document.title = "Login | LocalChefBazaar";
  }, []);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  // ── Email/password login ──────────────────────────
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  // ── Google login ──────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Welcome!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Google login failed");
    }
  };

  // ── Demo login (auto-fills + submits) ────────────
  const handleDemoLogin = async (email, password) => {
    setValue("email", email);
    setValue("password", password);
    try {
      await login(email, password);
      toast.success(`Logged in as demo ${email.split("@")[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Demo login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🍽️</span>
            <span className="font-display font-bold text-2xl text-dark">LocalChefBazaar</span>
          </Link>
          <h2 className="font-display text-3xl font-bold text-dark">Welcome Back!</h2>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* ── QUICK DEMO LOGIN ───────────────────── */}
          <div className="mb-6">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              🚀 Quick Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.label}
                  onClick={() => handleDemoLogin(acc.email, acc.password)}
                  className={`btn btn-sm ${acc.color} text-white rounded-xl flex flex-col gap-0 h-auto py-2`}
                >
                  <span className="text-lg">{acc.emoji}</span>
                  <span className="text-xs font-semibold">{acc.label}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              Click any role to auto-login instantly
            </p>
          </div>

          <div className="divider text-gray-300 text-xs">OR LOGIN MANUALLY</div>

          {/* ── GOOGLE LOGIN ───────────────────────── */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full rounded-xl mb-4 gap-2 hover:bg-gray-50 border-gray-300"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="divider text-gray-300 text-xs">OR</div>

          {/* ── EMAIL / PASSWORD FORM ──────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full focus:input-primary"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-white w-full rounded-xl text-base"
            >
              {isSubmitting
                ? <span className="loading loading-spinner loading-sm"></span>
                : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
