// import { useEffect } from "react";
// // import { useAuth } from "../../context/AuthContext";
// import useAuth from "../hooks/useAuth";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ this now works

const ChefProfile = () => {
  const { dbUser } = useAuth();

  useEffect(() => { document.title = "Chef Profile | Dashboard"; }, []);

  if (!dbUser) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-dark mb-8">Chef Profile</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={dbUser.profileImage || "https://i.pravatar.cc/100"} alt={dbUser.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary ring-offset-2 mb-4" />
          <h2 className="font-display text-2xl font-bold text-dark">{dbUser.name}</h2>
          <p className="text-gray-500 text-sm">{dbUser.email}</p>
          <span className="badge badge-success text-white mt-2">👨‍🍳 Chef</span>
        </div>
        <div className="space-y-3 text-sm">
          {[
            ["📍 Address", dbUser.address || "Not provided"],
            ["🆔 Chef ID", dbUser.chefId],
            ["✅ Status", dbUser.status],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-dark">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;
