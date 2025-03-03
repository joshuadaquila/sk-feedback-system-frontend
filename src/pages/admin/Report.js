import React, { useState, useEffect } from "react";
import { Table, Spin, message, Input, Button } from "antd";  // Importing Ant Design Table, Spin, message, Input, Button
import Sidebar from "./components/Sidebar";
import axios from "axios";
import { SearchOutlined } from '@ant-design/icons';  // To use search icon

const Report = () => {
  const [data, setData] = useState([]);  // State to hold the fetched report data
  const [loading, setLoading] = useState(false);  // State to manage loading state
  const [ldaExplanation, setLdaExplanation] = useState([]);  // State to hold LDA explanation data
  const [error, setError] = useState(null);  // State to manage error state
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");  // State to hold the search text
  const [filteredData, setFilteredData] = useState([]);  // State to hold the filtered data

  useEffect(() => {
    // Async function inside useEffect to handle the request
    const fetchReport = async () => {
      setLoading(true);  // Set loading to true before making the request
      try {
        const response = await axios.get(`https://sk-feedback-system-backend.onrender.com/admin/generateEventReport`);
        const feedbacks = response.data.feedbacks;  // Extract feedbacks from the response
        setData(feedbacks);  // Set the data in state
        setLdaExplanation(response.data.sentimentData.lda_explanations);  // Set LDA explanations
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Error fetching report. Please try again later.');
        message.error('Failed to load the report!');  // Display error message
      } finally {
        setLoading(false);  // Set loading to false after the request is completed
      }
    };

    fetchReport();  // Call the function to fetch the data
  }, []);  // Empty dependency array to run the effect only once when the component mounts

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://sk-feedback-system-backend.onrender.com/user/getEvents')
        setEvents(response.data.events)
        // console.log(response)
      } catch(err) {
        // console.error(err)
      }
    }

    fetchEvents()
  }, []);

  // Group the LDA data by eventId
  const groupedData = ldaExplanation.reduce((acc, item) => {
    const existing = acc.find(entry => entry.eventId === item.eventId);
    if (existing) {
      existing.topWords = existing.topWords.concat(item.lda_explanation.top_words);
      existing.coefficients = existing.coefficients.concat(item.lda_explanation.top_coefficients);
    } else {
      const eventDetails = events.find(event => event.eventId === item.eventId);  // Find the event details based on eventId
      acc.push({
        eventId: item.eventId,
        topWords: item.lda_explanation.top_words,
        coefficients: item.lda_explanation.top_coefficients,
        eventName: eventDetails ? eventDetails.eventName : 'N/A',  // Add event details
        eventDescription: eventDetails ? eventDetails.description : 'N/A',
        eventPlace: eventDetails ? eventDetails.place : 'N/A',
        eventStartDate: eventDetails ? eventDetails.startDate : 'N/A',
      });
    }
    return acc;
  }, []);

  // Format the data to make sure topWords and coefficients are strings
  const formattedData = groupedData.map((item) => {
    return {
      eventId: item.eventId,
      topWords: item.topWords.join(", "),  // Join top words with a comma
      coefficients: item.coefficients.join(", "),  // Join coefficients with a comma
      eventName: item.eventName,
      eventDescription: item.eventDescription,
      eventPlace: item.eventPlace,
      eventStartDate: item.eventStartDate,
    };
  });

  // Filter data based on searchText
  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedFilter = value.toLowerCase();
    const filtered = formattedData.filter(item => 
      item.eventName.toLowerCase().includes(lowercasedFilter) ||
      item.eventPlace.toLowerCase().includes(lowercasedFilter) ||
      item.topWords.toLowerCase().includes(lowercasedFilter) ||
      item.coefficients.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredData(filtered);
  };

  // Define the columns for the Ant Design Table
  const columns = [
    {
      title: 'Event ID',
      dataIndex: 'eventId',
      key: 'eventId',
    },
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
      filterSearch: true, // Enable search for Event Name
    },
    {
      title: 'Event Place',
      dataIndex: 'eventPlace',
      key: 'eventPlace',
    },
    {
      title: 'Top Words',
      dataIndex: 'topWords',
      key: 'topWords',
    },
    {
      title: 'Coefficients',
      dataIndex: 'coefficients',
      key: 'coefficients',
    }
  ];

  // Rendering the component
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

        {/* Search input */}
        <div className="ml-4 mt-4">
          <Input
            placeholder="Search Event..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 250 }}
          />
        </div>

        {/* Conditional rendering based on loading or error */}
        {loading ? (
          <div className="flex justify-center items-center mt-8">
            <Spin tip="Loading..." />  {/* Display a spinner while loading */}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mt-8">
            <p>{error}</p>
          </div>
        ) : (
          <div className="p-4">
            <Table
              dataSource={searchText ? filteredData : formattedData}  // Data to be displayed in the table, filtered if search is active
              columns={columns}   // Columns definition
              rowKey="eventId"    // Unique key for each row, using eventId
              pagination={false}  // Disable pagination if not needed
              bordered            // Optional: Adds a border to the table
              className="mt-8"    // Optional: Add some margin top for spacing
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
