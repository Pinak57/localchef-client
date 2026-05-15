import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const MyProfile = () => {
  const { dbUser } = useAuth();

  useEffect(() => { document.title = "My Profile | Dashboard"; }, []);

  const handleRequest = async (type) => {
    const result = await Swal.fire({
      title: `Become a ${type === "chef" ? "Chef" : "Admin"}?`,
      text: "Your request will be sent to admin for approval.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Send Request",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.post("/requests", { requestType: type });
        if (res.data.success) toast.success("Request sent to admin!");
        else toast.error(res.data.message || "Already sent");
      } catch {
        toast.error("Failed to send request");
      }
    }
  };

  if (!dbUser) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">My Profile</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={dbUser.profileImage || "https://i.pravatar.cc/100"} alt={dbUser.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary ring-offset-2 mb-4" />
          <h2 className="font-display text-2xl font-bold text-dark">{dbUser.name}</h2>
          <p className="text-gray-500 text-sm">{dbUser.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="badge badge-success text-white capitalize">{dbUser.role}</span>
            <span className={`badge ${dbUser.status === "active" ? "badge-success" : "badge-error"} text-white`}>{dbUser.status}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {[
            ["📍 Address", dbUser.address || "Not provided"],
            ["👤 Role", dbUser.role],
            ["✅ Status", dbUser.status],
            ...(dbUser.role === "chef" ? [["🆔 Chef ID", dbUser.chefId]] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-dark">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          {dbUser.role !== "chef" && dbUser.role !== "admin" && (
            <button onClick={() => handleRequest("chef")} className="btn btn-primary text-white flex-1 rounded-xl">👨‍🍳 Be a Chef</button>
          )}
          {dbUser.role !== "admin" && (
            <button onClick={() => handleRequest("admin")} className="btn btn-warning text-dark flex-1 rounded-xl">🛡️ Be an Admin</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyProfile;
