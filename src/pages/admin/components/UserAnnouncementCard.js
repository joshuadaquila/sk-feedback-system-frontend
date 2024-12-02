import React from "react";
import { FaCalendar } from "react-icons/fa";

const UserAnnouncementCard = ({ data }) => {
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  return (
    <div className="shadow-md p-4 rounded-md m-2">
      <p className="font-bold text-lg">{data.title}</p>
      
      <div className="flex">
        <p className="text-gray-600 mr-2 text-sm">@{data.userName}</p>
        <p className="text-gray-600 text-sm">{formatDate(data.createdAt)}</p>
      </div>
      
      <div className="flex items-center space-x-2 mt-2">
        <FaCalendar className="text-blue-500" />
        <p>{formatDate(data.date)}</p>
      </div>

      <p className="text-gray-700 mt-2">{data.content}</p>
    </div>
  );
};

export default UserAnnouncementCard;
