import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light text-center px-4">
      <div className="text-8xl mb-4">🍳</div>
      <h1 className="font-display text-5xl font-bold text-dark mb-2">Oops!</h1>
      <p className="text-gray-500 text-lg mb-2">Something went wrong in the kitchen.</p>
      <p className="text-red-400 text-sm mb-8">
        {error?.statusText || error?.message || "Page not found"}
      </p>
      <Link to="/" className="btn btn-primary text-white px-8">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
