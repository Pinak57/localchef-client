import { useEffect, useState } from "react";
import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ function declaration BEFORE useEffect
  function fetchUsers() {
    axiosInstance.get("/admin/users")
      .then((res) => setUsers(res.data.users || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Manage Users | Dashboard";
    fetchUsers();
  }, []);

  const handleFraud = async (id) => {
    const result = await Swal.fire({
      title: "Mark as Fraud?", text: "This user will be restricted.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#ef4444", confirmButtonText: "Yes, Mark Fraud",
    });
    if (result.isConfirmed) {
      await axiosInstance.put(`/admin/users/${id}/fraud`);
      toast.success("User marked as fraud!");
      fetchUsers();
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Manage Users</h1>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table className="table">
          <thead className="bg-green-50 text-dark">
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className="hover:bg-green-50/50">
                <td className="text-gray-400">{i + 1}</td>
                <td className="font-medium text-dark">{u.name}</td>
                <td className="text-gray-500 text-sm">{u.email}</td>
                <td>
                  <span className={`badge text-white capitalize ${u.role === "admin" ? "badge-warning text-dark" : u.role === "chef" ? "badge-info" : "badge-success"}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge text-white ${u.status === "fraud" ? "badge-error" : "badge-success"}`}>{u.status}</span>
                </td>
                <td>
                  {u.role !== "admin" && u.status !== "fraud" && (
                    <button onClick={() => handleFraud(u._id)} className="btn btn-error btn-sm text-white rounded-xl">Mark Fraud</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
