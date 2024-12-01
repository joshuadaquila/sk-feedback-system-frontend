import React, { useState } from "react";
import { FaCalendar, FaMapPin } from "react-icons/fa";

const UserEventCard = ({ data, past }) => {
  const [showFbForm, setShowFbForm] = useState(false)
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
    <div className="shadow-md p-4 rounded-md mb-4 m-2 border">
      
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

      {past && (
      <div className="flex items-end justify-end">
        <p className="italic mr-2">Tell us your experience about this event.</p>
        <button className="bg-blue-600 px-2 text-white rounded-full"
          onClick={()=> setShowFbForm(!showFbForm)}
        >Write Feedback</button>
      </div>
      )}
      {showFbForm && (
        <div className="bg-white p-4 max-w-lg w-full rounded-lg flex flex-col items-end">
          <button
            onClick={()=> setShowFbForm(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
            aria-label="Close Feedback Form"
          >
            ✕
          </button>
          <textarea
            placeholder="Write here..."
            className="w-full h-48 p-2 border rounded-md"
          />
          <div className="mt-2">
            <button className="bg-green-600 text-white rounded-full px-3 py-1">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEventCard;
