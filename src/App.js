import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/admin/AdminPanel';
import Dashboard from './pages/admin/Dashboard';
import Events from './pages/admin/Events';
import Announcement from './pages/admin/Announcement';

function App() {
  const isAuthenticated = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/events" element={<Events />} />  
        <Route path="/admin/dashboard" element={<Dashboard />} />  
        <Route path="/admin/adminpanel" element={<AdminPanel />} />
        <Route path="/admin/announcement" element={<Announcement />} /> 
      </Routes>
    </Router>
  );
}

export default App;
