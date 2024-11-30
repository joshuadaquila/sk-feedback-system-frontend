import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { FaCalendarAlt, FaMapMarkerAlt, FaRegCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";

const Events = () => {
  const [category, setCategory] = useState("present");
  const [events, setEvents] = useState({
    upcoming: [],
    present: [
      {
        eventId: "1",
        eventName: "Sample Event",
        description: "This is a sample event description.",
        place: "Sample Location",
        startDate: "2024-12-01",
      },
      {
        eventId: "1",
        eventName: "Sample Event",
        description: "This is a sample event description.",
        place: "Sample Location",
        startDate: "2024-12-01",
      },
      {
        eventId: "1",
        eventName: "Sample Event",
        description: "This is a sample event description.",
        place: "Sample Location",
        startDate: "2024-12-01",
      },
      
    ],
    past: [],
  });
  const [eventDetails, setEventDetails] = useState({
    eventId: "",
    eventName: "",
    description: "",
    place: "",
    startDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events");
      const eventList = response.data;

      const now = new Date();

      const categorizedEvents = {
        upcoming: eventList.filter(event => new Date(event.startDate) > now),
        present: eventList.filter(event => new Date(event.startDate) <= now),
        past: eventList.filter(event => new Date(event.startDate) < now),
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleAddEvent = async () => {
    if (!eventDetails.eventName || !eventDetails.description || !eventDetails.place || !eventDetails.startDate) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/events", {
        ...eventDetails,
        createdAt: new Date().toISOString(),
        userId: localStorage.getItem("userId"),
        status: "active",
      });

      if (response.status === 200) {
        fetchEvents();
        setEventDetails({
          eventId: "",
          eventName: "",
          description: "",
          place: "",
          startDate: "",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    }
  };

  const handleEditEvent = (event) => {
    setEventDetails(event); 
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/events/${eventId}`);
      if (response.status === 200) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="flex justify-between items-center border-b-2 border-gray-600 pb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Event Management</h2>
        </div>

        <div className="mt-8 mb-6">
          <div className="flex justify-start space-x-4">
            {["present", "upcoming", "past"].map((cat) => (
              <span
                key={cat}
                className={`cursor-pointer text-lg font-medium ${category === cat ? "text-blue-600" : "text-gray-600"} hover:text-blue-800 transition-all duration-300`}
                onClick={() => setCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Event
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 max-w-lg">
              <h3 className="text-2xl font-semibold mb-6 text-center">Add New Event</h3>
              <input
                type="text"
                name="eventName"
                value={eventDetails.eventName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg text-lg"
                placeholder="Event Name"
              />
              <input
                type="text"
                name="place"
                value={eventDetails.place}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg text-lg"
                placeholder="Place"
              />
              <textarea
                name="description"
                value={eventDetails.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg text-lg"
                placeholder="Description"
              />
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={eventDetails.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-lg"
                />

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleAddEvent}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Save Event
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      <div className="mt-5">
        <h3 className="text-xl font-semibold mb-6">
          {category.charAt(0).toUpperCase() + category.slice(1)} Events
        </h3>
        {events[category]?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events[category].map((event, index) => (
              <div
                key={event.eventId || index}
                className="relative max-w-sm border border-solid border-black rounded-2xl transition-all duration-500"
              >
                <div className="block overflow-hidden">
                  <img
                    src={`${process.env.PUBLIC_URL}/event.jpg`}
                    alt="Event Image"
                    className="w-full h-40 object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-4 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 capitalize transition-all duration-500 flex items-center space-x-2">
                    <FaCalendarAlt className="text-blue-600" />
                    <span>{event.eventName}</span>
                  </h4>

                  <div className="flex items-center text-gray-600 border-b border-gray-200 mb-4">
                    <FaRegCalendarAlt className="mr-2" />
                    <span className="font-medium">{event.startDate}</span>
                  </div>

                  <div className="flex items-center text-gray-600 border-b border-gray-200 mb-4">
                    <FaMapMarkerAlt className="mr-2" /> <span>{event.place}</span>
                  </div>

                  <p className="text-gray-700 mb-5">{event.description}</p>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:text-blue-800 text-lg font-medium"
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.eventId)}
                      className="text-red-600 hover:text-red-800 text-lg font-medium"
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </div>

      </div>
    </div>
  );
};

export default Events;
