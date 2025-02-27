import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCalendar, FaMapPin, FaGlobeAsia } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import axios from "axios";

const Report = () => {
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="sticky top-0 bg-gray-100 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold ml-8 mt-8 text-gray-800">Report</h2>
          </div>
          <div className="border-b-2 border-gray-600 mt-4"></div>
        </div>

        
      </div>
    </div>
  );
};

export default Report;