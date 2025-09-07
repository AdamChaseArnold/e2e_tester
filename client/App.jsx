import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/**
 * App Component - Main component for the Playwright E2E Test Runner
 * 
 * This component provides a user interface for running Playwright tests
 * and displaying the results.
 */
function App() {
  // State for test results and loading status
  const [testState, setTestState] = useState({
    status: 'idle', // idle, loading, success, error
    data: null,
    error: null
  });
  
  // State for URL input
  const [url, setUrl] = useState('');
  
  // State for toast notifications
  const [toast, setToast] = useState(null);
  
  // Function to run the E2E test
  const runTest = useCallback(async () => {
    // Validate URL
    if (!url) {
      setToast({
        type: 'error',
        message: 'Please enter a URL to test'
      });
      return;
    }
    
    // Try to validate URL format
    try {
      new URL(url);
    } catch (error) {
      setToast({
        type: 'error',
        message: `Invalid URL format: ${error.message}`
      });
      return;
    }
    
    // Update state to loading
    setTestState({ status: 'loading', data: null, error: null });
    
    try {
      // Make fetch request to the test server
      const response = await fetch('http://localhost:3001/run-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ url })
      });
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse the JSON response
      const data = await response.json();
      
      // Update state with the response data
      setTestState({ status: 'success', data, error: null });
      
      // Show success toast
      setToast({
        type: data.success ? 'success' : 'error',
        message: data.success ? 'Test completed successfully!' : 'Test failed!'
      });
      
      return data;
    } catch (error) {
      // Handle any errors
      console.error('Error running test:', error);
      
      // Update state with the error
      setTestState({
        status: 'error',
        data: null,
        error: error.message || 'Unknown error occurred'
      });
      
      // Show error toast
      setToast({
        type: 'error',
        message: `Error: ${error.message}`
      });
      
      throw error;
    }
  }, [url]);
  
  // Clear toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Determine result message based on state
  const getResultContent = () => {
    switch (testState.status) {
      case 'loading':
        return (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading... Running test on the server.</span>
          </div>
        );
      case 'success':
        return testState.data?.message || 'Test completed successfully';
      case 'error':
        return `Error: ${testState.error}. Make sure the server is running at http://localhost:3001`;
      default:
        return 'No tests run yet. Click the button above to start a test.';
    }
  };
  
  // Determine result container class based on state
  const getResultContainerClass = () => {
    switch (testState.status) {
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'success':
        return testState.data?.success 
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-red-50 border-red-200 text-red-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header with logo */}
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl mr-2" role="img" aria-label="Playwright logo">🎭</span>
            <h1 className="text-2xl font-bold text-center text-gray-800" data-testid="app-title">
              Playwright Test Runner
            </h1>
          </div>
          
          {/* URL input field */}
          <div className="mb-4">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
              Enter URL to test:
            </label>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={testState.status === 'loading'}
              data-testid="url-input"
            />
          </div>
          
          {/* Test button */}
          <div className="flex justify-center mb-6">
            <button 
              onClick={runTest}
              disabled={testState.status === 'loading'}
              className={`
                px-6 py-3 rounded-md font-medium text-white
                ${testState.status === 'loading' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
                transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                shadow-md hover:shadow-lg
              `}
              aria-live="polite"
              data-testid="run-test-button"
            >
              <span className="flex items-center justify-center">
                {testState.status === 'loading' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running Test...
                  </>
                ) : 'Test URL'}
              </span>
            </button>
          </div>
          
          {/* Result display area */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Test Results:</h2>
            <div 
              className={`p-4 rounded-md border ${getResultContainerClass()} transition-colors duration-300`}
              role="status"
              aria-live="polite"
              data-testid="test-results"
            >
              {getResultContent()}
            </div>
            
            {/* Show timestamp if test has been run */}
            {testState.data?.timestamp && (
              <div className="mt-2 text-xs text-gray-500 text-right">
                Last run: {new Date(testState.data.timestamp).toLocaleString()}
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-6 text-sm text-gray-600 border-t pt-4">
            <p className="mb-2">
              <strong>How it works:</strong> Enter a URL and click "Test URL" to run a Playwright test on that website.
            </p>
            <p className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Make sure the server is running with <code className="bg-gray-100 px-1 py-0.5 rounded">node server/server.js</code> before running tests.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-500">
          <p>Built with React, Tailwind CSS, and Playwright</p>
        </footer>
      </div>
      
      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
          role="alert"
          data-testid="toast-notification"
        >
          <div className="flex items-center">
            <span className="mr-2">
              {toast.type === 'success' ? '✅' : '❌'}
            </span>
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
