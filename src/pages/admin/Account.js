import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCalendar, FaMapPin, FaGlobeAsia } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faClose, faEye, faUserAltSlash, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { Modal } from 'antd';

const Account = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // To hold the user data for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To control the modal visibility
  const [confirmationDel, setConfirmationDel] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("https://sk-feedback-system-backend.onrender.com/user/getAllUsers");
      // console.log(response);
      setUsers(response.data); // Assuming 'data' is the actual user array
    };

    fetchUsers();
  }, [confirmation, confirmationDel]);

  const formatDate = (date) => {
    const options = {
      // weekday: 'long', // "Monday"
      year: 'numeric', // "2023"
      month: 'long', // "November"
      day: 'numeric', // "3"
      hour: 'numeric', // "5"
      minute: 'numeric', // "00"
      hour12: true, // 12-hour format with AM/PM
    };

    if (!date) return null; // Correct the syntax here

    return new Date(date).toLocaleString("en-US", options); // Correct return placement
  };

  // Open modal with user data
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  const disableAccount = async () => {
    // console.log("user", user)
    
    const response = await axios.post(`https://sk-feedback-system-backend.onrender.com/user/${user.status === 'active'? 'disable' : 'enable'}User/${user.userId}`);
    // console.log(response)

    setConfirmation(false)

    if (response.status === 200){
      Modal.info({
        title: 'Information',
        content: `User is ${user.status === 'active'? 'disabled': 'enabled'} successfully.`,
        onOk() {},
      });
    }
  }

  const deleteAccount = async () => {
    // console.log("user", user)
    
    const response = await axios.post(`https://sk-feedback-system-backend.onrender.com/user/deleteUser/${user.userId}`);
    // console.log(response)

    setConfirmationDel(false)

    if (response.status === 200){
      Modal.info({
        title: 'Information',
        content: 'User is deleted successfully.',
        onOk() {},
      });
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="sticky top-0 bg-gray-100 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold ml-8 mt-8 text-gray-800">
              User Account Management
            </h2>
          </div>
          <div className="border-b-2 border-gray-600 mt-4"></div>
        </div>

        {/* Table Section */}
        <div className="p-8">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-6 py-3 text-left">User ID</th>
                <th className="px-6 py-3 text-left">First Name</th>
                <th className="px-6 py-3 text-left">Middle Name</th>
                <th className="px-6 py-3 text-left">Last Name</th>
                <th className="px-6 py-3 text-left">User Type</th>
                <th className="px-6 py-3 text-left">Last Login</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="border-t border-gray-200">
                  <td className="px-6 py-4">{user.userId}</td>
                  <td className="px-6 py-4">{user.firstName}</td>
                  <td className="px-6 py-4">{user.middleName}</td>
                  <td className="px-6 py-4">{user.lastName}</td>
                  <td className="px-6 py-4">{user.userType}</td>
                  <td className="px-6 py-4">{formatDate(user.lastLogin)}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => openModal(user)}
                    >
                      <FontAwesomeIcon icon={faEye} className="inline mr-2" /> View
                    </button>
                    <button className="text-blue-500 hover:text-blue-700 ml-4"
                    onClick={()=> {setUser(user); setConfirmation(true)}}
                    >
                      <FontAwesomeIcon icon={user.status == "active"? faUserAltSlash : faUserCheck} className="inline mr-2"
                       /> {user.status === 'active'? "Disable" : "Enable"} 
                    </button>
                    <button className="text-red-500 hover:text-red-700 ml-4"
                    onClick={()=> {setUser(user); setConfirmationDel(true)}}
                    >
                      <FaTrash className="inline mr-2" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for View User Details */}
        {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-20 flex justify-center items-center">
            <div className="bg-white relative p-6 rounded-lg w-[90%] max-w-4xl shadow-lg h-[90%]">
            <h3 className="text-2xl font-semibold mb-4 text-center">User Details</h3>
            <button
                    className="bg-red-500 absolute top-4 right-4 text-white py-2 px-6 rounded hover:bg-red-600 transition"
                    onClick={closeModal}
                >
                    <FontAwesomeIcon icon={faClose} />
                </button>
            <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info Section */}
                <div className="mb-4">
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-600">User ID</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="userId"
                        value={selectedUser.userId}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-600">User Name</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="userName"
                        value={selectedUser.userName}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">First Name</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="firstName"
                        value={selectedUser.firstName}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="middleName" className="block text-sm font-medium text-gray-600">Middle Name</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="middleName"
                        value={selectedUser.middleName}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">Last Name</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="lastName"
                        value={selectedUser.lastName}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                {/* Additional Details Section */}
                <div className="mb-4">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-600">Gender</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="gender"
                        value={selectedUser.gender}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="civilStatus" className="block text-sm font-medium text-gray-600">Civil Status</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="civilStatus"
                        value={selectedUser.civilStatus}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="educationBackground" className="block text-sm font-medium text-gray-600">Education Background</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="educationBackground"
                        value={selectedUser.educationBackground}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="purok" className="block text-sm font-medium text-gray-600">Purok</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="purok"
                        value={selectedUser.purok}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                {/* Date Information Section */}
                <div className="mb-4">
                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-600">Birthday</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="birthday"
                        value={formatDate(selectedUser.birthday)}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="lastLogin" className="block text-sm font-medium text-gray-600">Last Login</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="lastLogin"
                        value={formatDate(selectedUser.lastLogin)}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="createdAt" className="block text-sm font-medium text-gray-600">Created At</label>
                    <div className="relative mt-1">
                    <input
                        type="text"
                        id="createdAt"
                        value={formatDate(selectedUser.createdAt)}
                        readOnly
                        className="w-full px-2 py-2 text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                

                </div>

                <div className="flex justify-center mt-6">
                
                </div>
            </form>
            </div>
        </div>
        )}

        {confirmation && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-20 flex justify-center items-center">
                <div className="bg-white relative p-6 rounded-lg max-w-4xl shadow-lg">
                    <p>Are you sure you want to {user.userId === 'active'? "disable" : "enable"} this account?</p>

                    <div className="w-full flex justify-center items-center text-white justify">

                    <button className="bg-blue-600 p-2 px-4 m-2 rounded-md"
                        onClick={disableAccount}
                    >
                        Yes
                    </button>

                    <button className="bg-red-600 p-2 px-4 rounded-md"
                        onClick={()=> setConfirmation(false)}
                    >
                        No
                    </button>

                    </div>
                </div>
            </div>
        )}

        {confirmationDel && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-20 flex justify-center items-center">
                <div className="bg-white relative p-6 rounded-lg max-w-4xl shadow-lg">
                    <p>Are you sure you want to delete this account?</p>

                    <div className="w-full flex justify-center items-center text-white justify">

                    <button className="bg-blue-600 p-2 px-4 m-2 rounded-md"
                        onClick={deleteAccount}
                    >
                        Yes
                    </button>

                    <button className="bg-red-600 p-2 px-4 rounded-md"
                        onClick={()=> setConfirmationDel(false)}
                    >
                        No
                    </button>

                    </div>
                </div>
            </div>
        )}


      </div>
    </div>
  );
};

export default Account;
