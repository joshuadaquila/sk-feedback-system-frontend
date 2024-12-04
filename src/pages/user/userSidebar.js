import React from 'react'; 
import { FaCalendarAlt, FaBullhorn, FaBell, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();

  const navigateTo = (page) => {
    navigate(`/user/${page}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 max-w-screen-sm mx-auto shadow-md z-50 rounded-lg mb-3">
      <div className="flex justify-around items-center py-1">
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('userdashboard')}
            className="text-white hover:text-gray-200 text-lg" // Reduced size
          >
            <FaCalendarAlt />
          </button>
          <span className="text-white text-xs mt-0.5">Events</span> {/* Smaller text */}
        </div>
        <div className="h-6 border-l-2 border-gray-300"></div> {/* Shorter divider */}

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('userannouncement')}
            className="text-white hover:text-gray-200 text-lg" // Reduced size
          >
            <FaBullhorn />
          </button>
          <span className="text-white text-xs mt-0.5">Announcements</span> {/* Smaller text */}
        </div>
        <div className="h-6 border-l-2 border-gray-300"></div> {/* Shorter divider */}

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('notification')}
            className="text-white hover:text-gray-200 text-lg" // Reduced size
          >
            <FaBell />
          </button>
          <span className="text-white text-xs mt-0.5">Notifications</span> {/* Smaller text */}
        </div>
        <div className="h-6 border-l-2 border-gray-300"></div> {/* Shorter divider */}

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigateTo('profile')}
            className="text-white hover:text-gray-200 text-lg" // Reduced size
          >
            <FaUserAlt />
          </button>
          <span className="text-white text-xs mt-0.5">Profile</span> {/* Smaller text */}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
