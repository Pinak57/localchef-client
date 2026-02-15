import LoadingSpinner from "../components/LoadingSpinner";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 to-red-500 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* ✅ Spinner */}
        <LoadingSpinner message="Loading..." />

        {/* ✅ Message */}
        <p className="mt-6 text-gray-700 text-base md:text-lg font-semibold text-center">
          Please wait, we’re preparing your experience...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
