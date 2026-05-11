import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiStar, FiClock, FiMapPin, FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const MyMeals = () => {
  const { dbUser } = useAuth();
  const [meals, setMeals]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editMeal, setEditMeal] = useState(null);

  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm();

  // ✅ Declare BEFORE useEffect
  function fetchMeals() {
    setLoading(true);
    axiosInstance.get("/chef/meals")
      .then((res) => setMeals(res.data.meals || []))
      .catch(() => toast.error("Failed to fetch meals"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "My Meals | Dashboard";
    fetchMeals();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Meal?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/meals/${id}`);
        toast.success("Meal deleted successfully!");
        fetchMeals();
      } catch {
        toast.error("Failed to delete meal");
      }
    }
  };

  const openEdit = (meal) => {
    setEditMeal(meal);
    setValue("foodName",              meal.foodName);
    setValue("price",                 meal.price);
    setValue("estimatedDeliveryTime", meal.estimatedDeliveryTime);
    setValue("deliveryArea",          meal.deliveryArea);
    setValue("chefExperience",        meal.chefExperience);
    setValue("foodImage",             meal.foodImage);
    // ✅ Handle both array and string ingredients
    setValue("ingredients",
      Array.isArray(meal.ingredients)
        ? meal.ingredients.join(", ")
        : meal.ingredients || ""
    );
    document.getElementById("meal_edit_modal").showModal();
  };

  const onUpdate = async (data) => {
    try {
      await axiosInstance.put(`/meals/${editMeal._id}`, {
        foodName:              data.foodName,
        price:                 parseFloat(data.price),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        deliveryArea:          data.deliveryArea,
        chefExperience:        data.chefExperience,
        foodImage:             data.foodImage,
        // ✅ Always save as array
        ingredients:           data.ingredients.split(",").map((i) => i.trim()).filter(Boolean),
      });
      toast.success("Meal updated successfully!");
      document.getElementById("meal_edit_modal").close();
      fetchMeals();
    } catch {
      toast.error("Failed to update meal");
    }
  };

  // ── Loading ───────────────────────────────────
  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="loader"></div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark">My Meals</h1>
          <p className="text-gray-500 text-sm mt-1">
            {meals.length} meal{meals.length !== 1 ? "s" : ""} · Chef ID:
            <span className="text-primary font-semibold ml-1">{dbUser?.chefId || "N/A"}</span>
          </p>
        </div>
        <Link to="/dashboard/create-meal" className="btn btn-primary text-white rounded-xl gap-2">
          <FiPlusCircle /> Add Meal
        </Link>
      </div>

      {/* ── Empty State ──────────────────────────── */}
      {meals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <div className="text-7xl mb-4">🍳</div>
          <h3 className="font-display text-xl font-bold text-dark mb-2">No meals yet!</h3>
          <p className="text-gray-400 text-sm mb-6">Start adding meals for customers to order.</p>
          <Link to="/dashboard/create-meal" className="btn btn-primary text-white rounded-xl gap-2">
            <FiPlusCircle /> Create First Meal
          </Link>
        </div>
      ) : (
        /* ── Meals Grid ────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div key={meal._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={meal.foodImage}
                  alt={meal.foodName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-secondary text-dark text-xs font-bold px-2 py-1 rounded-full">
                  ৳{meal.price}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-display font-bold text-dark text-lg mb-2 line-clamp-1">
                  {meal.foodName}
                </h3>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FiStar className="text-yellow-400" fill="currentColor" size={12} />
                    {meal.rating || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="text-primary" size={12} />
                    {meal.estimatedDeliveryTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-primary" size={12} />
                    {meal.deliveryArea}
                  </span>
                </div>

                {/* Ingredients preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(Array.isArray(meal.ingredients)
                    ? meal.ingredients
                    : (meal.ingredients || "").split(",").map(i => i.trim())
                  ).slice(0, 3).map((ing, i) => (
                    <span key={i} className="badge badge-outline badge-success text-xs">{ing}</span>
                  ))}
                  {(meal.ingredients?.length > 3) && (
                    <span className="badge badge-ghost text-xs">+{meal.ingredients.length - 3} more</span>
                  )}
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  Chef ID: <span className="text-primary font-semibold">{meal.chefId}</span>
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(meal)}
                    className="btn btn-sm btn-outline btn-primary flex-1 rounded-xl gap-1"
                  >
                    <FiEdit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="btn btn-sm btn-outline btn-error rounded-xl px-3"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit Modal ───────────────────────────── */}
      <dialog id="meal_edit_modal" className="modal">
        <div className="modal-box rounded-2xl max-w-lg">
          <h3 className="font-display font-bold text-xl text-dark mb-1">Edit Meal</h3>
          <p className="text-gray-400 text-sm mb-5">Update your meal information</p>

          <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label"><span className="label-text font-medium">Food Name</span></label>
                <input type="text" className="input input-bordered w-full focus:input-primary"
                  {...register("foodName", { required: true })} />
              </div>
              <div>
                <label className="label"><span className="label-text font-medium">Price (৳)</span></label>
                <input type="number" className="input input-bordered w-full focus:input-primary"
                  {...register("price", { required: true })} />
              </div>
              <div>
                <label className="label"><span className="label-text font-medium">Delivery Time</span></label>
                <input type="text" className="input input-bordered w-full focus:input-primary"
                  {...register("estimatedDeliveryTime")} />
              </div>
              <div>
                <label className="label"><span className="label-text font-medium">Delivery Area</span></label>
                <input type="text" className="input input-bordered w-full focus:input-primary"
                  {...register("deliveryArea")} />
              </div>
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Food Image URL</span></label>
              <input type="url" className="input input-bordered w-full focus:input-primary"
                {...register("foodImage")} />
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Ingredients (comma separated)</span></label>
              <input type="text" className="input input-bordered w-full focus:input-primary"
                placeholder="Chicken, Rice, Oil"
                {...register("ingredients")} />
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Chef Experience</span></label>
              <input type="text" className="input input-bordered w-full focus:input-primary"
                {...register("chefExperience")} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary text-white flex-1 rounded-xl">
                {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Update Meal"}
              </button>
              <button
                type="button"
                className="btn btn-ghost flex-1 rounded-xl"
                onClick={() => document.getElementById("meal_edit_modal").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
};

export default MyMeals;
