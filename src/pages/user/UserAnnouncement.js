import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import UserSidebar from './userSidebar';

const UserAnnouncement= () => {
  const navigate = useNavigate();
  const announcements = [
    
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.date.includes(searchQuery);
    return matchesSearch;
  });

  const navigateTo = (page) => {
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-gray-200 text-black py-4 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl mt-8">
        <div className="flex flex-col items-start max-w-2xl">
          <h1 className="text-xl font-bold">Announcement</h1>
        </div>
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
      <div className="flex-1 overflow-y-auto mt-8 pt-24 px-6">
        <div className="max-w-screen-md mx-auto">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="mb-4 p-4 border rounded-lg bg-white">
              <h2 className="text-lg font-semibold">{announcement.title}</h2>
              <p className="text-gray-600">{announcement.date}</p>
            </div>
          ))}
        </div>
      </div>
      <UserSidebar navigateTo={navigateTo} />
    </div>
  );
};

export default UserAnnouncement;
