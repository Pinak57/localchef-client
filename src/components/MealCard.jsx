import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const MealCard = ({ meal }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  // ✅ See details
  const handleSeeDetails = () => {
    if (user) {
      navigate(`/meals/${meal._id}`);
    } else {
      toast.error("Please login to view details");
      navigate("/login");
    }
  };

 

  return (
    <div className="card bg-white shadow-md hover:shadow-lg transition rounded-lg">
      {/* ✅ Meal Image */}
      <figure>
        <img
          src={meal.foodImage || "https://via.placeholder.com/400x250"}
          alt={meal.foodName}
          className="rounded-t-lg w-full h-48 object-cover"
        />
      </figure>

      {/* ✅ Meal Info */}
      <div className="card-body">
        <h3 className="card-title">{meal.foodName}</h3>
        <p className="text-gray-600">👨‍🍳 Chef: {meal.chefName}</p>
        <p className="text-sm text-gray-500">🆔 Chef ID: {meal.chefId}</p>
        <p className="text-sm text-gray-500">
          📍 Delivery Area: {meal.deliveryArea || "Not specified"}
        </p>
        <p className="text-sm text-gray-500">⭐ Rating: {meal.rating || "N/A"}</p>
        <p className="font-semibold text-orange-600">৳{meal.price}</p>

        {/* ✅ Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSeeDetails}
            className="btn btn-primary btn-sm text-white"
          >
            Details
          </button>
         
          
        </div>
      </div>
    </div>
  );
};

export default MealCard;
