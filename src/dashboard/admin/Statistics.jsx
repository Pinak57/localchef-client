import { useEffect, useState } from "react";
import axiosInstance from "../../hooks/useAxios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#16a34a", "#eab308", "#ef4444", "#38bdf8"];

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Statistics | Dashboard";
    axiosInstance.get("/admin/statistics")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;
  if (!stats) return null;

  const barData = [
    { name: "Total Users", value: stats.totalUsers },
    { name: "Pending Orders", value: stats.ordersPending },
    { name: "Delivered Orders", value: stats.ordersDelivered },
  ];

  const pieData = [
    { name: "Pending", value: stats.ordersPending },
    { name: "Delivered", value: stats.ordersDelivered },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Platform Statistics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "bg-green-50 text-primary" },
          { label: "Pending Orders", value: stats.ordersPending, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
          { label: "Delivered Orders", value: stats.ordersDelivered, icon: "✅", color: "bg-blue-50 text-blue-600" },
          { label: "Total Revenue", value: `৳${stats.totalPaymentAmount}`, icon: "💰", color: "bg-purple-50 text-purple-600" },
        ].map((card) => (
          <div key={card.label} className={`${card.color} rounded-2xl p-5 shadow-sm`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <p className="font-display text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-display font-bold text-dark text-lg mb-6">Platform Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-display font-bold text-dark text-lg mb-6">Order Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
