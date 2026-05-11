import { useEffect, useState } from "react";
import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiTrash2 } from "react-icons/fi";

const FavoriteMeals = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);

  // ✅ function declaration BEFORE useEffect
  function fetchFavorites() {
    axiosInstance.get("/user/favorites")
      .then((res) => setFavorites(res.data.favorites || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Favorite Meals | Dashboard";
    fetchFavorites();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Remove from Favorites?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Remove",
    });
    if (result.isConfirmed) {
      await axiosInstance.delete(`/favorites/${id}`);
      toast.success("Meal removed from favorites successfully.");
      fetchFavorites();
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Favorite Meals</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">❤️</div>
          <p>No favorites yet. Add meals you love!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
          <table className="table">
            <thead className="bg-green-50 text-dark">
              <tr><th>#</th><th>Meal Name</th><th>Chef Name</th><th>Price</th><th>Date Added</th><th>Action</th></tr>
            </thead>
            <tbody>
              {favorites.map((fav, i) => (
                <tr key={fav._id} className="hover:bg-green-50/50">
                  <td className="text-gray-400">{i + 1}</td>
                  <td className="font-medium text-dark">{fav.mealName}</td>
                  <td className="text-gray-500">{fav.chefName}</td>
                  <td className="font-semibold text-primary">৳{fav.price}</td>
                  <td className="text-gray-400 text-sm">{new Date(fav.addedTime).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(fav._id)} className="btn btn-ghost btn-sm text-red-400 hover:bg-red-50">
                      <FiTrash2 />
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

export default FavoriteMeals;
