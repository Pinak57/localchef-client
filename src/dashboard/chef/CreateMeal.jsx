import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";
import { FiPlusCircle } from "react-icons/fi";

const CreateMeal = () => {
  const { dbUser } = useAuth();
  const [preview, setPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = "Create Meal | Dashboard";
  }, []);

  // Live image preview
  const imageUrl = watch("foodImage");
  useEffect(() => {
    if (imageUrl) setPreview(imageUrl);
  }, [imageUrl]);

  const onSubmit = async (data) => {
    try {
      // ✅ Always use dbUser.chefId from context
      if (!dbUser?.chefId) {
        toast.error("Chef ID not found! Please contact admin.");
        return;
      }

      const meal = {
        foodName:              data.foodName,
        chefName:              data.chefName,
        foodImage:             data.foodImage,
        price:                 parseFloat(data.price),
        rating:                0,
        // ✅ Always save as array
        ingredients:           data.ingredients.split(",").map((i) => i.trim()).filter(Boolean),
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience:        data.chefExperience,
        deliveryArea:          data.deliveryArea,
        chefId:                dbUser.chefId,   // ✅ from dbUser
        userEmail:             dbUser.email,    // ✅ from dbUser
      };

      const res = await axiosInstance.post("/meals", meal);

      if (res.data.success) {
        toast.success("Meal created successfully! 🍽️");
        reset();
        setPreview("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create meal");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-dark">Create New Meal</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new meal to your menu for customers to order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Form ──────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Food Name */}
              <div>
                <label className="label"><span className="label-text font-medium">Food Name *</span></label>
                <input
                  type="text"
                  placeholder="e.g. Chicken Biryani"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("foodName", { required: "Food name is required" })}
                />
                {errors.foodName && <p className="text-red-400 text-xs mt-1">{errors.foodName.message}</p>}
              </div>

              {/* Chef Name */}
              <div>
                <label className="label"><span className="label-text font-medium">Chef Name *</span></label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("chefName", { required: "Chef name is required" })}
                />
                {errors.chefName && <p className="text-red-400 text-xs mt-1">{errors.chefName.message}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="label"><span className="label-text font-medium">Price (৳) *</span></label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="120"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be at least 1" } })}
                />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
              </div>

              {/* Delivery Area */}
              <div>
                <label className="label"><span className="label-text font-medium">Delivery Area *</span></label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Mirpur"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("deliveryArea", { required: "Delivery area is required" })}
                />
                {errors.deliveryArea && <p className="text-red-400 text-xs mt-1">{errors.deliveryArea.message}</p>}
              </div>

              {/* Estimated Delivery Time */}
              <div>
                <label className="label"><span className="label-text font-medium">Estimated Delivery Time *</span></label>
                <input
                  type="text"
                  placeholder="e.g. 30 minutes"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("estimatedDeliveryTime", { required: "Delivery time is required" })}
                />
                {errors.estimatedDeliveryTime && <p className="text-red-400 text-xs mt-1">{errors.estimatedDeliveryTime.message}</p>}
              </div>

              {/* Chef Experience */}
              <div>
                <label className="label"><span className="label-text font-medium">Chef Experience *</span></label>
                <input
                  type="text"
                  placeholder="e.g. 5 years in Bengali cuisine"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("chefExperience", { required: "Chef experience is required" })}
                />
                {errors.chefExperience && <p className="text-red-400 text-xs mt-1">{errors.chefExperience.message}</p>}
              </div>
            </div>

            {/* Food Image URL */}
            <div>
              <label className="label"><span className="label-text font-medium">Food Image URL *</span></label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="input input-bordered w-full focus:input-primary"
                {...register("foodImage", { required: "Food image URL is required" })}
              />
              {errors.foodImage && <p className="text-red-400 text-xs mt-1">{errors.foodImage.message}</p>}
            </div>

            {/* Ingredients */}
            <div>
              <label className="label"><span className="label-text font-medium">Ingredients * <span className="text-gray-400 font-normal">(comma separated)</span></span></label>
              <input
                type="text"
                placeholder="Chicken, Rice, Oil, Spices, Onion"
                className="input input-bordered w-full focus:input-primary"
                {...register("ingredients", { required: "Ingredients are required" })}
              />
              {errors.ingredients && <p className="text-red-400 text-xs mt-1">{errors.ingredients.message}</p>}
              <p className="text-gray-400 text-xs mt-1">Separate each ingredient with a comma</p>
            </div>

            {/* Auto-filled fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label"><span className="label-text font-medium">Chef ID <span className="text-green-500 text-xs">(auto)</span></span></label>
                <input
                  type="text"
                  value={dbUser?.chefId || "Not assigned yet"}
                  readOnly
                  className="input input-bordered w-full bg-green-50 text-primary font-semibold cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label"><span className="label-text font-medium">Your Email <span className="text-green-500 text-xs">(auto)</span></span></label>
                <input
                  type="email"
                  value={dbUser?.email || ""}
                  readOnly
                  className="input input-bordered w-full bg-green-50 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !dbUser?.chefId}
              className="btn btn-primary text-white w-full rounded-xl text-base gap-2"
            >
              {isSubmitting
                ? <span className="loading loading-spinner loading-sm"></span>
                : <><FiPlusCircle /> Create Meal</>
              }
            </button>

            {/* Warning if no chefId */}
            {!dbUser?.chefId && (
              <div className="alert alert-warning rounded-xl text-sm">
                ⚠️ You don't have a Chef ID yet. Please ask admin to approve your chef request first.
              </div>
            )}
          </form>
        </div>

        {/* ── Preview ───────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
            <h3 className="font-display font-bold text-dark text-lg mb-4">Live Preview</h3>

            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              {/* Image */}
              <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" onError={() => setPreview("")} />
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-5xl mb-2">🍽️</div>
                    <p className="text-xs">Image preview</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-display font-bold text-dark truncate">
                  {watch("foodName") || "Meal Name"}
                </p>
                <p className="text-primary font-bold text-lg mt-1">
                  ৳{watch("price") || "0"}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Chef ID: <span className="text-primary font-medium">{dbUser?.chefId || "N/A"}</span>
                </p>
                <p className="text-gray-400 text-xs">
                  Area: {watch("deliveryArea") || "N/A"}
                </p>
              </div>
            </div>

            {/* Chef info card */}
            <div className="mt-4 bg-green-50 rounded-xl p-4 text-sm">
              <p className="font-semibold text-dark mb-1">Your Chef Info</p>
              <p className="text-gray-500 text-xs">Name: {dbUser?.name}</p>
              <p className="text-gray-500 text-xs">Email: {dbUser?.email}</p>
              <p className="text-gray-500 text-xs">
                Chef ID: <span className="text-primary font-bold">{dbUser?.chefId || "Not assigned"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMeal;
