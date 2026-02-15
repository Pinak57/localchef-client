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
        const res = await axiosSecure.get("/favorites/my-favorites");
        setFavorites(res.data || []);
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
  const handleRemove = async (id) => {
    const confirmRemove = window.confirm("Remove this meal from favorites?");
    if (!confirmRemove) return;

    try {
      const res = await axiosSecure.delete(`/favorites/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("Meal removed from favorites successfully!");
        setFavorites(favorites.filter((fav) => fav._id !== id));
      } else {
        toast.error("Failed to remove favorite");
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
                  <td className="py-2 px-4">{fav.mealName}</td>
                  <td className="py-2 px-4">{fav.chefName}</td>
                  <td className="py-2 px-4">৳{fav.price || "N/A"}</td>
                  <td className="py-2 px-4">
                    {fav.dateAdded
                      ? new Date(fav.dateAdded).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleRemove(fav._id)}
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
