import { useEffect, useState } from "react";
import axiosInstance from "../../hooks/useAxios";
import { FiClock, FiDollarSign } from "react-icons/fi";

const statusColor = {
  pending: "badge-warning",
  accepted: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-error",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Orders | Dashboard";
    axiosInstance.get("/user/orders")
      .then((res) => setOrders(res.data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🛒</div>
          <p>No orders yet. Go explore some meals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-display font-bold text-dark text-lg">{order.mealName}</h3>
                <span className={`badge ${statusColor[order.orderStatus] || "badge-ghost"} text-white capitalize`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                <div><span className="font-medium text-dark">Price:</span> ৳{order.price}</div>
                <div><span className="font-medium text-dark">Qty:</span> {order.quantity}</div>
                <div><span className="font-medium text-dark">Chef:</span> {order.chefName || "N/A"}</div>
                <div><span className="font-medium text-dark">Chef ID:</span> {order.chefId}</div>
                <div className="col-span-2 flex items-center gap-1">
                  <FiClock size={13} />
                  <span>{new Date(order.orderTime).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`badge ${order.paymentStatus === "paid" ? "badge-success" : "badge-warning"} text-white text-xs`}>
                  Payment: {order.paymentStatus}
                </span>

                {/* Pay button: only when accepted and not paid */}
                {order.orderStatus === "accepted" && order.paymentStatus !== "paid" && (
                  <button
                    onClick={() => alert("Stripe payment coming soon!")}
                    className="btn btn-primary btn-sm text-white rounded-xl"
                  >
                    💳 Pay Now
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
