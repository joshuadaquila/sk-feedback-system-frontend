import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import UserSidebar from "./userSidebar";
import axios from "axios"; // For fetching notifications
import UserNotificationCard from "../admin/components/UserNotificationCard";

const UserNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getNotifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const filteredNotifications = notifications.filter((notification) =>
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="h-[90%] text-black py-2 flex justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl">
      {/* Top Bar */}
      <div className="bg-gray-200 text-black py-4 h-[10%] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl mt-5">
        <h1 className="text-xl font-bold">Notifications</h1>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search notifications..."
            className="px-4 py-2 rounded-full border border-gray-300 text-black focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20 max-w-screen-sm mx-auto rounded-xl mt-6 px-6">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-600">No notifications available.</p>
        ) : (
          filteredNotifications.map((notification) => (
            <UserNotificationCard key={notification.id} notification={notification} />
          ))
        )}
      </div>

      {/* Sidebar */}
      <UserSidebar navigateTo={(page) => navigate(`/${page}`)} />
    </div>
  );
};

export default UserNotification;
