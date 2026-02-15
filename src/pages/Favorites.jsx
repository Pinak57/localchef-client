import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosSecure.get("/favorites"); // ✅ correct endpoint
        setFavorites(res.data.favorites || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [axiosSecure]);

  // ✅ Remove favorite
  const handleRemove = async (mealId) => {
    const confirmRemove = window.confirm("Remove this meal from favorites?");
    if (!confirmRemove) return;

    try {
      const res = await axiosSecure.delete(`/favorites/${mealId}`);
      if (res.data.success) {
        toast.success("Meal removed from favorites successfully!");
        setFavorites((prev) => prev.filter((fav) => fav.mealId !== mealId));
      } else {
        toast.error(res.data.message || "Failed to remove favorite");
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        ❤️ My Favorite Meals
      </h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t added any meals to favorites yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Meal Name</th>
                <th className="py-2 px-4 text-left">Chef Name</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Date Added</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav) => (
                <tr key={fav._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <img
                      src={fav.foodImage || "https://via.placeholder.com/80"}
                      alt={fav.mealName}
                      className="w-20 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4">{fav.mealName}</td>
                  <td className="py-2 px-4">{fav.chefName}</td>
                  <td className="py-2 px-4">৳{fav.price || "N/A"}</td>
                  <td className="py-2 px-4">
                    {fav.addedTime
                      ? new Date(fav.addedTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleRemove(fav.mealId)}
                      className="btn btn-error btn-sm text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Favorites;
