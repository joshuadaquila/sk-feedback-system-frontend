import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import axios from "axios"; 

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementDetails, setAnnouncementDetails] = useState({
    announcementId: "",
    title: "",
    description: "",
    audience: "",
    createdAt: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [showMore, setShowMore] = useState(false);

 
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3001/CreateAnnouncements"); 
      const fetchedAnnouncements = response.data.announcements; 
      const activeAnnouncements = fetchedAnnouncements.filter(
        (announcement) => new Date(announcement.createdAt) <= new Date()
      );

      setAnnouncements(activeAnnouncements);
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
    if (!announcementDetails.title || !announcementDetails.description || !announcementDetails.audience) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      if (announcementDetails.announcementId) {
        await axios.put(`http://localhost:3001/CreateAnnouncements/${announcementDetails.announcementId}`, announcementDetails);
        alert("Announcement updated successfully!");
      } else {
        await axios.post("http://localhost:3001/CreateAnnouncements", announcementDetails);
        alert("Announcement created successfully!");
      }
      fetchAnnouncements();
      setAnnouncementDetails({
        announcementId: "",
        title: "",
        description: "",
        audience: "",
        createdAt: "",
      });
      setIsModalOpen(false);
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
      await axios.delete(`http://localhost:3001/CreateAnnouncements/${announcementToDelete}`); 
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
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="flex justify-between items-center border-b-2 border-gray-600 pb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Announcement Management</h2>
        </div>

        <div className="mt-8 mb-6">
          <h3 className="text-2xl font-semibold mb-6 text-left text-gray-800">Active Announcements</h3>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="bg-blue-600 text-white text-sm px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            onClick={() => {
              setAnnouncementDetails({
                announcementId: "",
                title: "",
                description: "",
                audience: "",
                createdAt: "",
              });
              setIsModalOpen(true);
            }}
          >
            + Add New Announcement
          </button>
        </div>

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
                  <option value="">Select Audience</option>
                  
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
                    className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full hover:scale-105 transform transition-all duration-300"
                  >
                    <div className="mb-4">
                      <h4 className="font-bold text-2xl text-gray-800">{announcement.title}</h4>
                    </div>
                    <div className="mb-4">
                      <p className={`text-base pl-4 text-gray-700 ${showMore ? "" : "line-clamp-3"}`}>
                        {announcement.description}
                      </p>
                      {!showMore && (
                        <button
                          onClick={() => setShowMore(true)}
                          className="text-blue-600 text-sm mt-2"
                        >
                          See More
                        </button>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{announcement.audience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No active announcements yet.</p>
          )}
        </div>

        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md">
              <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">Are you sure you want to delete this announcement?</h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-transform transform hover:scale-105"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-400 transition-transform transform hover:scale-105"
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
};

export default Announcements;
