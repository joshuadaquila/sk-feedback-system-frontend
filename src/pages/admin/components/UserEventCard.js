import React from "react";
import { FaCalendar, FaMapPin } from "react-icons/fa";

const UserEventCard = ({ data }) => {
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
    <div className="shadow-md p-4 rounded-md">
      <p className="font-bold text-lg">{data.eventName}</p>

      <div className="flex">
        <p className="text-gray-600 mr-2 text-sm">@{data.userName}</p>
        <p className="text-gray-600 text-sm">{formatDate(data.createdAt)}</p>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <FaCalendar className="text-blue-500" />
        <p>{formatDate(data.startDate)}</p>
        <p>- {formatDate(data.endDate)}</p>
      </div>
      <div  className="flex items-center space-x-2 mt-2">
        <FaMapPin className="text-blue-500"/>
        <p>{data.place}</p>
      </div>

      <p>{data.description}</p>
    </div>
  );
};

export default UserEventCard;