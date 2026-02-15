import { useState, useContext } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const CreateMeal = () => {
  const { user } = useContext(AuthContext); // ✅ logged-in user info
  const axiosSecure = useAxiosSecure();

  const [meal, setMeal] = useState({
    foodName: "",
    chefName: "",
    foodImage: null, // ✅ file upload
    price: "",
    rating: 0,
    ingredients: "",
    estimatedDeliveryTime: "",
    chefExperience: "",
    chefId: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  // ✅ Handle file upload
  const handleFileChange = (e) => {
    setMeal({ ...meal, foodImage: e.target.files[0] });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Upload image (example: Cloudinary)
      let imageUrl = "";
      if (meal.foodImage) {
        const formData = new FormData();
        formData.append("file", meal.foodImage);
        formData.append("upload_preset", "your_upload_preset");

        const uploadRes = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      }

      const mealData = {
        foodName: meal.foodName,
        chefName: meal.chefName,
        foodImage: imageUrl,
        price: parseFloat(meal.price),
        rating: parseFloat(meal.rating) || 0,
        ingredients: meal.ingredients.split(",").map((i) => i.trim()),
        estimatedDeliveryTime: meal.estimatedDeliveryTime,
        chefExperience: meal.chefExperience,
        chefId: meal.chefId,
        userEmail: user?.email,
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/meals", mealData);

      if (res.data.insertedId) {
        toast.success("Meal created successfully!");
        setMeal({
          foodName: "",
          chefName: "",
          foodImage: null,
          price: "",
          rating: 0,
          ingredients: "",
          estimatedDeliveryTime: "",
          chefExperience: "",
          chefId: "",
        });
      } else {
        toast.error(res.data.message || "Failed to create meal");
      }
    } catch (err) {
      console.error("Error creating meal:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        🍳 Create New Meal
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto space-y-4"
      >
        <input
          type="text"
          name="foodName"
          value={meal.foodName}
          onChange={handleChange}
          placeholder="Food Name"
          className="input input-bordered w-full"
          required
        />

        <input
          type="text"
          name="chefName"
          value={meal.chefName}
          onChange={handleChange}
          placeholder="Chef Name"
          className="input input-bordered w-full"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
          required
        />

        <input
          type="number"
          name="price"
          value={meal.price}
          onChange={handleChange}
          placeholder="Price (৳)"
          className="input input-bordered w-full"
          required
        />

        <input
          type="number"
          name="rating"
          value={meal.rating}
          onChange={handleChange}
          placeholder="Rating (default 0)"
          className="input input-bordered w-full"
        />

        <textarea
          name="ingredients"
          value={meal.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma separated)"
          className="textarea textarea-bordered w-full"
          required
        />

        <input
          type="text"
          name="estimatedDeliveryTime"
          value={meal.estimatedDeliveryTime}
          onChange={handleChange}
          placeholder="Estimated Delivery Time"
          className="input input-bordered w-full"
          required
        />

        <textarea
          name="chefExperience"
          value={meal.chefExperience}
          onChange={handleChange}
          placeholder="Chef’s Experience"
          className="textarea textarea-bordered w-full"
          required
        />

        <input
          type="text"
          name="chefId"
          value={meal.chefId}
          onChange={handleChange}
          placeholder="Chef ID"
          className="input input-bordered w-full"
          required
        />

        <input
          type="email"
          value={user?.email}
          readOnly
          className="input input-bordered w-full bg-gray-100"
        />

        <button type="submit" className="btn btn-primary w-full">
          Create Meal
        </button>
      </form>
    </div>
  );
};

export default CreateMeal;
