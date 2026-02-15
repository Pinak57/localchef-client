import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // ✅ Fetch user data (orders + favorites)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get("/user/dashboard"); // ✅ user-specific endpoint
        setOrders(res.data.orders || []);
        setFavorites(res.data.favorites || []);
      } catch (err) {
        console.error("Error fetching user dashboard:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-600">
        User Dashboard
      </h2>

      {/* ✅ Profile Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">My Profile</h3>
        <div className="border rounded-lg shadow p-4 flex items-center gap-4">
          <img
            src={user?.avatar || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-lg">{user?.name || "User"}</p>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">{user?.address || "No address provided"}</p>
            <p className="text-gray-600">Role: {user?.role}</p>
          </div>
        </div>
      </section>

      {/* ✅ Orders Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">My Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Meal</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Payment</th>
                  <th className="py-2 px-4 text-left">Order Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{order.mealName}</td>
                    <td className="py-2 px-4">৳{order.price}</td>
                    <td className="py-2 px-4 capitalize">{order.orderStatus}</td>
                    <td className="py-2 px-4 capitalize">
                      {order.paymentStatus || "unpaid"}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(order.orderTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ✅ Favorites Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4">My Favorites</h3>
        {favorites.length === 0 ? (
          <p className="text-gray-600">You haven’t added any favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((meal) => (
              <div
                key={meal._id}
                className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={meal.foodImage || "https://via.placeholder.com/400x250"}
                  alt={meal.mealName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{meal.mealName}</h3>
                  <p className="text-gray-600 mb-2">👨‍🍳 {meal.chefName}</p>
                  <p className="font-bold text-orange-600">৳{meal.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
