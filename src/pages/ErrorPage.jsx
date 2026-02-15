import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-orange-500 to-red-600 text-white px-6">
      {/* ❌ Error Icon */}
      <div className="text-9xl font-extrabold mb-6 drop-shadow-lg">404</div>

      {/* ❌ Error Message */}
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg md:text-xl text-center max-w-md mb-6 opacity-90">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* ✅ Back to Home Button */}
      <Link
        to="/"
        className="btn bg-white text-orange-600 font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
