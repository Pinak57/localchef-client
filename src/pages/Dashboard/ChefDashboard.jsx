import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const ChefDashboard = () => {
  const [meals, setMeals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // ✅ Fetch meals + requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, requestsRes] = await Promise.all([
          axiosSecure.get("/chef/meals"),        // ✅ chef-specific endpoint
          axiosSecure.get("/chef/orders"),       // ✅ chef-specific endpoint
        ]);
        setMeals(mealsRes.data || []);
        setRequests(requestsRes.data || []);
      } catch (err) {
        console.error("Error fetching chef dashboard:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // ✅ Delete meal
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    try {
      const res = await axiosSecure.delete(`/chef/meals/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("Meal deleted successfully!");
        setMeals(meals.filter((meal) => meal._id !== id));
      } else {
        toast.error("Failed to delete meal");
      }
    } catch (err) {
      console.error("Error deleting meal:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Accept order
  const handleAccept = async (id) => {
    try {
      const res = await axiosSecure.put(`/chef/orders/${id}/accept`);
      if (res.data.modifiedCount > 0) {
        toast.success("Order accepted!");
        setRequests(
          requests.map((req) =>
            req._id === id ? { ...req, orderStatus: "accepted" } : req
          )
        );
      } else {
        toast.error("Failed to accept order");
      }
    } catch (err) {
      console.error("Error accepting order:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Reject order
  const handleReject = async (id) => {
    try {
      const res = await axiosSecure.put(`/chef/orders/${id}/reject`);
      if (res.data.modifiedCount > 0) {
        toast.success("Order rejected!");
        setRequests(
          requests.map((req) =>
            req._id === id ? { ...req, orderStatus: "rejected" } : req
          )
        );
      } else {
        toast.error("Failed to reject order");
      }
    } catch (err) {
      console.error("Error rejecting order:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-600">
        Chef Dashboard
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
            <p className="font-semibold text-lg">{user?.name || "Chef"}</p>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">Role: {user?.role}</p>
          </div>
        </div>
      </section>

      {/* ✅ Add New Meal Button */}
      <div className="flex justify-end mb-6">
        <Link
          to="/create-meal"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          + Add New Meal
        </Link>
      </div>

      {/* ✅ Meals List */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">My Meals</h3>
        {meals.length === 0 ? (
          <p className="text-gray-600">You haven’t added any meals yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
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
                  <p className="text-gray-600 mb-2">৳{meal.price}</p>
                  <div className="flex space-x-2">
                    <Link
                      to={`/update-meal/${meal._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Order Requests Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Order Requests</h3>
        {requests.length === 0 ? (
          <p className="text-gray-600">No order requests yet.</p>
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
                  <p
                    className={`font-semibold ${
                      req.orderStatus === "pending"
                        ? "text-yellow-600"
                        : req.orderStatus === "accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {req.orderStatus}
                  </p>

                  {req.orderStatus === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="btn btn-success btn-sm text-white"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="btn btn-error btn-sm text-white"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChefDashboard;
