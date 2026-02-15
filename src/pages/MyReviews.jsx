import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import toast from "react-hot-toast";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [updatedRating, setUpdatedRating] = useState(0);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch my reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosSecure.get("/reviews/my-reviews");
        setReviews(res.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load your reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [axiosSecure]);

  // ✅ Delete review
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const res = await axiosSecure.delete(`/reviews/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("Review deleted successfully!");
        setReviews(reviews.filter((review) => review._id !== id));
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Open update modal
  const handleUpdate = (review) => {
    setEditingReview(review);
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  };

  // ✅ Submit updated review
  const handleUpdateSubmit = async () => {
    try {
      const res = await axiosSecure.put(`/reviews/${editingReview._id}`, {
        comment: updatedComment,
        rating: updatedRating,
      });
      if (res.data.modifiedCount > 0) {
        toast.success("Review updated successfully!");
        setReviews(
          reviews.map((r) =>
            r._id === editingReview._id
              ? { ...r, comment: updatedComment, rating: updatedRating }
              : r
          )
        );
        setEditingReview(null);
      } else {
        toast.error("Failed to update review");
      }
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading your reviews..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        ⭐ My Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t written any reviews yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="card bg-white shadow-md hover:shadow-lg transition rounded-lg"
            >
              <div className="card-body">
                <h3 className="card-title">{review.mealName}</h3>
                <p className="text-gray-600">Meal ID: {review.mealId}</p>
                <p className="text-gray-600">Rating: ⭐ {review.rating}</p>
                <p className="text-gray-600">Comment: {review.comment}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(review.date).toLocaleString()}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUpdate(review)}
                    className="btn btn-primary btn-sm text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
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

      {/* ✅ Update Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Review</h3>
            <label className="block mb-2">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={updatedRating}
              onChange={(e) => setUpdatedRating(parseInt(e.target.value))}
              className="input input-bordered w-full mb-4"
            />
            <label className="block mb-2">Comment</label>
            <textarea
              value={updatedComment}
              onChange={(e) => setUpdatedComment(e.target.value)}
              className="textarea textarea-bordered w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleUpdateSubmit}
                className="btn btn-success text-white"
              >
                Save
              </button>
              <button
                onClick={() => setEditingReview(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
