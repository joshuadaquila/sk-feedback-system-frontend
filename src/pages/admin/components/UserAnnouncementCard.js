
import { FaCalendar, FaGlobe, FaGlobeAsia} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import axios from "axios";


const UserAnnouncementCard = ({ data }) => {
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAnnouncements");
      console.log(response.data);  // Check what the response looks like
      const fetchedAnnouncements = response.data.announcements;
      // setAnnouncements(fetchedAnnouncements);  // Assuming the data is in 'announcements'
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
  

  useEffect(() => {
    fetchAnnouncements();
  }, []);

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
    <div className="shadow-md p-4 rounded-md m-2 mb-8 border">
      <p className="font-bold text-lg mb-2 ">{data.title}</p>
      
      <div className="flex">
        <p className="text-gray-600 mr-2 text-sm">@{data.userName}</p> 
        <p className="text-gray-600 text-sm">{formatDate(data.createdAt)}</p>
        <div className="flex items-center ml-2 text-xs text-gray-600">
          {data.audience.toUpperCase() === "ALL" ? (
            <FaGlobeAsia className="text-blue-400 mr-1" />
            ) : null}
          {data.audience.toUpperCase() === "ALL" ? null : (
          <p>{data.audience}</p>
          )}
        </div>
      </div>
      
      {/* <div className="flex items-center space-x-2 mt-2">
        <FaCalendar className="text-blue-500" />
        <p>{data.place}</p>
      </div> */}

      <p className=" pl-2 text-lg text-black-700 mt-2">{data.description}</p>
    </div>
  );
};

export default UserAnnouncementCard;
