import { useEffect, useState } from "react";
import axiosInstance from "../../hooks/useAxios";
import toast from "react-hot-toast";

const statusColor = { pending: "badge-warning", approved: "badge-success", rejected: "badge-error" };

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  // ✅ function declaration BEFORE useEffect
  function fetchRequests() {
    axiosInstance.get("/admin/requests")
      .then((res) => setRequests(res.data.requests || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Manage Requests | Dashboard";
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await axiosInstance.put(`/admin/requests/${id}`, { action });
      toast.success(`Request ${res.data.status}!`);
      fetchRequests();
    } catch { toast.error("Action failed"); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Manage Requests</h1>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table className="table">
          <thead className="bg-green-50 text-dark">
            <tr><th>#</th><th>Name</th><th>Email</th><th>Type</th><th>Status</th><th>Time</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={req._id} className="hover:bg-green-50/50">
                <td className="text-gray-400">{i + 1}</td>
                <td className="font-medium text-dark">{req.userName}</td>
                <td className="text-gray-500 text-sm">{req.userEmail}</td>
                <td><span className="badge badge-outline badge-primary capitalize">{req.requestType}</span></td>
                <td><span className={`badge text-white capitalize ${statusColor[req.requestStatus]}`}>{req.requestStatus}</span></td>
                <td className="text-gray-400 text-xs">{new Date(req.requestTime).toLocaleDateString()}</td>
                <td>
                  {req.requestStatus === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(req._id, "accept")} className="btn btn-success btn-sm text-white rounded-xl">Accept</button>
                      <button onClick={() => handleAction(req._id, "reject")} className="btn btn-error btn-sm text-white rounded-xl">Reject</button>
                    </div>
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

export default ManageRequests;
