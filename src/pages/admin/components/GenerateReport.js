import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventReport from './EventReport';
import GenerateError from './GenerateError';
import WordCloud from 'react-wordcloud';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';

const GenerateReport = ({ eventId, requestCompleted }) => {
  // Initialize states for sentiments and percentages
  const [sentiments, setSentiments] = useState([]);
  const [sentimentCount, setSentimentCount] = useState([])
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [neutralPercentage, setNeutralPercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const [overallSentiment, setOverallSentiment] = useState('');
  const [overallSentimentLda, setOverallSentimentLda] = useState('');
  const [renderReport, setRenderReport] = useState(true);
  const [error, setError] = useState([]);
  const [showTip, setShowTip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [viewFeedbacks, setViewFeedbacks] = useState(false)
  
  const [topwords, setTopwords] = useState([]);

  useEffect(() => {
    // Async function inside useEffect to handle the request
    const fetchReport = async () => {
      try {
        const response = await axios.get(`https://sk-feedback-system-backend.onrender.com/admin/generateReport?eventId=${eventId}`);
        // console.log("RESPONSE2", response)
        // Extract positive sentiment-related words
        const positiveWords = response.data.data.sentiment_related_words.positive;

        // Transform the topwords into the required format for WordCloud
        const transformedWords = positiveWords.map((word, index) => ({
          text: word,
          value: 1000 - index * 100 // Decreasing value for each word, starting from 1000 and decreasing by 100 for each subsequent word
        }));

        const overallSentiment = {
          lr: response.data.data.lr,
          lda: response.data.data.lda,
        }
        const totalSentiment = overallSentiment.lr?.length || 0;  // Defaults to 0 if undefined or null
        const positiveCountLr = overallSentiment.lr.filter(sentiment => sentiment === 'positive').length;
        const negativeCountLr = overallSentiment.lr.filter(sentiment => sentiment === 'negative').length;
        const neutralCountLr = overallSentiment.lr.filter(sentiment => sentiment === 'neutral').length;
        // console.log("total ", totalSentiment)
        
        setPositivePercentage(Number(((positiveCountLr / totalSentiment) * 100).toFixed(2)));
        setNeutralPercentage(Number(((neutralCountLr / totalSentiment) * 100).toFixed(2)));
        setNegativePercentage(Number(((negativeCountLr / totalSentiment) * 100).toFixed(2)));

        setSentimentCount({
          positive: positiveCountLr,
          negative: negativeCountLr,
          neutral: neutralCountLr
        });
        

        const positiveCountlda = overallSentiment.lda.filter(sentiment => sentiment === 0).length;
        const negativeCountlda = overallSentiment.lda.filter(sentiment => sentiment === 1).length;
        const neutralCountlda = overallSentiment.lda.filter(sentiment => sentiment === 2).length;

        // console.log("RESPONSE: ", positiveCountLr)
        if (positiveCountLr > neutralCountLr && positiveCountLr > negativeCountLr) {
          setOverallSentiment('positive');
        } else if (neutralCountLr > positiveCountLr && neutralCountLr > negativeCountLr) {
          setOverallSentiment('neutral');
        } else if (negativeCountLr > positiveCountLr && negativeCountLr > neutralCountLr) {
          setOverallSentiment('negative');
        } else if (positiveCountLr === negativeCountLr) {
          setOverallSentiment('neutral');
        } else if (positiveCountLr === negativeCountLr && negativeCountLr === neutralCountLr) {
          setOverallSentiment('Mixed Sentiment');  // All sentiments are tied
        } else if (negativeCountLr === neutralCountLr || positiveCountLr === neutralCountLr) {
          setOverallSentiment('Mixed Sentiment');
        }

        if (positiveCountlda > neutralCountlda && positiveCountlda > negativeCountlda) {
          setOverallSentimentLda('positive');
        } else if (neutralCountlda > positiveCountlda && neutralCountlda > negativeCountlda) {
          setOverallSentimentLda('neutral');
        } else if (negativeCountlda > positiveCountlda && negativeCountlda > neutralCountlda) {
          setOverallSentimentLda('negative');
        } else if (positiveCountlda === negativeCountlda) {
          setOverallSentimentLda('neutral');
        } else if (positiveCountlda === negativeCountlda && negativeCountlda === neutralCountlda) {
          setOverallSentimentLda('Mixed Sentiment');  // All sentiments are tied
        } else if (negativeCountlda === neutralCountlda || positiveCountlda === neutralCountlda) {
          setOverallSentimentLda('Mixed Sentiment');
        }

        // Set the topwords state
        setTopwords(transformedWords);

        // Get the sentiments array from the response
        const fetchedSentiments = response.data.data.sentiments;
        setSentiments(fetchedSentiments); // Set the sentiments

        // Calculate the counts for each sentiment
        const totalSentiments = fetchedSentiments.length;
        const positiveCount = fetchedSentiments.filter(sentiment => sentiment === 'positive').length;
        const neutralCount = fetchedSentiments.filter(sentiment => sentiment === 'neutral').length;
        const negativeCount = fetchedSentiments.filter(sentiment => sentiment === 'negative').length;
        
        // Calculate percentages
       

        // Determine the overall sentiment based on the highest count
        if (positiveCount > neutralCount && positiveCount > negativeCount) {
          setOverallSentiment('positive');
        } else if (neutralCount > positiveCount && neutralCount > negativeCount) {
          setOverallSentiment('neutral');
        } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
          setOverallSentiment('negative');
        } else if (positiveCount === negativeCount) {
          setOverallSentiment('neutral');
        } else if (positiveCount === negativeCount && negativeCount === neutralCount) {
          setOverallSentiment('Mixed Sentiment');  // All sentiments are tied
        } else if (negativeCount === neutralCount || positiveCount === neutralCount) {
          setOverallSentiment('Mixed Sentiment');
        }

        setRenderReport(true);
      } catch (error) {
        // console.error('Error fetching report:', error);
        setError('Error fetching report. Please try again later.');
      }
    };

    fetchReport();
  }, [eventId]);

  const fetchFeedbacks = async (eventId) => {
    // console.log("Fetching Feedbacks")
    setLoading(true);
    try {
      const response = await axios.get(`https://sk-feedback-system-backend.onrender.com/user/getFeedbackByEvent/${eventId}`);
      // console.log("feedback respnse",response)
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      // console.error("Error fetching feedbacks:", error);
      // alert("Failed to load feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect (() => {
    fetchFeedbacks(eventId)
  }, [] )

  const reportData = {
    chartData: {
      labels: ['Positive', 'Neutral', 'Negative'], // Labels for each segment of the pie chart
      datasets: [
        {
          data: [sentimentCount.positive, sentimentCount.neutral, sentimentCount.negative], // Data values corresponding to the labels
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], // Optional: colors for each slice
          hoverBackgroundColor: ['#3B8EAE', '#FFB944', '#FF4C62'], // Optional: hover colors for each slice
        },
      ],
    },
  };

  return (
    <div>
      <p className='font-bold text-center'>Event Report</p>
      <div>
       
        {/* Render the word cloud with transformed data */}
        
        {topwords.length > 0 ? (
          <div className='flex justify-center items-center'>
            <WordCloud words={topwords} style={{ width: '450px', height: '250px'}} />
          </div>
          
        ) : (
          <p className='p-2 relative bg-blue-300 text-blue-900 border border-blue-600 rounded-md my-4 cursor-pointer'
            onMouseEnter={()=>setShowTip(true)} onMouseLeave={()=>setShowTip(false)}
          >
            <FontAwesomeIcon icon={faInfoCircle} /> Word cloud is not available at the moment!</p>
        )}

        { showTip && (
        <div className='bg-white text-sm absolute shadow-md p-2 rounded-md'>
          <p className='text-gray-600'>This happens when the event has not enough feedbacks yet or an error has occured.</p>
        </div>
        )}
        
        {/* Render the rest of the report if necessary */}
        {renderReport && !error && (
          <EventReport 
            overallSentiment={overallSentiment} 
            requestCompleted={requestCompleted}
            positive={positivePercentage} 
            neutral={neutralPercentage} 
            negative={negativePercentage} 
            eventId={eventId}
          />
        )}

        {/* Display error message */}
        {/* {error && <GenerateError message={error} />} */}
        <p className='text-sm'>Overall Sentiment</p>
        
        <div className='ml-4'>
          <div className={`p-2 rounded-md border ${overallSentiment === 'positive' ? 'bg-green-200 border-green-600' : overallSentiment === 'negative' ? 'bg-red-200 border-red-600' : 'bg-yellow-200 border-yellow-600'}`}>            <p className='font-bold text-lg'>{overallSentiment}</p>
            { overallSentiment && (
              <p className='italic text-xs'>*using Logistic Regression</p>
            )}
          </div>

          <div className='px-2'>
            <p className='text-md'>{overallSentimentLda}</p>
              { overallSentimentLda && (
              <p className='italic text-xs'>*using Linear Discriminant Analysis</p>
            )}
          </div>
        </div>
        <div className='border-b border-gray-600 my-2'></div>
        <div className='h-60 grid grid-cols-2 p-2'>
          <Pie
            data={reportData.chartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
            }}
          />

          <div className='p-4'>
            <p>Positive: {positivePercentage} %</p>
            <p>Negative: {negativePercentage} %</p>
            <p>Neutral: {neutralPercentage} %</p>
          </div>
        </div>

        <button onClick={()=> setViewFeedbacks(true)}>View Feedbacks</button>
      </div>
      
      {viewFeedbacks && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white relative p-6 w-3/4 max-w-4xl rounded-lg shadow-lg">
          <FontAwesomeIcon icon={faClose} className='absolute right-4 top-4 cursor-pointer' onClick={() => setViewFeedbacks(false)} />
          <p className="font-semibold text-xl mb-4">Feedbacks</p>

          <div className="overflow-y-scroll max-h-96">
            {feedbacks.length === 0 ? (
              <p className="text-center text-gray-500 bg-blue-100 p-4 rounded-md">No feedbacks available.</p>
            ) : (
              feedbacks.map((feedback, index) => (
                <div key={index} className="p-4 border shadow-md m-2">
                  <p>{feedback.content}</p>
                  <p className="text-gray-600 text-sm">{feedback.createdAt}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )}

    </div>
  );
};

export default GenerateReport;
