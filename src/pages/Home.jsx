import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch meals (limit 6 for homepage)
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data } = await axiosSecure.get("/meals?limit=6");
        setMeals(data.meals || []);
      } catch (err) {
        console.error("Error fetching meals:", err);
        toast.error("Failed to load featured meals");
      } finally {
        setLoadingMeals(false);
      }
    };
    fetchMeals();
  }, [axiosSecure]);

  // ✅ Fetch reviews (latest reviews for homepage)
  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const { data } = await axiosSecure.get("/reviews");
      // ✅ শুধু প্রথম 4টা review নাও
      setReviews((data.reviews || []).slice(0, 4));
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load customer reviews");
    } finally {
      setLoadingReviews(false);
    }
  };
  fetchReviews();
}, [axiosSecure]);


  return (
    <div>
      {/* ✅ Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to LocalChefBazaar
        </h1>

        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Discover delicious home-cooked meals prepared by local chefs. Taste
          authenticity, support community.
        </p>

        <div>
          <Link
            to="/meals"
            className="btn bg-white text-orange-600 font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Browse Meals
          </Link>
        </div>
      </section>

      {/* ✅ Featured Meals */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
          🍲 Daily Meals
        </h2>

        {loadingMeals ? (
          <LoadingSpinner message="Loading featured meals..." />
        ) : meals.length === 0 ? (
          <p className="text-center text-gray-600">
            No meals available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={
                    meal.foodImage ||
                    meal.image ||
                    "https://via.placeholder.com/400x250"
                  }
                  alt={meal.foodName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {meal.foodName}
                  </h3>
                  <p className="text-gray-600 mb-2">👨‍🍳 {meal.chefName}</p>
                  <p className="text-orange-600 font-bold mb-4">৳{meal.price}</p>
                  <Link
                    to={`/meals/${meal._id}`}
                    className="btn btn-sm btn-primary text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Customer Reviews */}
      <section className="bg-gray-50 py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
          ⭐ Customer Reviews
        </h2>

        {loadingReviews ? (
          <LoadingSpinner message="Loading reviews..." />
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-600">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
              >
                {/* Reviewer Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={review.reviewerImage || "https://via.placeholder.com/50"}
                    alt={review.reviewerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {review.reviewerName || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 mb-2">"{review.comment}"</p>

                {/* Rating */}
                <p className="text-yellow-600 font-bold">⭐ {review.rating}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Extra Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
          🌟 Why Choose LocalChefBazaar?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Authentic Taste</h3>
            <p className="text-gray-600">
              Enjoy meals prepared with love and traditional recipes.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Support Local Chefs</h3>
            <p className="text-gray-600">
              Every order helps independent chefs grow their business.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Fresh & Healthy</h3>
            <p className="text-gray-600">
              Meals are cooked fresh daily with quality ingredients.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
