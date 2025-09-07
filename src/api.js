/**
 * API utility functions for making requests to the backend server
 * with retry mechanism and error handling
 */

/**
 * Fetches data from the API with retry mechanism
 * @param {string} url - The URL to fetch from
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retries (default: 2)
 * @param {number} retryDelay - Delay between retries in ms (default: 1000)
 * @param {number} timeout - Timeout in ms (default: 10000)
 * @returns {Promise<Object>} - The response data
 */
export const fetchWithRetry = async (
  url,
  options = {},
  retries = 2,
  retryDelay = 1000,
  timeout = 10000
) => {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Add signal to options
    const fetchOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      }
    };
    
    try {
      // Attempt to fetch
      const response = await fetch(url, fetchOptions);
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse and return JSON response
      return await response.json();
    } catch (error) {
      // Clear timeout if it's not an abort error
      if (!error.name || error.name !== 'AbortError') {
        clearTimeout(timeoutId);
      }
      
      // If we have retries left and it's not a 4xx error, retry
      if (
        retries > 0 && 
        (error.name === 'AbortError' || 
         error.message.includes('Failed to fetch') ||
         (error.message.includes('HTTP error') && !error.message.includes('Status: 4')))
      ) {
        console.log(`Retrying fetch to ${url}. Retries left: ${retries}`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        // Retry with one less retry
        return fetchWithRetry(url, options, retries - 1, retryDelay, timeout);
      }
      
      // No more retries or 4xx error, throw the error
      throw error;
    }
  } catch (error) {
    // Format error message for better user experience
    let errorMessage = error.message || 'Unknown error occurred';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Connection timed out. Please check if the server is running.';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Failed to connect to the server. Please check if the server is running.';
    }
    
    // Create a custom error with the formatted message
    const customError = new Error(errorMessage);
    customError.originalError = error;
    throw customError;
  }
};

/**
 * Runs a Playwright test via the backend API
 * @param {string} testUrl - The URL to test with Playwright
 * @returns {Promise<Object>} - The test result
 */
export const runPlaywrightTest = async (testUrl) => {
  if (!testUrl) {
    throw new Error('URL is required to run a test');
  }
  
  const url = `http://localhost:3001/run-test`;
  return fetchWithRetry(url, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: testUrl })
  });
};
