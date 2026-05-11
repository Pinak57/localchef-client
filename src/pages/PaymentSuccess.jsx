import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="font-display text-4xl font-bold text-dark mb-3">Payment Successful!</h1>
        <p className="text-gray-500 text-lg mb-8">Your payment was processed successfully. Enjoy your meal!</p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard/my-orders" className="btn btn-primary text-white px-8 rounded-xl">View My Orders</Link>
          <Link to="/meals" className="btn btn-outline btn-primary px-8 rounded-xl">Order More</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
