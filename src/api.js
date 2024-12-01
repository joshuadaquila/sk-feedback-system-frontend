// api.js
const BASE_URL = 'http:localhost:3001/'; // Replace with your actual API base URL

// Helper function to handle API requests (GET and POST)
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body); // Add the request body for POST requests
  }

  try {
    const response = await fetch(url, options);

    // Check if the response is successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: null, error: error.message || 'An unexpected error occurred.' };
  }
};

// GET request handler
const get = async (endpoint) => {
  return apiRequest(endpoint, 'GET');
};

// POST request handler
const post = async (endpoint, body) => {
  return apiRequest(endpoint, 'POST', body);
};

export { get, post };
