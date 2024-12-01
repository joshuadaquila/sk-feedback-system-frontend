import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    birthday: '',
    purok: '',
    civilStatus: '',
    educationBackground: '',  // Updated field name
    userName: '',
    userType: '',
    password: '',
    confirmPassword: '',
    status: '', // New field for status
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const {
      password,
      confirmPassword,
      userName,
      firstName,
      middleName,
      lastName,
      extensionName,
      birthday,
      purok,
      civilStatus,
      educationBackground,
      userType,
    } = formData;
   
    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !birthday ||
      !purok ||
      !civilStatus ||
      !educationBackground ||
      !userName ||
      !userType ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all the required fields.');
      return;
    }

    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/user/createAccount', {
        userName,
        firstName,
        middleName,
        lastName,
        extensionName,
        birthday,
        purok,
        civilStatus,
        educationBackground,
        userType,
        password,
      });

      setSuccess('Registration successful! You can now log in.');
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        extensionName: '',
        birthday: '',
        purok: '',
        civilStatus: '',
        educationBackground: '', 
        userName: '',
        userType: '',
        password: '',
        confirmPassword: '',
        
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900 p-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create Account</h2>
        <p className="text-center text-gray-600 mb-6">Fill in the details to register</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="extensionName"
              value={formData.extensionName}
              onChange={handleChange}
              placeholder="Extension Name (optional)"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="purok"
              value={formData.purok}
              onChange={handleChange}
              placeholder="Purok"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="civilStatus"
              value={formData.civilStatus}
              onChange={handleChange}
              placeholder="Civil Status"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <select
              name="educationBackground"
              value={formData.educationBackground}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Education Background</option>
              <option value="High School Level">High School Level</option>
              <option value="High School Graduate">High School Graduate</option>
              <option value="Elementary Level">Elementary Level</option>
              <option value="Elementary Graduate">Elementary Graduate</option>
              <option value="College Level">College Level</option>
              <option value="College Graduate">College Graduate</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select User Type</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
