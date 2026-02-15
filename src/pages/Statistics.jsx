import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure"; // ✅ secure axios hook
import toast from "react-hot-toast";

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/admin/statistics");
        setStats(res.data || null);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner message="Loading platform statistics..." />;

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No statistics available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-orange-600">
        📊 Platform Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">Total Meals</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.meals || stats.totalMeals || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.orders || stats.totalOrders || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.users || stats.totalUsers || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">Total Reviews</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.reviews || stats.totalReviews || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
