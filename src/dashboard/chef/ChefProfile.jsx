import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ChefProfile = () => {
  const { dbUser } = useAuth();

  useEffect(() => {
    document.title = "Chef Profile | Dashboard";
  }, []);

  // ✅ Admin Request Function
  const handleRequest = async (type) => {
    const result = await Swal.fire({
      title: "Become an Admin?",
      text: "Your request will be sent to admin for approval.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Send Request",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.post("/requests", {
          requestType: type,
        });

        if (res.data.success) {
          toast.success("Request sent to admin!");
        } else {
          toast.error(res.data.message || "Already sent");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to send request"
        );
      }
    }
  };

  // ✅ Loading State
  if (!dbUser) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <h1 className="font-display text-3xl font-bold text-dark mb-8">
        Chef Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xl">

        {/* Top Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={
              dbUser.profileImage ||
              "https://i.pravatar.cc/100"
            }
            alt={dbUser.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary ring-offset-2 mb-4"
          />

          <h2 className="font-display text-2xl font-bold text-dark">
            {dbUser.name}
          </h2>

          <p className="text-gray-500 text-sm">
            {dbUser.email}
          </p>

          <span className="badge badge-success text-white mt-2">
            👨‍🍳 Chef
          </span>
        </div>

        {/* Info Section */}
        <div className="space-y-3 text-sm">
          {[
            ["📍 Address", dbUser.address || "Not provided"],
            ["🆔 Chef ID", dbUser.chefId || "Not Assigned"],
            ["✅ Status", dbUser.status],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span className="text-gray-500">
                {label}
              </span>

              <span className="font-medium text-dark">
                {value}
              </span>
            </div>
          ))}
        </div>
        {/* Action Button */}
        <div className="mt-8">
          {dbUser.role !== "admin" && (
            <button
              onClick={() => handleRequest("admin")}
              className="btn btn-warning text-dark w-full rounded-xl"
            >
              🛡️ Be an Admin
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default ChefProfile;