import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const location = useLocation();

  // ✅ যদি query params থাকে (যেমন transactionId)
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get("transactionId");

  useEffect(() => {
    if (transactionId) {
      toast.success(`Payment completed successfully! Transaction ID: ${transactionId}`);
    } else {
      toast.success("Payment completed successfully!");
    }
  }, [transactionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Payment Successful
        </h2>
        <p className="text-gray-700 mb-2">
          Thank you for your purchase! Your payment has been processed.
        </p>

        {transactionId && (
          <p className="text-sm text-gray-500 mb-4">
            Transaction ID: <span className="font-semibold">{transactionId}</span>
          </p>
        )}

        <Link
          to="/my-orders"
          className="btn btn-primary w-full text-white mt-4"
        >
          View My Orders
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

export default PaymentSuccess;
