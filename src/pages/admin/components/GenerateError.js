import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaCalendarTimes, FaTimes,FaMapMarkerAlt, FaRegCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";

const GenerateError = ({ reportData, overallSentiment, requestCompleted }) => {
  // const [overallSentiment, setOverallSentiment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([])

  const toggleFeedbackList = () => {
    // console.log("hj")
  }
  return(
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[40%] max-w-xl h-[25%] overflow-y-auto">
        <div className="sticky top-0 bg-gray-100 z-10 border-b-2 border-gray-00 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Event Report is Unavailable</h2>
            <button
              onClick={() => requestCompleted()}
              className="text-lg text-gray-700 hover:text-red-600"
            >
              <FaTimes />
            </button>

            
          </div>

          <div className="p-6">
            <p>Error: No feedbacks available for sentiment analysis. Please ensure that feedbacks have been submitted before generating the report.</p>
          </div>
        </div>
    </div>
  </div>
  )}


export default GenerateError