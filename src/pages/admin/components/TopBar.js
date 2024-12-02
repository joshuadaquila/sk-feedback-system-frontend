import React from "react";
import { FaSearch } from "react-icons/fa";
import { FiBell } from "react-icons/fi";

const TopBar = ({ searchQuery, setSearchQuery, profileImage }) => {
  return (
    <div className="w-full bg-white flex items-center justify-between px-6 py-4 shadow-md fixed top-0 z-50">
      {/* Left Section - Search */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute top-2/4 left-3 transform -translate-y-2/4 text-gray-400" />
      </div>

      {/* Right Section - Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <FiBell className="text-gray-600 w-6 h-6 cursor-pointer hover:text-blue-600" />

        {/* Profile */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src={profileImage || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full border"
          />
          <span className="font-medium text-gray-700">Theresa Roemer</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
