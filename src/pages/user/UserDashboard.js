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
      const response = await axios.get("http://localhost:3001/user/getAllEvents");
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
      alert("Failed to fetch events.");
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
  console.log(events)
  return (
    <div className=" min-h-full text-black py-2 flex justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl mt-5">
      {/* Top Bar */}
      <div className="bg-gray-200 text-black py-2 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl mt-5">
        <div className="flex flex-col items-start max-w-2xl space-y-1">
          <h1 className="text-xl font-bold">Events</h1>
          <div className="mb-2">
            <div className="flex space-x-4">
              {["all", "present", "upcoming", "past"].map((cat) => (
                <span
                  key={cat}
                  className={`cursor-pointer text-lg font-medium ${
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
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search events..."
            className="px-4 py-2 rounded-full border border-gray-300 text-black focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20 px-6">
        {events ? (
          <>
            {category === "all" || category === "upcoming" ? (
              <>
                <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
                {events.upcoming.length > 0 ? (
                  events.upcoming.map((event) => (
                    <UserEventCard key={event.id} data={event} />
                  ))
                ) : (
                  <p>No upcoming events.</p>
                )}
              </>
            ) : null}

            {category === "all" || category === "present" ? (
              <>
                <h2 className="text-lg font-bold mb-4">Ongoing Events</h2>
                {events.present.length > 0 ? (
                  events.present.map((event) => (
                    <UserEventCard key={event.id} data={event} />
                  ))
                ) : (
                  <p>No ongoing events.</p>
                )}
              </>
            ) : null}

            {category === "all" || category === "past" ? (
              <>
                <h2 className="text-lg font-bold mb-4">Past Events</h2>
                {events.past.length > 0 ? (
                  events.past.map((event) => (
                    <UserEventCard key={event.id} data={event} />
                  ))
                ) : (
                  <p>No past events.</p>
                )}
              </>
            ) : null}
          </>
        ) : (
          <p>Loading events...</p>
        )}
      </div>

      {/* Sidebar */}
      <UserSidebar navigateTo={navigateTo} />
    </div>
  );
};

export default UserDashboard;
