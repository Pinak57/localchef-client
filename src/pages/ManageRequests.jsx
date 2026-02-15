import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axiosSecure.get("/requests");
        setRequests(res.data || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [axiosSecure]);

  // ✅ Approve request
  const handleApprove = async (id, requestType, userEmail) => {
    try {
      const res = await axiosSecure.put(`/requests/${id}/approve`, { requestType, userEmail });
      if (res.data.modifiedCount > 0) {
        toast.success("Request approved!");
        setRequests(
          requests.map((req) =>
            req._id === id ? { ...req, requestStatus: "approved" } : req
          )
        );
      }
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Reject request
  const handleReject = async (id) => {
    try {
      const res = await axiosSecure.put(`/requests/${id}/reject`);
      if (res.data.modifiedCount > 0) {
        toast.error("Request rejected!");
        setRequests(
          requests.map((req) =>
            req._id === id ? { ...req, requestStatus: "rejected" } : req
          )
        );
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <LoadingSpinner message="Loading user requests..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        📝 Manage User Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Request Type</th>
                <th>Status</th>
                <th>Request Time</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.userName}</td>
                  <td>{req.userEmail}</td>
                  <td className="capitalize">{req.requestType}</td>
                  <td
                    className={`font-semibold capitalize ${
                      req.requestStatus === "pending"
                        ? "text-yellow-600"
                        : req.requestStatus === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {req.requestStatus}
                  </td>
                  <td>{new Date(req.requestTime).toLocaleString()}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleApprove(req._id, req.requestType, req.userEmail)}
                      className="btn btn-sm btn-success text-white"
                      disabled={req.requestStatus !== "pending"}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="btn btn-sm btn-error text-white"
                      disabled={req.requestStatus !== "pending"}
                    >
                      Reject
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

export default ManageRequests;
