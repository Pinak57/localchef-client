import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedButton = ({ children, onClick, className = "" }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      // ✅ Logged-in হলে action চালু হবে
      onClick && onClick();
    } else {
      // ✅ Logged-in না হলে → Login এ redirect হবে
      toast.error("You must be logged in to continue");
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full md:w-auto px-6 py-2 rounded-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default ProtectedButton;
