import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const MyMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch my meals
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axiosSecure.get("/meals/my-meals");
        setMeals(res.data || []);
      } catch (err) {
        console.error("Error fetching meals:", err);
        toast.error("Failed to load your meals");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [axiosSecure]);

  // ✅ Delete meal
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this meal?");
    if (!confirmDelete) return;

    try {
      const res = await axiosSecure.delete(`/meals/${id}`);
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

  // ✅ Update meal
  const handleUpdate = (id) => {
    navigate(`/update-meal/${id}`);
  };

  if (loading) return <LoadingSpinner message="Loading your meals..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        👨‍🍳 My Meals
      </h2>

      {meals.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t created any meals yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="card bg-white shadow-md hover:shadow-lg transition rounded-lg"
            >
              <figure>
                <img
                  src={meal.foodImage || meal.image || "https://via.placeholder.com/400x250"}
                  alt={meal.foodName}
                  className="rounded-t-lg w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{meal.foodName}</h3>
                <p className="text-gray-600">👨‍🍳 Chef: {meal.chefName}</p>
                <p className="text-gray-600">Chef ID: {meal.chefId}</p>
                <p className="text-gray-600">
                  Ingredients:{" "}
                  {Array.isArray(meal.ingredients)
                    ? meal.ingredients.join(", ")
                    : meal.ingredients}
                </p>
                <p className="text-gray-600">
                  Delivery Time: {meal.estimatedDeliveryTime || meal.deliveryTime}
                </p>
                <p className="text-gray-600">Rating: ⭐ {meal.rating}</p>
                <p className="font-semibold text-orange-600">৳{meal.price}</p>

                {/* ✅ Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUpdate(meal._id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="btn btn-error btn-sm text-white"
                  >
                    Delete
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

export default MyMeals;
