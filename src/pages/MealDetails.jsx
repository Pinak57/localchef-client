import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosInstance from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FiStar, FiHeart, FiClock, FiMapPin } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "https://localchef-server.onrender.com";

// ✅ Helper — always returns an array from ingredients
const parseIngredients = (ingredients) => {
  if (Array.isArray(ingredients)) return ingredients;
  if (typeof ingredients === "string" && ingredients.trim())
    return ingredients.split(",").map((i) => i.trim());
  return [];
};

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function fetchMeal() {
    axios.get(`${API}/meals/${id}`)
      .then((res) => { setMeal(res.data.meal); setLoading(false); })
      .catch(() => setLoading(false));
  }

  function fetchReviews() {
    axios.get(`${API}/reviews/meal/${id}`)
      .then((res) => setReviews(res.data.reviews || []));
  }

  useEffect(() => {
    document.title = "Meal Details | LocalChefBazaar";
    fetchMeal();
    fetchReviews();
  }, [id]);

  const handleAddFavorite = async () => {
    try {
      const res = await axiosInstance.post(`/favorites/${id}`);
      if (res.data.success) toast.success("Added to favorites! ❤️");
      else toast.error(res.data.message || "Already in favorites");
    } catch {
      toast.error("Failed to add to favorites");
    }
  };

  const onSubmitReview = async (data) => {
    try {
      const res = await axiosInstance.post(`/reviews/${id}`, {
        reviewerName: user.displayName,
        reviewerImage: user.photoURL,
        mealName: meal.foodName,
        rating: parseInt(data.rating),
        comment: data.comment,
      });
      if (res.data.success) {
        toast.success("Review submitted successfully!");
        reset();
        fetchReviews();
      }
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loader"></div>
    </div>
  );

  if (!meal) return (
    <div className="text-center py-20 text-gray-400">
      <div className="text-6xl mb-4">🍽️</div>
      <p>Meal not found.</p>
    </div>
  );

  const ingredients = parseIngredients(meal.ingredients);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* ── Meal Info ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg h-80 lg:h-full">
          <img
            src={meal.foodImage}
            alt={meal.foodName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-4xl font-bold text-dark mb-3">{meal.foodName}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-success text-white">⭐ {meal.rating || "N/A"}</span>
            <span className="text-gray-500 text-sm">
              by <strong>{meal.chefName}</strong> (ID: {meal.chefId})
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Price</p>
              <p className="font-bold text-primary text-lg">৳{meal.price}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Delivery Area</p>
              <p className="font-semibold text-dark flex items-center gap-1">
                <FiMapPin size={12} />{meal.deliveryArea || "Dhaka"}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Est. Delivery</p>
              <p className="font-semibold text-dark flex items-center gap-1">
                <FiClock size={12} />{meal.estimatedDeliveryTime || "N/A"}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Chef Experience</p>
              <p className="font-semibold text-dark text-xs">{meal.chefExperience || "N/A"}</p>
            </div>
          </div>

          {/* ✅ Ingredients - fixed, handles both string and array */}
          <div className="mb-5">
            <p className="text-gray-500 text-sm font-medium mb-2">Ingredients:</p>
            <div className="flex flex-wrap gap-2">
              {ingredients.length > 0 ? (
                ingredients.map((ing, i) => (
                  <span key={i} className="badge badge-outline badge-success text-xs">
                    {ing}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs">No ingredients listed</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/order/${id}`)}
              className="btn btn-primary text-white flex-1 rounded-xl"
            >
              Order Now 🛒
            </button>
            <button
              onClick={handleAddFavorite}
              className="btn btn-outline btn-primary rounded-xl px-4"
            >
              <FiHeart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Reviews ──────────────────────────────── */}
      <div>
        <h2 className="font-display text-2xl font-bold text-dark mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm mb-8">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4 mb-10">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={r.reviewerImage || "https://i.pravatar.cc/40"}
                    className="w-9 h-9 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-semibold text-dark text-sm">{r.reviewerName}</p>
                    <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {Array.from({ length: r.rating || 0 }).map((_, i) => (
                      <FiStar key={i} fill="currentColor" size={13} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Form */}
        {user && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
            <h3 className="font-display font-bold text-lg text-dark mb-4">Give a Review</h3>
            <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Rating</span></label>
                <select
                  className="select select-bordered w-full focus:select-primary"
                  {...register("rating", { required: true })}
                >
                  <option value="">Select rating</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{"⭐".repeat(n)} ({n})</option>
                  ))}
                </select>
                {errors.rating && <p className="text-red-400 text-xs mt-1">Rating is required</p>}
              </div>
              <div>
                <label className="label"><span className="label-text">Comment</span></label>
                <textarea
                  className="textarea textarea-bordered w-full focus:textarea-primary"
                  rows={3}
                  placeholder="Share your experience..."
                  {...register("comment", { required: true, minLength: 10 })}
                />
                {errors.comment && (
                  <p className="text-red-400 text-xs mt-1">Comment must be at least 10 characters</p>
                )}
              </div>
              <button type="submit" className="btn btn-primary text-white w-full rounded-xl">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDetails;
