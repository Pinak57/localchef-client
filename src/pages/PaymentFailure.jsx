import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PaymentFailure = () => {
  const location = useLocation();

  // ✅ যদি query params থাকে (যেমন transactionId বা error message)
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get("transactionId");
  const errorMessage = queryParams.get("error");

  useEffect(() => {
    toast.error("Payment failed. Please try again.");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          ❌ Payment Failed
        </h2>
        <p className="text-gray-700 mb-2">
          Unfortunately, your payment could not be processed.
        </p>

        {transactionId && (
          <p className="text-sm text-gray-500 mb-2">
            Transaction ID: <span className="font-semibold">{transactionId}</span>
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-gray-500 mb-4">
            Reason: <span className="font-semibold">{errorMessage}</span>
          </p>
        )}

        <Link
          to="/checkout"
          className="btn btn-primary w-full text-white mt-4"
        >
          Try Again
        </Link>
        <Link
          to="/"
          className="btn btn-outline w-full mt-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;
