import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import { FiStar, FiMapPin, FiUser } from "react-icons/fi";

const MealCard = ({ meal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSeeDetails = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/meals/${meal._id}`);
    }
  };

  return (
    <div className="card bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
      <figure className="relative h-48 overflow-hidden">
        <img
          src={meal.foodImage}
          alt={meal.foodName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-secondary text-dark text-xs font-bold px-2 py-1 rounded-full">
          ৳{meal.price}
        </div>
      </figure>

      <div className="card-body p-4">
        <h3 className="font-display font-bold text-lg text-dark line-clamp-1">{meal.foodName}</h3>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FiUser className="text-primary" />
          <span>{meal.chefName}</span>
          <span className="ml-2 text-xs text-gray-400">ID: {meal.chefId}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <FiStar fill="currentColor" />
            <span className="text-dark font-medium">{meal.rating || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FiMapPin className="text-primary" />
            <span>{meal.deliveryArea || "Dhaka"}</span>
          </div>
        </div>

        <button
          onClick={handleSeeDetails}
          className="btn btn-primary btn-sm mt-3 text-white w-full rounded-xl"
        >
          See Details
        </button>
      </div>
    </div>
  );
};

export default MealCard;
