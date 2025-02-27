import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { Doughnut, Bar } from "react-chartjs-2";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV , faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FaCalendarCheck, FaCalendarTimes, FaTimes,FaMapMarkerAlt, FaRegCalendarAlt, FaEdit, FaTrash, } from "react-icons/fa";
import GenerateReport from "./components/GenerateReport";
const localizer = momentLocalizer(moment);

const AdminDashboard = () => {
  const [category, setCategory] = useState("present");
  const [feedbackCounts, setFeedbackCounts] = useState({ past: 0 });
  const [eventCounts, setEventCounts] = useState({
    upcoming: 0,
    ongoing: 0,
    past: 0,
  });
  const [showOptions, setShowOptions] = useState(false)
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [presentEvents, setPresentEvents] = useState([])

  const fetchFeedbackCounts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getFeedback");
      setFeedbackCounts({ past: response.data.past || 0 });
    } catch (error) {
      console.error("Error fetching feedback counts:", error);
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

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAllEvents");
      const eventList = response.data.events;

      console.log(eventList);

      const now = new Date();

      const categorizedEvents = {
        // upcoming: eventList.filter((event) => new Date(event.startDate) > now),
        present: eventList.filter(
          (event) => new Date(event.startDate) <= now && new Date(event.endDate) >= now
        ),
        // past: eventList.filter((event) => new Date(event.endDate) < now),
      };

      setPresentEvents(categorizedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  const fetchEventCountsAndEvents = async () => {
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

      const formattedEvents = eventList.map((event) => ({
        title: event.eventName,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

 
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAnnouncements");
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchFeedbackCounts();
    fetchEventCountsAndEvents();
    fetchAnnouncements();
  }, []);

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
      legend: { position: "top" },
    },
  };

  const barData = {
    labels: ["Past Events"],
    datasets: [
      {
        label: "Feedback for Past Events",
        data: [feedbackCounts.past],
        backgroundColor: "#f8bbd0",
        borderColor: "#f8bbd0",
        borderWidth: 3,
        barThickness: 50,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <section className="bg-slate-100 shadow-xl h-[100%] rounded-lg p-6 mb-6 hover:shadow-2xl transition-shadow grid grid-cols-2 justify-center">
          <div className="w-full max-w-4xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">Calendar of Events</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{
                height: 400,
                width: "1000", 
                borderRadius: "8px",
                overflow: "hidden",
                color: "#555",
              }}
              views={["month", "week", "day", "agenda"]}
              aria-label="Event Calendar"
            />

            
          </div>

          <div className="text-xl overflow-y-scroll font-semibold text-gray-800 mb-4 ml-4 text-left">
            <p>Ongoing Events</p>
            
            {console.log("present", presentEvents[category])}

            {presentEvents[category]?.length > 0 ? (
            <div className="flex justify-center text-sm">
              <div className="w-full flex flex-col items-center justify-center grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-x-6 gap-y-8">
                {presentEvents[category].map((event, index) => (
                  <div
                    key={event.eventId || index}
                    className={`relative ${category != 'upcoming'? 'w-[80%]' : 'w-[50%]'}  min-h-[80px] flex flex-row border shadow-lg  rounded-2xl transition-all duration-500 overflow-hidden`}
                  >
                    <div className={`w-full grid ${category != 'upcoming'? ' grid-cols-1' : 'grid-cols-1'} bg-red-400`}>
                      <div className="relative">
                        {/* The button to toggle the options */}
                        <div
                          className="absolute right-4 top-4 cursor-pointer"
                          onClick={() => {
                            // Toggle visibility of options for the specific event
                            // setShowOptions(showOptions === event.eventId ? null : event.eventId);
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </div>

                        {/* Conditional rendering of options */}
                        {showOptions === event.eventId && (
                          <div className="shadow-md bg-gray-200 absolute right-6 top-5 px-4 py-2">
                            <p>Edit</p>
                            <p>Delete</p>
                          </div>
                        )}

                        
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
                        <GenerateReport eventId={event.eventId}/>
                      </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className='p-2 relative bg-blue-300 text-blue-900 border border-blue-600 rounded-md my-4 cursor-pointer'
                      >
                        <FontAwesomeIcon icon={faInfoCircle} /> No ongoing events found. </p>
            // <p className="ml-8">No events found.</p>
          )}
          </div>
        </section>

        <section className="bg-slate-100 shadow-xl rounded-lg p-6 mb-6 hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 h-60">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="w-full md:w-1/2 h-60">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
