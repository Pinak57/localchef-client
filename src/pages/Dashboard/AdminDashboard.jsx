import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext"; // ✅ path ঠিক করা

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // ✅ Fetch all users, orders, and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, statsRes] = await Promise.all([
          axiosSecure.get("/admin/users"),   // ✅ admin-specific endpoint
          axiosSecure.get("/admin/orders"),  // ✅ admin-specific endpoint
          axiosSecure.get("/admin/stats"),
        ]);
        setUsers(usersRes.data || []);
        setOrders(ordersRes.data || []);
        setStats(statsRes.data || {});
      } catch (err) {
        console.error("Error fetching admin dashboard:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-600">
        Admin Dashboard
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
            <p className="font-semibold text-lg">{user?.name || "Admin"}</p>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">Role: {user?.role}</p>
          </div>
        </div>
      </section>

      {/* ✅ Manage Users */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{u.name || "N/A"}</td>
                    <td className="py-2 px-4">{u.email || "N/A"}</td>
                    <td className="py-2 px-4 capitalize">{u.role || "user"}</td>
                    <td className="py-2 px-4 capitalize">{u.status || "active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ✅ Manage Orders */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Manage Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Meal</th>
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{order.mealName}</td>
                    <td className="py-2 px-4">{order.userEmail}</td>
                    <td className="py-2 px-4 capitalize">{order.orderStatus}</td>
                    <td className="py-2 px-4 capitalize">{order.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ✅ Platform Statistics */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Platform Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg shadow p-4 text-center">
            <p className="text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-orange-600">{stats.totalUsers || 0}</p>
          </div>
          <div className="border rounded-lg shadow p-4 text-center">
            <p className="text-gray-600">Total Meals</p>
            <p className="text-2xl font-bold text-orange-600">{stats.totalMeals || 0}</p>
          </div>
          <div className="border rounded-lg shadow p-4 text-center">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-orange-600">{stats.totalOrders || 0}</p>
          </div>
          <div className="border rounded-lg shadow p-4 text-center">
            <p className="text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-orange-600">৳{stats.revenue || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
