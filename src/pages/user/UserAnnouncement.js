import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import UserSidebar from "./userSidebar";
import axios from "axios";
import UserAnnouncementCard from "../admin/components/UserAnnouncementCard"; // Adjust the import path if necessary

const Announcement = () => {
  
  const navigate = useNavigate(); // Initialize `navigate`
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Initialize `searchQuery`

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/getAnnouncements");
      const fetchedAnnouncements = response.data.announcements; // Adjust based on actual API structure
      setAnnouncements(fetchedAnnouncements || []); // Safeguard if data is undefined
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const navigateTo = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="h-[90%] text-black py-1 flex justify-between px-4 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-lg mt-4">
      {/* Top Bar */}
      <div className="bg-gray-200 text-black py-2 flex items-center h-[8%] justify-between px-4 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-lg mt-4">
        <h1 className="text-base font-bold">Announcements</h1>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search announcements..."
            className="px-4 py-2 rounded-full border border-gray-300 text-black focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-16 px-4">
        {announcements ? (
          <>
            <h2 className="text-lg font-bold mb-4 bg-gray-200 my-4 p-2"> All Announcements</h2>
            {announcements.length > 0 ? (
              announcements
                .filter((announcement) =>
                  announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((announcement) => (
                  <UserAnnouncementCard key={announcement.id} data={announcement} />
                ))
            ) : (
              <p>No announcements available.</p>
            )}
          </>
        ) : (
          <p>Loading announcements...</p>
        )}
      </div>

      {/* Sidebar */}
      <UserSidebar navigateTo={navigateTo} />
    </div>
  );
};

export default Announcement;
