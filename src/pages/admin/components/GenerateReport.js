import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventReport from './EventReport';
import GenerateError from './GenerateError';

const GenerateReport = ({ eventId, requestCompleted }) => {
  // Initialize states for sentiments and percentages
  const [sentiments, setSentiments] = useState([]);
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [neutralPercentage, setNeutralPercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const [overallSentiment, setOverallSentiment] = useState('');
  const [renderReport, setRenderReport] = useState(false);
  const [error, setError] = useState([])

  useEffect(() => {
    // Async function inside useEffect to handle the request
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/generateReport?eventId=${eventId}`);
        
        // Get the sentiments array from the response
        const fetchedSentiments = response.data.data.sentiments;
        setSentiments(fetchedSentiments); // Set the sentiments

        // Calculate the counts for each sentiment
        const totalSentiments = fetchedSentiments.length;
        const positiveCount = fetchedSentiments.filter(sentiment => sentiment === 'positive').length;
        const neutralCount = fetchedSentiments.filter(sentiment => sentiment === 'neutral').length;
        const negativeCount = fetchedSentiments.filter(sentiment => sentiment === 'negative').length;

        // Calculate percentages
        setPositivePercentage(Number(((positiveCount / totalSentiments) * 100).toFixed(2)));
        setNeutralPercentage(Number(((neutralCount / totalSentiments) * 100).toFixed(2)));
        setNegativePercentage(Number(((negativeCount / totalSentiments) * 100).toFixed(2)));
        

        // Determine the overall sentiment based on the highest count
        if (positiveCount > neutralCount && positiveCount > negativeCount) {
          setOverallSentiment('positive');
        } else if (neutralCount > positiveCount && neutralCount > negativeCount) {
          setOverallSentiment('neutral');
        }else if (negativeCount > positiveCount && negativeCount > neutralCount) {
          setOverallSentiment('negative');
        }else if (positiveCount === negativeCount){
          setOverallSentiment('neutral');
        }else if (negativeCount === neutralCount || positiveCount === neutralCount){
          setOverallSentiment('Mixed Sentiment')
        }

        console.log(error.length === 0); // Check the response in the console
        // requestCompleted(); // Call the function after the request is done
        if (error.length === 0) setRenderReport(true)
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Error fetching report. Please try again later.'); // Set error message
      }
    };

    fetchReport(); // Call the async function when the component mounts or eventId changes
  }, [eventId]);
  console.log(sentiments); // Log the sentiments to the console
  console.log('Overall Sentiment:', overallSentiment); // Log the overall sentiment

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-[40%] max-w-xl max-h-[80%] overflow-y-auto">
        {renderReport && <EventReport overallSentiment={overallSentiment} requestCompleted={requestCompleted}
          positive={positivePercentage} neutral = {neutralPercentage} negative = {negativePercentage} eventId={eventId}
        />}
        {error.length > 0 && <GenerateError requestCompleted={requestCompleted}/>}
        {/* Header Section */}
        <div className="sticky top-0 bg-gray-100 z-10 border-b-2 border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Generating Report</h2>
          </div>
        </div>
        {/* Content Section */}
        <div className="flex flex-col items-center justify-center p-6">
          {/* Spinner Animation */}
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          {/* Status Text */}
          <p className="mt-4 text-gray-600 text-center">
            Please wait while the report is being generated...
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
