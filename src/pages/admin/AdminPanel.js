import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; 
import { Chart as ChartJS, BarElement, Tooltip, Legend, Title, CategoryScale, LinearScale, ArcElement } from "chart.js"; 
import Sidebar from "./components/Sidebar";
import { Doughnut } from "react-chartjs-2"; 


ChartJS.register(BarElement, Tooltip, Legend, Title, CategoryScale, LinearScale, ArcElement);

const AdminDashboard = () => {
  const [feedbackCounts, setFeedbackCounts] = useState({
    past: 0,
  });

  const [eventCounts, setEventCounts] = useState({
    upcoming: 0,
    ongoing: 0,
    past: 0,
  });

  const fetchFeedbackCounts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getFeedback");
      const data = response.data;

      setFeedbackCounts({
        past: data.past || 0, 
      });
    } catch (error) {
      console.error("Error fetching feedback counts:", error);
      alert("Failed to fetch feedback data.");
    }
  };

  const fetchEventCounts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAllEvents");
      const eventList = response.data.events;

      const now = new Date();
      const counts = {
        upcoming: eventList.filter((event) => new Date(event.startDate) > now).length,
        ongoing: eventList.filter(
          (event) => new Date(event.startDate) <= now && new Date(event.endDate) >= now
        ).length,
        past: eventList.filter((event) => new Date(event.endDate) < now).length,
      };

      setEventCounts(counts);
    } catch (error) {
      console.error("Error fetching event counts:", error);
      alert("Failed to fetch event data.");
    }
  };

  useEffect(() => {
    fetchFeedbackCounts();
    fetchEventCounts();
  }, []);

  const barData = {
    labels: ["Past Events"], 
    datasets: [
      {
        label: "Feedback for Past Events",
        data: [feedbackCounts.past], 
        backgroundColor: "#f8bbd0", 
        borderColor: "#f8bbd0",
        borderWidth: 3, 
        borderRadius: 5,
        barThickness: 50,
      },
    ],
  };
  const barOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Past Events: ${tooltipItem.raw} feedback${tooltipItem.raw > 1 ? "s" : ""}`;
          },
        },
      },
      legend: {
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const doughnutData = {
    labels: ["Upcoming Events", "Ongoing Events", "Past Events"], 
    datasets: [
      {
        data: [eventCounts.upcoming, eventCounts.ongoing, eventCounts.past], 
        backgroundColor: ["#FF9F00", "#4CAF50", "#9E9E9E"], 
        hoverOffset: 4,
      },
    ],
  };

  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} events`; 
          },
        },
      },
      legend: {
        position: "top", 
      },
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6"></h1>
        <section className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Overview</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 h-60">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="w-full md:w-1/2 h-60">
              <Bar data={barData} options={barOptions} height={300} />
            </div>
          </div>
        </section>
        
        <section className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Announcements</h2>
          <div className="p-4 rounded-lg bg-gray-50 shadow-md">
            <p className="text-sm text-gray-600">No current announcements</p>
          </div>
        </section>
      </main>
    </div>
  );
  
};

export default AdminDashboard;
