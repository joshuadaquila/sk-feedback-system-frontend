import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaBullhorn } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-600 p-5 text-white h-full overflow-y-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-white rounded-full mb-4"></div>
        <h2 className="text-2xl font-bold">Sk Event System</h2>
      </div>

      <div className="w-full h-px bg-blue-500 mb-4" />

      <nav className="mt-4">
        <ul>
          <li className="mb-4 border-b border-blue-500">
            <Link to="/admin/dashboard" className="flex items-center py-2 px-4 hover:bg-blue-700 rounded">
              <FaTachometerAlt className="mr-4" />
              Dashboard
            </Link>
          </li>

          <li className="mb-4 border-b border-blue-500">
            <Link to="/admin/events" className="flex items-center py-2 px-4 hover:bg-blue-700 rounded">
              <FaCalendarAlt className="mr-4" />
              Events
            </Link>
          </li>

          <li className="mb-4 border-b border-blue-500">
            <Link to="/admin/announcement" className="flex items-center py-2 px-4 hover:bg-blue-700 rounded">
              <FaBullhorn className="mr-4" />
              Announcement
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
