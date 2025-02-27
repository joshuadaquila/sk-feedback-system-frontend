import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { FaCalendarCheck, FaCalendarTimes, FaTimes,FaMapMarkerAlt, FaRegCalendarAlt, FaEdit, FaTrash} from "react-icons/fa";
import { get } from "../../api";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import GenerateReport from "./components/GenerateReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faSearch } from "@fortawesome/free-solid-svg-icons";

const Events = () => {
  const [category, setCategory] = useState("present");
  const [events, setEvents] = useState({
    upcoming: [],
    present: [],
  });
  const [eventDetails, setEventDetails] = useState({
    eventId: "",
    eventName: "",
    description: "",
    place: "",
    startDate: "",
    endDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [reportData, setReportData] = useState(null); 
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reportId, setReportId] = useState(0);
  const [showOptions, setShowOptions] = useState(null);

  const toggleFeedbackList = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const fetchFeedbacks = async (eventId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/user/getFeedbackByEvent/${eventId}`);
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      alert("Failed to load feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAllEvents");
      const eventList = response.data.events;

      console.log(eventList);

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
  const [searchQuery, setSearchQuery] = useState("");

  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const storedEventId = localStorage.getItem("eventId")
    if (storedEventId) {
      setEventId(storedEventId);  
    }
  }, []);
  

  useEffect(() => {
    fetchEvents();
    fetchFeedbacks(eventId);
    setShowReport(true);
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSaveEvent = async () => {
    if (
      !eventDetails.eventName ||
      !eventDetails.description ||
      !eventDetails.place ||
      !eventDetails.startDate
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      if (eventDetails.eventId) {
        const response = await axios.put(
          `http://localhost:3001/user/updateEvent/${eventDetails.eventId}`,
          {
            ...eventDetails,
          }
        );

        if (response.status === 200) {
          alert("Event updated successfully!");
        } else {
          throw new Error("Update failed");
        }
      } else {
        const response = await axios.post(
          "http://localhost:3001/user/addEvent",
          {
            ...eventDetails,
            createdAt: new Date().toISOString(),
            userId: localStorage.getItem("userId"),
            status: "active",
          }
        );

        if (response.status === 200) {
          setSuccessMessage("Event created successfully!");
        } else {
          throw new Error("Update failed");
        }
      }

      fetchEvents();
      setEventDetails({
        eventId: "",
        eventName: "",
        description: "",
        place: "",
        startDate: "",
        endDate: ""
      });
      setTimeout(() => {
        setSuccessMessage("");
        setIsModalOpen(false);
      }, 1000); 
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  const handleEditEvent = (event) => {
    setEventDetails(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/user/deleteEvents/${eventToDelete}`);
      
      if (response.status === 200) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.eventId !== eventToDelete)
        );
      }
      
      setIsConfirmDeleteOpen(false);
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting Event:", error);
      alert("Failed to delete Event. Please try again.");
    }
  };
  
  const formatDate = (date) => {
    const options = {
      // weekday: 'long', // "Monday"
      year: 'numeric', // "2023"
      month: 'long', // "November"
      day: 'numeric', // "3"
      hour: 'numeric', // "5"
      minute: 'numeric', // "00"
      hour12: true, // 12-hour format with AM/PM
    };
    return new Date(date).toLocaleString('en-US', options);
  }; 
  const handleGenerateReport = (eventId) => {
    console.log(`Generating report for event ${eventId}`);
    setReportId(eventId);
    const sentimentData = {
      positive: 60,
      neutral: 25,
      negative: 15,
    };
    const overallSentiment = Object.keys(sentimentData).reduce((prev, curr) =>
      sentimentData[curr] > sentimentData[prev] ? curr : prev
    );
    const chartData = {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        },
      ],
    };
    setReportData({
      eventId,
      sentimentData,
      chartData,
      overallSentiment,
    });
  };

  const renderReport = () => {
    console.log("render report is triggered")
    setReportData(false)
  }
  
  const filteredEvents = events[category]?.filter(event =>
    (event.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  useEffect(() => {
    fetchEvents();
  }, [category]);
  

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
    <Sidebar />
    <div className="flex-1 overflow-y-auto bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="sticky top-0 bg-slate-100 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold ml-8 mt-8 text-gray-800">Event Management</h2>
        </div>
        <div className="border-b-2 border-gray-600 mt-4"></div>
        <div className="mt-4 flex justify-between items-center mx-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-3">
              {["present", "upcoming", "past"].map((cat) => (
                <li key={cat} className="inline-flex items-center">
                  <a
                    href="#"
                    className={`inline-flex items-center text-base font-medium ${
                      category === cat ? "text-blue-600" : "text-gray-600"
                    } hover:text-blue-800 transition-all duration-300`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          
        </div>
        </div>

        
  
        <div className="flex justify-between items-center mt-8">
          <div className="relative w-[685px] ml-8 "> 
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 ml-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            className="bg-blue-600 text-white text-sm px-6 py-3 mr-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            onClick={() => {
              setEventDetails({
                eventId: "",
                eventName: "",
                description: "",
                place: "",
                startDate: "",
                endDate: ""
              });
              setIsModalOpen(true);
            }}
          >
            + Add New Event
          </button>
        </div>
  
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                {eventDetails.eventId ? "Edit Event" : "Add New Event"}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="eventName"
                  value={eventDetails.eventName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Event Name"
                />
                <input
                  type="text"
                  name="place"
                  value={eventDetails.place}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Place"
                />
                <textarea
                  name="description"
                  value={eventDetails.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Description"
                />
                <div className="mb-4">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={eventDetails.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
  
                <div className="mb-4">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={eventDetails.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
  
                {successMessage && (
                  <p className="text-green-600 text-center mt-4">{successMessage}</p>
                )}
  
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={handleSaveEvent}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-400 transition-transform transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
  
        <div className="mt-5">
          <h3 className="text-xl font-bold ml-8 mb-6 text-left">
            {category.charAt(0).toUpperCase() + category.slice(1)} Events
          </h3>
          {events[category]?.length > 0 ? (
            <div className="flex justify-center">
              <div className="w-full flex flex-col items-center justify-center grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-x-6 gap-y-8">
              {filteredEvents?.map((event, index) => (

                  <div
                    key={event.eventId || index}
                    className={`relative ${category != 'upcoming'? 'w-[80%]' : 'w-[50%]'}  min-h-[80px] flex flex-row border shadow-lg  rounded-2xl transition-all duration-500 overflow-hidden`}
                  >
                    <div className={`w-full grid ${category != 'upcoming'? ' grid-cols-2' : 'grid-cols-1'}`}>
                      <div className="relative">
                        <div
                          className="absolute right-4 top-4 cursor-pointer"
                          onClick={() => {
                            setShowOptions(showOptions === event.eventId ? null : event.eventId);
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </div>
                        {showOptions === event.eventId && (
                          <div className="shadow-md bg-gray-200 absolute right-6 top-5 px-4 py-2">
                            <p>Edit</p>
                            <p>Delete</p>
                          </div>
                        )}

                        <div className="block h-40">
                          <img
                            src={`${process.env.PUBLIC_URL}/event.jpg`}
                            alt="Event Image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-grow bg-slate-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                            {event.eventName}
                          </h4>

                          <div className="flex items-center text-gray-600 mb-2">
                            <FaCalendarCheck className="mr-2 text-green-500" />
                            <span className="font-medium">{formatDate(event.startDate)}</span>
                          </div>

                          <div className="flex items-center text-gray-600 mb-2">
                            <FaCalendarTimes className="mr-2 text-red-500" />
                            <span className="font-medium">{formatDate(event.endDate)}</span>
                          </div>

                          <div className="flex items-center text-gray-600 mb-4">
                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                            <span>{event.place}</span>
                          </div>

                          <p className="text-gray-700 pl-2 text-sm mb-4">{event.description}</p>
                          <div className="mt-auto flex justify-center space-x-4">
                            {/* {category === "past" && (
                              <button
                                onClick={() => handleGenerateReport(event.eventId)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                              >
                                Generate Report
                              </button>
                            )} */}
                          </div>
                        </div>
                        {/* <div className="bottom-2 right-2 flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-600 hover:text-blue-800 text-lg font-medium"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.eventId)}
                            className="text-red-600 hover:text-red-800 text-lg font-medium"
                          >
                            <FaTrash />
                          </button>
                        </div> */}
                      </div>
                      
                      { category != 'upcoming' && (
                      <div className="p-4 bg-slate-200">
                        {/* {console.log("EVENTID: ", event.eventId)} */}
                        <GenerateReport eventId={event.eventId} requestCompleted={renderReport}/>
                      </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="ml-8">No events found.</p>
          )}
        </div>
        {/* {reportData && <GenerateReport eventId={reportId} requestCompleted={renderReport}/> } */}
  
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-80 max-w-xs">
              <h3 className="text-lg font-semibold mb-2 text-center">Confirm Deletion</h3>
              <p className="text-sm mb-4 text-center">Are you sure you want to delete this event?</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white mr-4 text-sm px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}  

export default Events;
