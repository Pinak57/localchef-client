const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Message */}
        <p className="mt-4 text-gray-600 text-base md:text-lg font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
