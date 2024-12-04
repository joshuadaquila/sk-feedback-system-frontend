import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/admin/AdminPanel';
import Events from './pages/admin/Events';
import Announcement from './pages/admin/Announcement';
import UserDashboard from './pages/user/UserDashboard';
import UserAnnouncement from './pages/user/UserAnnouncement';
import Notification from './pages/user/Notification';
import Profile from './pages/user/Profile';

function App() {
  const isAuthenticated = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/events" element={<Events />} />    
        <Route path="/admin/adminpanel" element={<AdminPanel />} />
        <Route path="/admin/announcement" element={<Announcement />} /> 

        
        <Route path="/user/userdashboard" element={<UserDashboard />} />
        <Route path="/user/userannouncement" element={<UserAnnouncement />} />
        <Route path="/user/notification" element={<Notification />} />
        <Route path="/user/profile" element={<Profile />} />
        
      </Routes>
    </Router>
  );
}

export default App;
