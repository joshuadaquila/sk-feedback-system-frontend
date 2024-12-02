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
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('userdashboard')}
            className="text-white hover:text-gray-200 text-xl"
          >
            <FaCalendarAlt />
          </button>
          <span className="text-white text-sm mt-1">Events</span>
        </div>
        <div className="h-8 border-l-2 border-gray-300"></div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('userannouncement')}
            className="text-white hover:text-gray-200 text-xl" 
          >
            <FaBullhorn />
          </button>
          <span className="text-white text-sm mt-1">Announcements</span>
        </div>
        <div className="h-8 border-l-2 border-gray-300"></div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('notifications')}
            className="text-white hover:text-gray-200 text-xl" 
          >
            <FaBell />
          </button>
          <span className="text-white text-sm mt-1">Notifications</span>
        </div>
        <div className="h-8 border-l-2 border-gray-300"></div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('profile')}
            className="text-white hover:text-gray-200 text-xl" 
          >
            <FaUserAlt />
          </button>
          <span className="text-white text-sm mt-1">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
