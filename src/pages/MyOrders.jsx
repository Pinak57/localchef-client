import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch my orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosSecure.get("/orders/my-orders");
        setOrders(res.data.orders || []); // ✅ backend returns { success, orders }
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axiosSecure]);

  // ✅ Cancel order
  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const res = await axiosSecure.put(`/orders/${id}/cancel`);
      if (res.data.success && res.data.modifiedCount > 0) {
        toast.success("Order cancelled successfully!");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, orderStatus: "cancelled" } : order
          )
        );
      } else {
        toast.error(res.data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Handle Payment
  const handlePay = async (id) => {
    try {
      const res = await axiosSecure.post("/create-payment-intent", { orderId: id });
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl; // ✅ redirect to Stripe Checkout
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading your orders..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        🛒 My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="card bg-white shadow-md hover:shadow-lg transition rounded-lg"
            >
              <div className="card-body">
                <h3 className="card-title">{order.mealName}</h3>
                <p className="text-gray-600">👨‍🍳 Chef: {order.chefName}</p>
                <p className="text-gray-600">Chef ID: {order.chefId}</p>
                <p className="text-gray-600">Quantity: {order.quantity || 1}</p>
                <p className="text-gray-600">Price: ৳{order.price}</p>
                <p className="text-gray-600">
                  Order Time:{" "}
                  {order.orderTime
                    ? new Date(order.orderTime).toLocaleString()
                    : "N/A"}
                </p>
                <p className="text-gray-600">
                  Address: {order.userAddress || "Not provided"}
                </p>
                <p className="text-gray-600">
                  Payment: {order.paymentStatus || "Pending"}
                </p>
                <p
                  className={`font-semibold ${
                    order.orderStatus === "pending"
                      ? "text-yellow-600"
                      : order.orderStatus === "accepted"
                      ? "text-blue-600"
                      : order.orderStatus === "delivered"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {order.orderStatus}
                </p>

                {/* ✅ Cancel Button */}
                {order.orderStatus === "pending" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="btn btn-error btn-sm mt-4 text-white"
                  >
                    Cancel
                  </button>
                )}

                {/* ✅ Pay Button */}
                {order.orderStatus === "accepted" &&
                  order.paymentStatus === "Pending" && (
                    <button
                      onClick={() => handlePay(order._id)}
                      className="btn btn-success btn-sm mt-4 text-white"
                    >
                      Pay Now
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
