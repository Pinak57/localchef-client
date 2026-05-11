import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../hooks/useAxios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiStar } from "react-icons/fi";

const MyReviews = () => {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingReview, setEditing] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  // ✅ function declaration BEFORE useEffect
  function fetchReviews() {
    axiosInstance.get("/user/reviews")
      .then((res) => setReviews(res.data.reviews || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "My Reviews | Dashboard";
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Review?", text: "This action cannot be undone.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#ef4444", confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      await axiosInstance.delete(`/reviews/${id}`);
      toast.success("Review deleted!");
      fetchReviews();
    }
  };

  const openEdit = (review) => {
    setEditing(review);
    setValue("rating", review.rating);
    setValue("comment", review.comment);
    document.getElementById("edit_modal").showModal();
  };

  const onUpdate = async (data) => {
    try {
      await axiosInstance.put(`/reviews/${editingReview._id}`, {
        rating: parseInt(data.rating),
        comment: data.comment,
      });
      toast.success("Review updated!");
      document.getElementById("edit_modal").close();
      fetchReviews();
    } catch {
      toast.error("Failed to update review");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">⭐</div>
          <p>No reviews yet. Order a meal and share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold text-dark">{review.mealName || "Meal"}</h3>
                  <div className="flex text-yellow-400 my-1">
                    {Array.from({ length: review.rating }).map((_, i) => <FiStar key={i} fill="currentColor" size={14} />)}
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(review)} className="btn btn-ghost btn-sm text-primary"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(review._id)} className="btn btn-ghost btn-sm text-red-400"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box rounded-2xl">
          <h3 className="font-display font-bold text-xl text-dark mb-4">Edit Review</h3>
          <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
            <div>
              <label className="label"><span className="label-text">Rating</span></label>
              <select className="select select-bordered w-full" {...register("rating", { required: true })}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{"⭐".repeat(n)} ({n})</option>)}
              </select>
            </div>
            <div>
              <label className="label"><span className="label-text">Comment</span></label>
              <textarea rows={3} className="textarea textarea-bordered w-full" {...register("comment", { required: true })} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary text-white flex-1 rounded-xl">Update</button>
              <button type="button" className="btn btn-ghost flex-1 rounded-xl" onClick={() => document.getElementById("edit_modal").close()}>Cancel</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
};

export default MyReviews;
