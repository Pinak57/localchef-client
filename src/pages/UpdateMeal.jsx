import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure"; // ✅ secure axios hook
import toast from "react-hot-toast";

const UpdateMeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch meal details
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await axiosSecure.get(`/meals/${id}`);
        setMeal(res.data || null);
      } catch (err) {
        console.error("Error fetching meal:", err);
        toast.error("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id, axiosSecure]);

  // ✅ Update meal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.put(`/meals/${id}`, meal);
      if (res.data.modifiedCount > 0) {
        toast.success("Meal updated successfully!");
        navigate("/my-meals");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Error updating meal:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading meal details..." />;

  if (!meal) {
    return <p className="text-center mt-10">Meal not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
        ✏️ Update Meal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block mb-1 font-medium">Food Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={meal.foodName || ""}
            onChange={(e) => setMeal({ ...meal, foodName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={meal.price || ""}
            onChange={(e) => setMeal({ ...meal, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Ingredients</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={
              Array.isArray(meal.ingredients)
                ? meal.ingredients.join(", ")
                : meal.ingredients || ""
            }
            onChange={(e) =>
              setMeal({ ...meal, ingredients: e.target.value.split(",") })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Delivery Time (mins)</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={meal.deliveryTime || ""}
            onChange={(e) => setMeal({ ...meal, deliveryTime: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full text-white">
          Update Meal
        </button>
      </form>
    </div>
  );
};

export default UpdateMeal;
