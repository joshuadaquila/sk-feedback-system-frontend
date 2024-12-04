import React, { useState, useEffect } from "react";
import { FaCalendar, FaMapPin } from "react-icons/fa";
import axios from "axios";

const UserEventCard = ({ data, past }) => {
  const [showFbForm, setShowFbForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [userId, setUserId] = useState(0);
  
  const [feedbackExists, setFeedbackExists] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    
    const checkFeedback = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/user/checkFeedback`,
          {
            params: { userId: id, eventId: data.eventId },
          }
        );
        setFeedbackExists(response.data.exists); 
      } catch (error) {
        console.error("Error checking feedback:", error);
      }
    };

    checkFeedback();
  }, [data.eventId]);

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

  const handleAddFeedback = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/addFeedback", {
        userId: userId,
        eventId: data.eventId,
        content: feedback,
      });

      if (response.status === 200) {
        setFeedbackExists(true); 
        setShowFbForm(false);
        setSuccessMessage("Thanks for writing your feedback!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error adding feedback:", error);
    }
  };

  return (
    <div className="shadow-md p-4 rounded-md mb-4 m-2 border">
      <p className="font-bold text-lg">{data.eventName}</p>

      <div className="flex">
        <p className="text-gray-600 mr-2 text-xs">@{data.userName}</p>
        <p className="text-gray-600 text-xs">{formatDate(data.createdAt)}</p>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <FaCalendar className="text-blue-500" />
        <p className="text-sm">{formatDate(data.startDate)}</p>
        <p className="text-sm">- {formatDate(data.endDate)}</p>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <FaMapPin className="text-blue-500" />
        <p className="text-sm">{data.place}</p>
      </div>

      <p className="pl-5 mt-5 mb-5 text-sm">{data.description}</p>

      {past && (
        <div className="flex items-end justify-end">
          {feedbackExists ? (
            <button
              className="bg-gray-500 px-2 text-white rounded-full cursor-not-allowed"
              disabled
            >
              Done Feedback
            </button>
          ) : (
            <button
              className="bg-blue-600 px-2 text-white rounded-full"
              onClick={() => setShowFbForm(!showFbForm)}
            >
              Write Feedback
            </button>
          )}
        </div>
      )}

      {showFbForm && (
        <div className="bg-white p-4 max-w-lg w-full rounded-lg flex flex-col items-end">
          <button
            onClick={() => setShowFbForm(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
            aria-label="Close Feedback Form"
          >
            ✕
          </button>
          <textarea
            placeholder="Write here..."
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-48 p-2 border rounded-md"
          />
          <div className="mt-2">
            <button
              className="bg-green-600 text-white rounded-full px-3 py-1"
              onClick={handleAddFeedback}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 text-green-700 bg-green-100 p-2 rounded">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default UserEventCard;
