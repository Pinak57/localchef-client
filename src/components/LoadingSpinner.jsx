const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light gap-4">
      <div className="loader"></div>
      <p className="text-primary font-display text-lg font-semibold animate-pulse">
        LocalChefBazaar...
      </p>
    </div>
  );
};

export default LoadingSpinner;
