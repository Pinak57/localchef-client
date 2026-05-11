import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const { register: registerUser, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    document.title = "Register | LocalChefBazaar";
  }, []);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Email/password register
  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password, data.profileImage, data.address);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
      toast.success("Account created with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Google signup failed");
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
          <h2 className="font-display text-3xl font-bold text-dark">Create Account</h2>
          <p className="text-gray-500 mt-1">Join thousands of food lovers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            className="btn btn-outline w-full rounded-xl mb-4 gap-2 hover:bg-gray-50 border-gray-300"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="divider text-gray-400 text-sm">OR</div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label"><span className="label-text font-medium">Full Name</span></label>
              <input type="text" placeholder="John Doe"
                className="input input-bordered w-full focus:input-primary"
                {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input type="email" placeholder="you@example.com"
                className="input input-bordered w-full focus:input-primary"
                {...register("email", { required: "Email is required" })} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Profile Image URL</span></label>
              <input type="url" placeholder="https://..."
                className="input input-bordered w-full focus:input-primary"
                {...register("profileImage", { required: "Profile image URL is required" })} />
              {errors.profileImage && <p className="text-red-400 text-xs mt-1">{errors.profileImage.message}</p>}
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Address</span></label>
              <input type="text" placeholder="Your address"
                className="input input-bordered w-full focus:input-primary"
                {...register("address", { required: "Address is required" })} />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <input type="password" placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })} />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Confirm Password</span></label>
              <input type="password" placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (val) =>
                    val === getValues("password") || "Passwords do not match",
                })} />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-white w-full rounded-xl text-base mt-2"
            >
              {isSubmitting
                ? <span className="loading loading-spinner loading-sm"></span>
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
