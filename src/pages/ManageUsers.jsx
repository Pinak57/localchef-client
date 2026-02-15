import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  // ✅ Change role
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axiosSecure.put(`/users/${id}/role`, { role: newRole });
      if (res.data.modifiedCount > 0) {
        toast.success(`User role updated to ${newRole}`);
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Make Fraud
  const handleMakeFraud = async (id) => {
    const confirmFraud = window.confirm("Are you sure you want to mark this user as fraud?");
    if (!confirmFraud) return;

    try {
      const res = await axiosSecure.put(`/users/${id}/fraud`);
      if (res.data.modifiedCount > 0) {
        toast.success("User marked as fraud successfully!");
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, status: "fraud" } : user
          )
        );
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await axiosSecure.delete(`/users/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user._id !== id));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        👥 Manage Users
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td
                    className={`capitalize font-semibold ${
                      user.status === "fraud" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {user.status || "active"}
                  </td>
                  <td className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className="btn btn-sm btn-primary text-white"
                    >
                      Make Admin
                    </button>
                    <button
                      onClick={() => handleRoleChange(user._id, "chef")}
                      className="btn btn-sm btn-secondary text-white"
                    >
                      Make Chef
                    </button>
                    {user.role !== "admin" && user.status !== "fraud" && (
                      <button
                        onClick={() => handleMakeFraud(user._id)}
                        className="btn btn-sm btn-warning text-white"
                      >
                        Make Fraud
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
