import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import UserSidebar from "./userSidebar";
import axios from "axios";
import UserEventCard from "../admin/components/UserEventCard";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [events, setEvents] = useState(null); // Initialize with null for better conditional checks

  const fetchEvents = async () => {
    try {
      const response = await axios.get("https://sk-feedback-system-backend.onrender.com/user/getAllEvents");
      const eventList = response.data.events;

      const now = new Date();

      const categorizedEvents = {
        upcoming: eventList.filter((event) => new Date(event.startDate) > now),
        present: eventList.filter(
          (event) => new Date(event.startDate) <= now && new Date(event.endDate) >= now
        ),
        past: eventList.filter((event) => new Date(event.endDate) < now),
      };

      setEvents(categorizedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      // alert("Failed to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const navigateTo = (page) => {
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="h-[90%] text-black py-1 flex justify-between px-4 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-lg mt-4">
      {/* Top Bar */}
      <div className="bg-gray-200 text-black py-2 flex items-center h-[8%] justify-between px-4 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-lg mt-4">
        <div className="flex flex-col items-start">
          <h1 className="text-base font-bold">Events</h1>
          <div className="mb-1">
            <div className="flex space-x-3">
              {["all", "present", "upcoming", "past"].map((cat) => (
                <span
                  key={cat}
                  className={`cursor-pointer text-sm font-medium ${
                    category === cat ? "text-blue-600" : "text-gray-600"
                  } hover:text-blue-800 transition-all duration-300`}
                  onClick={() => setCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="relative w-48">
          <input
            type="text"
            placeholder="Search events..."
            className="px-3 py-1 rounded-full border border-gray-300 text-black focus:outline-none w-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-2 top-2 text-gray-400 text-sm" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-16 px-4">
        {events ? (
          <>
            {category === "all" || category === "upcoming" ? (
              <>
                <h2 className="text-base font-bold mb-2 bg-gray-200 p-1 rounded-md">Upcoming Events</h2>
                {events.upcoming.length > 0 ? (
                  events.upcoming.map((event) => (
                    <UserEventCard key={event.id} data={event} />
                  ))
                ) : (
                  <p className="text-sm">No upcoming events.</p>
                )}
              </>
            ) : null}

            {category === "all" || category === "present" ? (
              <>
                <h2 className="text-base font-bold mb-2 bg-gray-200 p-1 rounded-md">Ongoing Events</h2>
                {events.present.length > 0 ? (
                  events.present.map((event) => (
                    <UserEventCard key={event.id} data={event} />
                  ))
                ) : (
                  <p className="text-sm">No ongoing events.</p>
                )}
              </>
            ) : null}

            {category === "all" || category === "past" ? (
              <>
                <h2 className="text-base font-bold mb-2 bg-gray-200 p-1 rounded-md">Past Events</h2>
                {events.past.length > 0 ? (
                  events.past.map((event) => (
                    <UserEventCard key={event.id} data={event} past={true} />
                  ))
                ) : (
                  <p className="text-sm">No past events.</p>
                )}
              </>
            ) : null}
          </>
        ) : (
          <p className="text-sm">Loading events...</p>
        )}
      </div>

      {/* Sidebar */}
      <UserSidebar navigateTo={navigateTo} />
    </div>
  );
};

export default UserDashboard;
