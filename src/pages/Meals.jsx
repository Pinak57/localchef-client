import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MealCard from "../components/MealCard";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMeals, setTotalMeals] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  const mealsPerPage = 6;
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Fetch meals
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(
          `/meals?page=${currentPage}&limit=${mealsPerPage}&search=${search}`
        );
        setMeals(res.data.meals || []);
        setTotalMeals(res.data.totalMeals || 0);
      } catch (err) {
        console.error("Error fetching meals:", err);
        toast.error("Failed to load meals");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [currentPage, search, axiosSecure]);

  const totalPages = Math.ceil(totalMeals / mealsPerPage);

  // ✅ Sort meals by price
  const handleSort = () => {
    const sorted = [...meals].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
    setMeals(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // ✅ Handle See Details
  const handleSeeDetails = (mealId) => {
    if (user) {
      navigate(`/meals/${mealId}`);
    } else {
      toast.error("Please login to view details");
      navigate("/login");
    }
  };

  if (loading) return <LoadingSpinner message="Loading meals..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-orange-600">
        🍴 All Meals
      </h2>

      {/* ✅ Search & Sort */}
      <div className="flex justify-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="input input-bordered w-full max-w-md"
        />
        <button
          onClick={handleSort}
          className="btn bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700 transition"
        >
          Sort by Price ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
      </div>

      {/* ✅ Meals Grid */}
      {meals.length === 0 ? (
        <p className="text-center text-gray-600">No meals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard
              key={meal._id}
              meal={meal}
              onSeeDetails={() => handleSeeDetails(meal._id)}
            />
          ))}
        </div>
      )}

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn btn-sm ${
                  currentPage === i + 1
                    ? "btn-primary text-white"
                    : "btn-outline"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Meals;
