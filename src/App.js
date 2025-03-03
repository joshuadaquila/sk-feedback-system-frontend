import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/admin/AdminPanel';
import Events from './pages/admin/Events';
import Announcement from './pages/admin/Announcement';
import Report from './pages/admin/Report';
import Account from './pages/admin/Account';
import UserDashboard from './pages/user/UserDashboard';
import UserAnnouncement from './pages/user/UserAnnouncement';
import Notification from './pages/user/Notification';
import Profile from './pages/user/Profile';

// Function to check authentication
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

// Function to get user role
const getUserRole = () => {
  return localStorage.getItem('userRole'); // Assuming 'admin' or 'user' is stored in localStorage
};

function App() {
  useEffect(() => {
    axios.get('https://sentiment-api-1.onrender.com/healthz')
      .then(response => {
        console.log('Server Health Check:', response.data);
      })
      .catch(error => {
        console.log('Health Check Failed:', error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? getUserRole() === 'admin'
                ? <Navigate to="/admin/adminpanel" />
                : <Navigate to="/admin/adminpanel" />
              : <Navigate to="/login" />
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <Register />} />
        <Route path="/admin/adminpanelS" element={<AdminPanel />} />
        {/* Admin Routes */}
        {isAuthenticated() && (
          <>
            <Route path="/admin/adminpanel" element={<AdminPanel />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/announcement" element={<Announcement />} />
            <Route path="/admin/report" element={<Report />} />
            <Route path="/admin/account" element={<Account />} />
          </>
        )}

        {/* User Routes */}
        {isAuthenticated() && (
          <>
            <Route path="/user/userdashboard" element={<UserDashboard />} />
            <Route path="/user/userannouncement" element={<UserAnnouncement />} />
            <Route path="/user/notification" element={<Notification />} />
            <Route path="/user/profile" element={<Profile />} />
          </>
        )}

        {/* Catch-all: Redirect to login if unauthorized */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
