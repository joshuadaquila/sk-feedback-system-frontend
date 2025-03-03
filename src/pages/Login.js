import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserAlt, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!userName || !password) {
      setError('Both username and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://sk-feedback-system-backend.onrender.com/user/login', {
        userName,
        password,
      });

      const { role, userId, token } = response.data;
      // console.log("Role from backend:", role);
      // console.log("userId", userId);

      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);

      // Ensure token is in localStorage before proceeding
      if (localStorage.getItem('authToken')) {
        if (role) {
          // navigate('/admin/adminpanel');
          window.location.reload();
        // } else if (role === 'user') {
        //   navigate('/user/userdashboard');
        } else {
          setError('Invalid role. Please contact support.');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 p-5">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">SK Event and Announcement Hub</h1>

        <img
          src={`${process.env.PUBLIC_URL}/logo.jpg`}
          alt="Logo"
          className="w-48 h-48 object-cover rounded-full mx-auto"
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm w-full">
        <div className="p-6">
          <p className="text-center text-gray-600 mb-6">Log in to access your account</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4 relative">
              <FaUserAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                id="username"
                type="text"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-6 relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-2 rounded-lg font-medium tracking-wide flex items-center justify-center gap-2 
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-600'} focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-200`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaSignInAlt className="text-lg" />
                  Login
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-4 bg-gray-100 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-blue-500 font-medium hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
