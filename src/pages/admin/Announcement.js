import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCalendar, FaMapPin, FaGlobeAsia } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
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

  // Fetch announcements from the backend
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAnnouncements");
      console.log(response.data);  // Check what the response looks like
      const fetchedAnnouncements = response.data.announcements;
      setAnnouncements(fetchedAnnouncements);  // Assuming the data is in 'announcements'
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
      if (announcementDetails.announcementId) {
        await axios.put(`http://localhost:3001/user/CreateAnnouncements/${announcementDetails.announcementId}`, announcementDetails);
        setSuccessMessage("Announcement updated successfully!");  // Set success message for update
      } else {
        await axios.post("http://localhost:3001/user/CreateAnnouncements", announcementDetails);
        setSuccessMessage("Announcement created successfully!");  // Set success message for new creation
      }
      fetchAnnouncements();
      setAnnouncementDetails({
        announcementId: "",
        title: "",
        description: "",
        audience: "ALL",
        createdAt: "",
      });
      setIsModalOpen(false);
      setTimeout(() => {
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      console.error("Error saving announcement:", error);
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
      await axios.delete(`http://localhost:3001/user/CreateAnnouncements/${announcementToDelete}`);
      const updatedAnnouncements = announcements.filter(
        (announcement) => announcement.announcementId !== announcementToDelete
      );
      setAnnouncements(updatedAnnouncements);
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="sticky top-0 bg-gray-100 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold ml-8 mt-8 text-gray-800">Announcement Management</h2>
          </div>
          <div className="border-b-2 border-gray-600 mt-4"></div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="bg-blue-600 text-white text-sm px-6 py-3 mr-8 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
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

        <div className="mt-5">
          {announcements.length > 0 ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-8">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.announcementId}
                    className="relative w-[600px] min-h-[100px] shadow-md p-4 rounded-md mb-4 m-2 border bg-white "
                  >
                    <p className="font-bold text-lg text-gray-800">{announcement.title}</p>

                    <div className="flex mb-4">
                      <p className="text-gray-600 mr-2 text-xs">@{announcement.userName}</p>
                      <p className="text-gray-600 text-xs">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                      <div className="flex items-center ml-2 text-xs text-gray-600">
                      {announcement.audience.toUpperCase() === "ALL" ? (
                        <FaGlobeAsia className="text-blue-500 mr-1" />
                      ) : null}
                      {announcement.audience.toUpperCase() === "ALL" ? null : (
                        <p>{announcement.audience}</p>
                      )}
                    </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <FaCalendar className="text-blue-500" />
                      <p className="text-sm">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <FaMapPin className="text-blue-500" />
                      <p className="text-sm">{announcement.place || "Location not specified"}</p>
                    </div>

                    <p className="pl-5 mt-3 text-sm text-gray-700">
                      {expandedAnnouncements[announcement.announcementId] || showMore
                        ? announcement.description
                        : `${announcement.description.slice(0, 100)}...`}
                      <button
                        onClick={() => toggleShowMore(announcement.announcementId)}
                        className="ml-2 text-blue-500 text-xs"
                      >
                        {expandedAnnouncements[announcement.announcementId] || showMore ? "Show Less" : "Show More"}
                      </button>
                    </p>

                    <div className="absolute bottom-1 right-4">
                      <button
                        onClick={() => handleEditAnnouncement(announcement)}
                        className="bg-green-600 text-sm text-white p-2 rounded-full"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.announcementId)}
                        className="bg-red-600 text-sm text-white p-2 rounded-full ml-2"
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
        </div>
      </div>
    </div>
  );
};

export default Announcements;
