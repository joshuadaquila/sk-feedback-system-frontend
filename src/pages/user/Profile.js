import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import UserSidebar from "./userSidebar";
import axios from "axios"; // For fetching user data

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    purok: "",
    profilePic: "https://via.placeholder.com/150", // Default placeholder image URL
  });

  const [error, setError] = useState(""); // Add state for error handling

  

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get("http://localhost:3001/user/getProfile", {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the request headers
        }
      });
      setUserData(response.data); // Set the fetched user data in state
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  

  useEffect(() => {
    fetchUserProfile();
  
  }, []); 
  const navigateTo = (page) => {
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="h-[90%] text-black py-2 flex justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl">
      {/* Top Bar */}
      <div className="bg-gray-200 text-black py-4 h-[10%] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl mt-5">
        <h1 className="text-xl font-bold">Profile</h1>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search profile..."
            className="px-4 py-2 rounded-full border border-gray-300 text-black focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20 max-w-screen-sm mx-auto rounded-xl mt-6 px-6">
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
          {/* Profile Picture and Name */}
          {userData.profilePic && (
            <div className="flex flex-col items-center mb-6">
              <img
                src={userData.profilePic}
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover mb-4"
              />
            </div>
          )}

          {/* Divider */}
          <div className="border-t-2 border-gray-300 mb-6"></div>

          {/* Personal Info in Fields */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-lg text-gray-600">First Name</label>
              <input
                type="text"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                value={userData.firstName}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg text-gray-600">Middle Name</label>
              <input
                type="text"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                value={userData.middleName}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg text-gray-600">Last Name</label>
              <input
                type="text"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                value={userData.lastName}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg text-gray-600">Address</label>
              <input
                type="text"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                value={userData.address}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg text-gray-600">Purok</label>
              <input
                type="text"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                value={userData.purok}
                readOnly
              />
            </div>
          </div>

          {/* Log Out Button */}
          <div className="flex items-center justify-center mt-6">
            <button
              className="flex items-center bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <UserSidebar navigateTo={navigateTo} />
    </div>
  );
};

export default UserDashboard;
