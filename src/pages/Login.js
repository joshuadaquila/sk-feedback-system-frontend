import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserAlt, FaLock } from 'react-icons/fa'; 

const Login = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userName || !password) {
      setError('Both username and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/user/login', {
        userName,
        password,
      });
      const { role, token } = response.data;

      localStorage.setItem('authToken', token);

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'user') {
        navigate('/user/dashboard');
      } else {
        setError('Invalid role. Please contact support.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-400 p-5">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm w-full"> 
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">SK Event System</h2>
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
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
            >
              Login
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
