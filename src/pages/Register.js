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
    educationBackground: '',
    userName: '',
    gender: '',
    password: '',
    confirmPassword: '',
    status: 'active', 
    userType: 'user',  // Set default value for userType
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // useNavigate hook for redirection

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
      gender,
      userType,
      status,
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
      !password ||
      !confirmPassword ||
      !gender
    ) {
      setError('Please fill in all the required fields.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, include one lowercase, one uppercase, and one unique character.');
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
        gender,
        userType,  
        password,
        status,
      });

      setSuccess('Registration successful! You can now log in.');
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      },2000); // Delay the redirection by 2 seconds for the success message to show

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
        gender: '',
        password: '',
        confirmPassword: '',
        status:'active',
        userType: 'user',  // Reset to default value
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
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-semibold">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-semibold">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="middleName" className="block text-gray-700 font-semibold">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="extensionName" className="block text-gray-700 font-semibold">Extension Name (optional)</label>
              <input
                type="text"
                name="extensionName"
                value={formData.extensionName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="birthday" className="block text-gray-700 font-semibold">Birthday <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-gray-700 font-semibold">Gender <span className="text-red-500">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="purok" className="block text-gray-700 font-semibold">Purok <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="purok"
                value={formData.purok}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="civilStatus" className="block text-gray-700 font-semibold">Civil Status <span className="text-red-500">*</span></label>
              <select
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Civil Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="educationBackground" className="block text-gray-700 font-semibold">Education Background <span className="text-red-500">*</span></label>
              <select
                name="educationBackground"
                value={formData.educationBackground}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
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

            <div>
              <label htmlFor="userName" className="block text-gray-700 font-semibold">Username <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">Confirm Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
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
