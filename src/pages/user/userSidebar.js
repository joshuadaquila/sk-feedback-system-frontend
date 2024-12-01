import React from 'react';
import { FaCalendarAlt, FaBullhorn, FaBell, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();

  const navigateTo = (page) => {
    navigate(`/user/${page}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 max-w-screen-sm mx-auto shadow-md z-50 rounded-xl mb-5">
      <div className="flex justify-around items-center py-2">
        <button
          onClick={() => navigateTo('userdashboard')}
          className="text-white hover:text-gray-200 text-2xl"
        >
          <FaCalendarAlt />
        </button>
        <div className="h-8 border-l-2 border-gray-300"></div>
        <button
          onClick={() => navigateTo('userannouncement')}
          className="text-white hover:text-gray-200 text-2xl"
        >
          <FaBullhorn />
        </button>
        <div className="h-8 border-l-2 border-gray-100"></div>

        <button
          onClick={() => navigateTo('notifications')}
          className="text-white hover:text-gray-200 text-2xl"
        >
          <FaBell />
        </button>
        <div className="h-8 border-l-2 border-gray-300"></div>

        <button
          onClick={() => navigateTo('profile')}
          className="text-white hover:text-gray-200 text-2xl"
        >
          <FaUserAlt />
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
