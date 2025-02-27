import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCalendar, FaMapPin, FaGlobeAsia, FaSearch } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import axios from "axios";


const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  const [announcementDetails, setAnnouncementDetails] = useState({
    announcementId: "",
    title: "",
    description: "",
    audience: "ALL",
    createdAt: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
  const [successMessage, setSuccessMessage] = useState("");  // Success message state

  const toggleShowMore = (id) => {
    setExpandedAnnouncements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAnnouncements");
      console.log(response.data);  
      const fetchedAnnouncements = response.data.announcements;
      setAnnouncements(fetchedAnnouncements);  
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementDetails({ ...announcementDetails, [name]: value });
  };

  const handleSaveAnnouncement = async () => {
    if (!announcementDetails.title || !announcementDetails.description) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      let response;
      if (announcementDetails.announcementId) {
        response = await axios.put(
          `http://localhost:3001/user/CreateAnnouncements/${announcementDetails.announcementId}`,
          announcementDetails
        );
        console.log('Update Response:', response);
        setSuccessMessage("Announcement updated successfully!");
      } else {
        
        response = await axios.post(
          "http://localhost:3001/user/CreateAnnouncements",
          {
            ...announcementDetails,
            createdAt: new Date().toISOString(),
            userId: localStorage.getItem("userId"),
          }
        );
        console.log('Create Response:', response);
        setSuccessMessage("Announcement created successfully!");
      }
  
      if (response.status === 200 || response.status === 201) {
        fetchAnnouncements();
        setAnnouncementDetails({
          announcementId: "",
          title: "",
          description: "",
          audience: "ALL",
          createdAt: "",
        });
        setIsModalOpen(false);
      } else {
        throw new Error("Operation failed");
      }
  
      setTimeout(() => setSuccessMessage(""), 1000);
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Failed to save announcement. Please try again.");
    }
  };
  
  const handleEditAnnouncement = (announcement) => {
    setAnnouncementDetails(announcement);
    setIsModalOpen(true);
  };

  const handleDeleteAnnouncement = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/user/deleteAnnouncement/${announcementToDelete}`);
      if (response.status === 200) {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter((announcement) => announcement.announcementId !== announcementToDelete)
        );
      }
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting Announcement:", error);
      alert("Failed to delete Announcement. Please try again.");
    }
  };
  useEffect(() => {
    const filtered = announcements.filter((announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnnouncements(filtered);
  }, [searchTerm, announcements]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="sticky top-0 bg-gray-100 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold ml-8 mt-8 text-gray-800">Announcement Management</h2>
          </div>
          <div className="border-b-2 border-gray-600 mt-4"></div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="relative w-[735px] ml-8 ">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
          <button
            className="bg-blue-600 text-white text-sm px-6 py-3 mr-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            onClick={() => {
              setAnnouncementDetails({
                announcementId: "",
                title: "",
                description: "",
                audience: "ALL",
                createdAt: "",
              });
              setIsModalOpen(true);
            }}
          >
            + Add New Announcement
          </button>
        </div>

        {successMessage && (
          <div className="text-green-600 bg-green-100 border-l-4 border-green-500 p-4 my-4">
            <p>{successMessage}</p>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                {announcementDetails.announcementId ? "Edit Announcement" : "Add New Announcement"}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={announcementDetails.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Announcement Title"
                />
                <textarea
                  name="description"
                  value={announcementDetails.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Description"
                />
                <select
                  name="audience"
                  value={announcementDetails.audience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="ALL">All</option>
                  <option value="General">General</option>
                  <option value="Youth">Youth</option>
                  <option value="Parents">Parents</option>
                </select>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={handleSaveAnnouncement}
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

        <div className="mt-5 px-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">📢 All Announcements</h3>

          {announcements.length > 0 ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-6">
                {filteredAnnouncements.map((announcement) => (
                  <div
                    key={announcement.announcementId}
                    className="relative w-[650px] min-h-[150px] bg-white shadow-xl rounded-2xl p-6 "
                  >
                  
                    <p className="font-semibold text-xl text-gray-900">{announcement.title}</p>

                  
                    <div className="flex items-center text-sm text-gray-600 mt-1 space-x-3">
                      <p className="font-medium">@{announcement.userName}</p>
                      <span>•</span>
                      <p className="font-medium flex items-center">
                        <FaCalendar className="text-blue-500 mr-1" />
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                      <span>•</span>
                      <p className="flex items-center font-medium">
                        {announcement.audience.toUpperCase() === "ALL" ? (
                          <><FaGlobeAsia className="text-blue-500 mr-1" /></>
                        ) : (
                          <>{announcement.audience}</>
                        )}
                      </p>
                    </div>

                    <hr className="my-4 border-gray-300" />
                    <p className="mt-4 text-md text-gray-700 leading-relaxed">
                      {expandedAnnouncements[announcement.announcementId] || showMore
                        ? announcement.description
                        : `${announcement.description.slice(0, 120)}...`}
                      <button
                        onClick={() => toggleShowMore(announcement.announcementId)}
                        className="ml-2 text-blue-500 text-sm font-semibold"
                      >
                        {expandedAnnouncements[announcement.announcementId] || showMore ? "Show Less" : "Show More"}
                      </button>
                    </p>

                 
                    <div className="absolute bottom-4 right-5 flex space-x-3">
                      <button
                        onClick={() => handleEditAnnouncement(announcement)}
                        className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition-all"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.announcementId)}
                        className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No announcements yet.</p>
          )}




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
    </div>
  );
};

export default Announcements;