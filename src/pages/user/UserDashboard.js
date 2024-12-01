import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import UserSidebar from './userSidebar';

const UserDashboard = () => {
  const navigate = useNavigate();
  const events = [
    { id: 1, title: 'Community Cleanup', date: '2024-12-05', type: 'upcoming' },
    { id: 2, title: 'Christmas Party', date: '2024-12-20', type: 'upcoming' },
    { id: 3, title: 'Past Charity Run', date: '2024-01-10', type: 'past' },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filteredEvents = events.filter((event) => {
    const matchesCategory = category === 'all' || event.type === category;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.date.includes(searchQuery);
    return matchesCategory && matchesSearch;
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
      <div className="bg-gray-200 text-black py-2 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto rounded-xl mt-5">
        <div className="flex flex-col items-start max-w-2xl space-y-1">
          <h1 className="text-xl font-bold">Events</h1>
          <div className="mb-2">
            <div className="flex space-x-4">
              {["all", "present", "upcoming", "past"].map((cat) => (
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
      <div className="flex-1 overflow-y-auto mt-8 pt-24 px-6">
        <div className="max-w-screen-md mx-auto"></div>
      </div>
      <UserSidebar navigateTo={navigateTo} />
    </div>
  );
};

export default UserDashboard;
