import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure"; // ✅ secure axios hook
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get("/auth/me");
        setUser(res.data.user || null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [axiosSecure]);

  // ✅ Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const avatar = form.avatar.value;

    try {
      const res = await axiosSecure.put("/auth/update", { name, avatar });
      if (res.data.user) {
        setUser(res.data.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  if (!user) {
    return <p className="text-center mt-10">No profile data available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        👤 My Profile
      </h2>

      {/* ✅ Profile Card */}
      <div className="card bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mb-4 shadow-md"
          />
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-2">Role: {user.role}</p>
        </div>
      </div>

      {/* ✅ Update Form */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-2xl font-bold mb-4">Update Profile</h3>
        <form className="space-y-4" onSubmit={handleUpdate}>
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="input input-bordered w-full"
              disabled
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Avatar URL</label>
            <input
              type="text"
              name="avatar"
              defaultValue={user.avatar}
              className="input input-bordered w-full"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full text-white">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
