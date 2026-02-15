import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const MealDetails = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view meal details");
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ Fetch meal + reviews
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await axiosSecure.get(`/meals/${id}`);
        setMeal(res.data);
      } catch (err) {
        console.error("Error fetching meal details:", err);
        toast.error("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axiosSecure.get(`/reviews/${id}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchMeal();
    fetchReviews();
  }, [id, axiosSecure]);

  // ✅ Submit Review
  const handleReview = async (e) => {
    e.preventDefault();
    const form = e.target;
    const rating = form.rating.value;
    const comment = form.comment.value;

    try {
      const res = await axiosSecure.post("/reviews", {
        foodId: meal._id,
        reviewerName: user.name,
        reviewerImage: user.avatar || "https://via.placeholder.com/50",
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString(),
      });

      if (res.data.insertedId) {
        toast.success("Review submitted successfully!");
        setReviews((prev) => [
          ...prev,
          {
            foodId: meal._id,
            reviewerName: user.name,
            reviewerImage: user.avatar || "https://via.placeholder.com/50",
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString(),
          },
        ]);
        form.reset();
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading meal details..." />;

  if (!meal) return <p className="text-center text-gray-600">Meal not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ✅ Meal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={meal.foodImage || "https://via.placeholder.com/400x250"}
          alt={meal.foodName}
          className="rounded-lg shadow-md w-full h-80 object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">{meal.foodName}</h2>
          <p className="text-gray-600 mb-2">Chef: {meal.chefName}</p>
          <p className="text-gray-600 mb-2">Chef ID: {meal.chefId}</p>
          <p className="text-gray-600 mb-2">Ingredients: {meal.ingredients}</p>
          <p className="text-gray-600 mb-2">Delivery Area: {meal.deliveryArea}</p>
          <p className="text-gray-600 mb-2">Delivery Time: {meal.deliveryTime} mins</p>
          <p className="text-gray-600 mb-2">Chef’s Experience: {meal.chefExperience}</p>
          <p className="text-gray-600 mb-2">Rating: ⭐ {meal.rating}</p>
          <p className="text-orange-600 font-semibold text-xl mb-4">৳{meal.price}</p>
          <button
            onClick={() => navigate(`/order/${meal._id}`)}
            className="btn btn-primary w-full text-white"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* ✅ Review Section */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Reviews</h3>

        {/* Existing Reviews */}
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev, i) => (
              <div key={i} className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={rev.reviewerImage}
                    alt={rev.reviewerName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{rev.reviewerName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(rev.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-yellow-600">⭐ {rev.rating}</p>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Form */}
        <form onSubmit={handleReview} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              name="comment"
              className="textarea textarea-bordered w-full"
              placeholder="Write your review..."
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-secondary w-full text-white">
            Give Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default MealDetails;
