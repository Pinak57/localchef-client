import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const OrderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch order requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get("/orders/requests");
        setRequests(res.data || []);
      } catch (err) {
        console.error("Error fetching order requests:", err);
        toast.error("Failed to load order requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [axiosSecure]);

  // ✅ Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      const res = await axiosSecure.put(`/orders/${id}/status`, { orderStatus: status });
      if (res.data.modifiedCount > 0) {
        toast.success(`Order ${status} successfully!`);
        setRequests(
          requests.map((req) =>
            req._id === id ? { ...req, orderStatus: status } : req
          )
        );
      } else {
        toast.error("Failed to update order");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading order requests..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        📩 Order Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No order requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="card bg-white shadow-md hover:shadow-lg transition rounded-lg"
            >
              <div className="card-body">
                <h3 className="card-title">{req.mealName}</h3>
                <p className="text-gray-600">Ordered by: {req.userEmail}</p>
                <p className="text-gray-600">Quantity: {req.quantity}</p>
                <p className="text-gray-600">Price: ৳{req.price}</p>
                <p className="text-gray-600">Address: {req.userAddress}</p>
                <p className="text-gray-600">
                  Order Time: {new Date(req.orderTime).toLocaleString()}
                </p>
                <p className="text-gray-600">Payment: {req.paymentStatus}</p>
                <p
                  className={`font-semibold ${
                    req.orderStatus === "pending"
                      ? "text-yellow-600"
                      : req.orderStatus === "accepted"
                      ? "text-blue-600"
                      : req.orderStatus === "delivered"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {req.orderStatus}
                </p>

                {/* ✅ Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateOrderStatus(req._id, "cancelled")}
                    className="btn btn-error btn-sm text-white"
                    disabled={req.orderStatus !== "pending"}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateOrderStatus(req._id, "accepted")}
                    className="btn btn-primary btn-sm text-white"
                    disabled={req.orderStatus !== "pending"}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateOrderStatus(req._id, "delivered")}
                    className="btn btn-success btn-sm text-white"
                    disabled={req.orderStatus !== "accepted"}
                  >
                    Deliver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
