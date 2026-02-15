import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];

const PlatformStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch platform stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/platform-stats");
        setStats(res.data || null);
      } catch (err) {
        console.error("Error fetching platform stats:", err);
        toast.error("Failed to load platform statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner message="Loading platform statistics..." />;

  if (!stats) {
    return <p className="text-center mt-10">No statistics available.</p>;
  }

  // ✅ Prepare chart data
  const orderData = [
    { name: "Pending Orders", value: stats.ordersPending },
    { name: "Delivered Orders", value: stats.ordersDelivered },
  ];

  const revenueData = [
    { name: "Total Revenue", value: stats.totalRevenue },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        📊 Platform Statistics
      </h2>

      {/* ✅ Cards for quick overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold">👥 Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="card bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold">🛒 Orders Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.ordersPending}</p>
        </div>
        <div className="card bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold">✅ Orders Delivered</h3>
          <p className="text-2xl font-bold text-green-600">{stats.ordersDelivered}</p>
        </div>
        <div className="card bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold">💰 Total Revenue</h3>
          <p className="text-2xl font-bold text-orange-600">৳{stats.totalRevenue}</p>
        </div>
      </div>

      {/* ✅ Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Orders Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
