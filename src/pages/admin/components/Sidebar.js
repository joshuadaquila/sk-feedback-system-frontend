import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaBullhorn, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="w-64 bg-blue-900 p-5 text-white h-full overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <img
              src={`${process.env.PUBLIC_URL}/logo.jpg`}
              alt="Logo"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold">Sk Event System</h2>
        </div>

        <div className="w-full h-px bg-blue-500 mb-4" />

        <nav className="mt-4">
          <ul>
            <li className="mb-4">
              <Link
                to="/admin/dashboard"
                className={`flex items-center py-2 px-4 rounded ${
                  isActive("/admin/dashboard") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <FaTachometerAlt className="mr-4" />
                Dashboard
              </Link>
            </li>

            <li className="mb-4">
              <Link
                to="/admin/events"
                className={`flex items-center py-2 px-4 rounded ${
                  isActive("/admin/events") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <FaCalendarAlt className="mr-4" />
                Events
              </Link>
            </li>

            <li className="mb-4">
              <Link
                to="/admin/announcement"
                className={`flex items-center py-2 px-4 rounded ${
                  isActive("/admin/announcement") ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <FaBullhorn className="mr-4" />
                Announcement
              </Link>
            </li>

            <li className="mt-auto mb-4">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center py-2 px-4 w-full hover:bg-blue-700 rounded text-white"
              >
                <FaSignOutAlt className="mr-4" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
