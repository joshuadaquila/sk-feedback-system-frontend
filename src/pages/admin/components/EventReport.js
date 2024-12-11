import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaCalendarTimes, FaTimes,FaMapMarkerAlt, FaRegCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';

const EventReport = ({ eventId, overallSentiment, requestCompleted, positive, neutral, negative }) => {
  // const [overallSentiment, setOverallSentiment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([])

  const toggleFeedbackList = () => {
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/getRawFeedbacks?eventId=${eventId}`);
        console.log("feedbacks", response.data);
        setFeedbacks(response.data)
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
  
    fetchFeedbacks(); 
  }, [eventId]);
  

  const reportData = {
    chartData: {
      labels: ['Positive', 'Neutral', 'Negative'], // Labels for each segment of the pie chart
      datasets: [
        {
          data: [positive, neutral, negative], // Data values corresponding to the labels
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], // Optional: colors for each slice
          hoverBackgroundColor: ['#3B8EAE', '#FFB944', '#FF4C62'], // Optional: hover colors for each slice
        },
      ],
    },
  };
  return(
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl w-[40%] max-w-xl max-h-[80%] overflow-y-auto">
    <div className="sticky top-0 bg-gray-100 z-10 border-b-2 border-gray-00 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Event Report</h2>
        <button
          onClick={() => requestCompleted()}
          className="text-lg text-gray-700 hover:text-red-600"
        >
          <FaTimes />
        </button>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-semibold text-lg mb-4">
        Overall Sentiment:
        <span className="font-bold capitalize ml-2">
          {overallSentiment}
        </span>
      </h3>

      <h3 className="text-lg font-semibold text-gray-600 mb-6">
        Sentiment Breakdown
      </h3>
      <div
        className="flex items-center justify-center ml-32 mr-10  mb-4"
        style={{ maxWidth: "250px", height: "250px" }}
      >
        <Pie
          data={reportData.chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
          }}
        />
      </div>

      <div>
        <h3 className="font-semibold text-lg mt-4">Sentiment Details</h3>
        <ul>
          <li>Positive: {positive}%</li>
          <li>Neutral: {neutral}%</li>
          <li>Negative: {negative}%</li>
        </ul>
      </div>

      <button
        onClick={toggleFeedbackList}
        className="px-2 mt-4 bg-gray-500 text-sm text-white rounded-md"
      >
        {isExpanded ? "Hide Feedbacks" : "Show Feedbacks"}
      </button>

      {isExpanded && (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <span className="ml-2 text-gray-500">Loading feedbacks...</span>
        </div>
         ) : feedbacks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {feedbacks.map((feedback) => (
              <li key={feedback.feedbackId} className="py-4">
                <div className="flex items-center gap-3">
                  {/* <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">
                    {feedback.userName.charAt(0).toUpperCase()}
                  </div> */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">@{feedback.userName}</p>
                    <p className="text-sm text-gray-700 mt-1">{feedback.content}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center">No feedbacks available for this event.</p>
        )}
      </div>
    )}
  </div>
       
    </div>
  </div>
  )
  
}

export default EventReport