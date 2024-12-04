// NotificationCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const UserNotificationCard = ({ notification }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/notification/${notification.id}`);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleClick}
    >
      <h3 className="font-semibold text-lg text-gray-800">{notification.title}</h3>
      <p className="text-sm text-gray-600 mt-2">{notification.message}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(notification.timestamp).toLocaleString()}
      </p>
    </div>
  );
};

export default UserNotificationCard;
