import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth(); // If they want to logout from here

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Correctly handle the response whether it's wrapped in 'message' or direct
        const userData = res.data.message || res.data;
        setProfile(userData);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-sm border border-red-100 flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p className="font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Extract initial for avatar
  const displayName = profile.name || profile.username || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-center space-x-5">
                {/* Avatar Placeholder */}
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                  <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                    {initial}
                  </div>
                </div>
                <div className="pt-14">
                  <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                  <p className="text-gray-500 font-medium flex items-center mt-1">
                    <span className="material-symbols-outlined text-sm mr-1">badge</span>
                    {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Customer"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm text-indigo-500 mr-4">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
                    <p className="text-gray-900 font-medium">{displayName}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm text-indigo-500 mr-4">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>
                </div>
              </div>

              {/* Account Actions summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Status</h3>
                
                <div className="flex items-center p-3 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm text-green-500 mr-4">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div>
                    <p className="text-green-800 font-semibold">Active Account</p>
                    <p className="text-sm text-green-600">Your account is fully verified</p>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium mt-4"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
