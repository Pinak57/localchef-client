import { useEffect, useState } from "react";
import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";

const statusColor = { pending: "badge-warning", accepted: "badge-info", delivered: "badge-success", cancelled: "badge-error" };

const OrderRequests = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Order Requests | Dashboard";
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axiosInstance.get("/chef/orders")
      .then((res) => setOrders(res.data.orders || []))
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status });
      toast.success(`Order ${status}!`);
      fetchOrders();
    } catch { toast.error("Failed to update status"); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Order Requests</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><div className="text-6xl mb-4">📋</div><p>No orders yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-display font-bold text-dark">{order.mealName}</h3>
                <span className={`badge ${statusColor[order.orderStatus] || "badge-ghost"} text-white capitalize`}>{order.orderStatus}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm text-gray-500 mb-4">
                <div><span className="font-medium text-dark">Price:</span> ৳{order.price}</div>
                <div><span className="font-medium text-dark">Qty:</span> {order.quantity}</div>
                <div><span className="font-medium text-dark">Customer:</span> {order.userEmail}</div>
                <div><span className="font-medium text-dark">Payment:</span> {order.paymentStatus}</div>
                <div className="col-span-2"><span className="font-medium text-dark">Address:</span> {order.userAddress}</div>
                <div className="col-span-2"><span className="font-medium text-dark">Time:</span> {new Date(order.orderTime).toLocaleString()}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(order._id, "cancelled")}
                  disabled={order.orderStatus !== "pending"}
                  className="btn btn-sm btn-error text-white flex-1 rounded-xl disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateStatus(order._id, "accepted")}
                  disabled={order.orderStatus !== "pending"}
                  className="btn btn-sm btn-info text-white flex-1 rounded-xl disabled:opacity-40"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(order._id, "delivered")}
                  disabled={order.orderStatus !== "accepted"}
                  className="btn btn-sm btn-success text-white flex-1 rounded-xl disabled:opacity-40"
                >
                  Deliver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
