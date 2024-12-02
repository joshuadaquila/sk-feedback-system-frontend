import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import UserSidebar from "./userSidebar";
import UserAnnouncementCard from "../admin/components/UserAnnouncementCard"; // Adjust the import path if necessary

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState(null); // Announcement state

  // Sample data for announcements
  const sampleAnnouncements = [
    {
      id: 1,
      title: "System Maintenance",
      content: "The system will be under maintenance on Dec 5, 2024, from 1:00 PM to 3:00 PM.",
      date: "2024-12-05T13:00:00",
    },
    {
      id: 2,
      title: "Community Meeting",
      content: "Join us at the barangay hall for a community meeting on Dec 10, 2024.",
      date: "2024-12-10T09:00:00",
    },
    {
      id: 3,
      title: "Christmas Party",
      content: "Don't miss the barangay Christmas party on Dec 20, 2024, at 6:00 PM!",
      date: "2024-12-20T18:00:00",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setAnnouncements(sampleAnnouncements);
    }); 
  }, []);

  const navigateTo = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="h-[90%] text-black py-2 flex justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl">
      {/* Top Bar */}
      <div className="bg-gray-200 text-black py-4 h-[10%] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl mt-5">
        <h1 className="text-xl font-bold">Announcements</h1>

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
      <div className="flex-1 overflow-y-auto pt-20 max-w-screen-sm mx-auto rounded-xl mt-6 px-6">
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

export default UserDashboard;
