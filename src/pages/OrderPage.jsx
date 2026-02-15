import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const OrderPage = ({ meal, user }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
//   const { id } = useParams(); // mealId from route

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    const totalPrice = meal.price * quantity;

    // ✅ SweetAlert confirmation
    const result = await Swal.fire({
      title: `Your total price is ৳${totalPrice}`,
      text: "Do you want to confirm the order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const orderData = {
          foodId: meal._id, // MongoDB meal _id
          mealName: meal.mealName,
          price: meal.price,
          quantity,
          chefId: meal.chefId,
          paymentStatus: "Pending",
          userEmail: user.email,
          userAddress: address,
          orderStatus: "pending",
          orderTime: new Date().toISOString(),
        };

        const res = await axiosSecure.post("/orders", orderData);

        if (res.data.insertedId) {
          Swal.fire("Order placed successfully!", "", "success");
          navigate("/dashboard/my-orders");
        } else {
          toast.error("Failed to place order");
        }
      } catch (err) {
        console.error("Order error:", err);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
        Confirm Your Order
      </h2>

      <form
        onSubmit={handleConfirmOrder}
        className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto space-y-4"
      >
        <div>
          <label className="block font-medium">Meal Name</label>
          <input
            type="text"
            value={meal.mealName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block font-medium">Price (৳)</label>
          <input
            type="number"
            value={meal.price}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Delivery Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-white"
          disabled={!address}
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
