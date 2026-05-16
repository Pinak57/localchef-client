import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosInstance from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_API_URL || "https://localchef-server.onrender.com";

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    document.title = "Order | LocalChefBazaar";
    axios.get(`${API}/meals/${id}`).then((res) => setMeal(res.data.meal));
  }, [id]);

  const totalPrice = meal ? meal.price * quantity : 0;

  const onSubmit = async (data) => {
    const result = await Swal.fire({
      title: "Confirm Order",
      text: `Your total price is ৳${totalPrice}. Do you want to confirm the order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Order!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.post("/orders", {
          foodId: meal._id,
          mealName: meal.foodName,
          price: meal.price,
          quantity: parseInt(data.quantity),
          chefId: meal.chefId,
          chefName: meal.chefName,
          userAddress: data.userAddress,
        });

        if (res.data.success) {
          Swal.fire({ icon: "success", title: "Order Placed!", text: "Your order has been placed successfully!", confirmButtonColor: "#16a34a" });
          navigate("/dashboard/my-orders");
        }
      } catch (err) {
        Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Failed to place order" });
      }
    }
  };

  if (!meal) return (
    <div className="flex justify-center items-center min-h-screen"><div className="loader"></div></div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <span className="text-primary font-semibold text-sm uppercase tracking-widest">Checkout</span>
        <h1 className="font-display text-4xl font-bold text-dark mt-2">Confirm Your Order</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        {/* Meal summary */}
        <div className="flex gap-4 mb-6 p-4 bg-green-50 rounded-xl">
          <img src={meal.foodImage} alt={meal.foodName} className="w-20 h-20 rounded-xl object-cover" />
          <div>
            <h3 className="font-display font-bold text-dark text-lg">{meal.foodName}</h3>
            <p className="text-sm text-gray-500">Chef: {meal.chefName} · ID: {meal.chefId}</p>
            <p className="text-primary font-bold text-lg mt-1">৳{meal.price} / item</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text font-medium">Meal Name</span></label>
              <input value={meal.foodName} readOnly className="input input-bordered w-full bg-gray-50" />
            </div>
            <div>
              <label className="label"><span className="label-text font-medium">Price per item</span></label>
              <input value={`৳${meal.price}`} readOnly className="input input-bordered w-full bg-gray-50" />
            </div>
            <div>
              <label className="label"><span className="label-text font-medium">Chef ID</span></label>
              <input value={meal.chefId} readOnly className="input input-bordered w-full bg-gray-50" />
            </div>
            <div>
              <label className="label"><span className="label-text font-medium">Your Email</span></label>
              <input value={user?.email} readOnly className="input input-bordered w-full bg-gray-50" />
            </div>
          </div>

          {/* ✅ Use onChange instead of watch() to avoid memoization warning */}
          <div>
            <label className="label"><span className="label-text font-medium">Quantity</span></label>
            <input
              type="number"
              min={1}
              max={20}
              className="input input-bordered w-full focus:input-primary"
              {...register("quantity", { required: true, min: 1 })}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          <div>
            <label className="label"><span className="label-text font-medium">Delivery Address</span></label>
            <textarea rows={2} placeholder="Enter your delivery address..." className="textarea textarea-bordered w-full focus:textarea-primary"
              {...register("userAddress", { required: "Address is required" })} />
            {errors.userAddress && <p className="text-red-400 text-xs mt-1">{errors.userAddress.message}</p>}
          </div>

          {/* Total */}
          <div className="bg-yellow-50 rounded-xl p-4 flex justify-between items-center">
            <span className="font-semibold text-dark">Total Price</span>
            <span className="font-display text-2xl font-bold text-primary">৳{totalPrice}</span>
          </div>

          <button type="submit" className="btn btn-primary text-white w-full rounded-xl text-base">
            Confirm Order 🛒
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
