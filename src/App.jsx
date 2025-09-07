import React, { useState, useEffect, useCallback } from 'react';
import { runPlaywrightTest } from './api';
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
  
  // State for URL input - restricted to zoomwarriors.com
  const [url, setUrl] = useState('https://zoomwarriors.com');
  
  // State for toast notifications
  const [toast, setToast] = useState(null);
  
  // Function to run the E2E test
  const runTest = useCallback(async () => {
    // Ensure URL is zoomwarriors.com
    if (url !== 'https://zoomwarriors.com') {
      setUrl('https://zoomwarriors.com');
      setToast({
        type: 'error',
        message: 'Only https://zoomwarriors.com is allowed for testing'
      });
      return;
    }
    
    // Update state to loading
    setTestState({ status: 'loading', data: null, error: null });
    
    try {
      console.log(`Starting Playwright test for URL: ${url}...`);
      
      // Use the API utility with retry mechanism
      const data = await runPlaywrightTest(url);
      console.log('Received response from server:', data);
      
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
        error: error.message
      });
      
      // Show error toast
      setToast({
        type: 'error',
        message: `Error: ${error.message}`
      });
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
    <div className="min-h-screen bg-[#121620] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="corporate-container dark-glow p-8">
          {/* Header with modern corporate logo for dark theme */}
          <div className="corporate-header flex items-center justify-center mb-8">
            <div className="corporate-logo mr-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#3A7BD5" fillOpacity="0.15"/>
                <path d="M20 10L10 15V25L20 30L30 25V15L20 10Z" stroke="#3A7BD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 15L20 20" stroke="#3A7BD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 20L20 30" stroke="#3A7BD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 20L30 15" stroke="#3A7BD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12.5L25 17.5" stroke="#3A7BD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#e1e6ef]" data-testid="app-title">
                CW E2E Test Runner
              </h1>
              <p className="text-sm text-[#a0aec0] mt-1">Automated web testing platform</p>
            </div>
          </div>
          
          {/* URL input field with dark theme corporate styling */}
          <div className="mb-6">
            <label htmlFor="url-input" className="block text-sm font-medium text-[#e1e6ef] mb-2">
              Enter URL to test:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z" stroke="#3A7BD5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.3335 8.00004C5.3335 11.6819 6.52016 14.6667 8.00016 14.6667C9.48016 14.6667 10.6668 11.6819 10.6668 8.00004C10.6668 4.31814 9.48016 1.33337 8.00016 1.33337C6.52016 1.33337 5.3335 4.31814 5.3335 8.00004Z" stroke="#3A7BD5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.3335 8H14.6668" stroke="#3A7BD5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl('https://zoomwarriors.com')}
                placeholder="https://zoomwarriors.com"
                className="corporate-input w-full pl-10 pr-4 py-3 rounded-md shadow-sm focus:outline-none focus:ring-[#3a7bd5] focus:border-[#3a7bd5]"
                disabled={true}
                data-testid="url-input"
              />
            </div>
            <p className="mt-1 text-xs text-[#a0aec0]">This application is configured to only test https://zoomwarriors.com</p>
          </div>
          
          {/* Test button with dark theme corporate styling */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={runTest}
              disabled={testState.status === 'loading'}
              className={`
                corporate-button corporate-button-primary dark-glow
                px-8 py-3 rounded-md font-medium text-white
                ${testState.status === 'loading' 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover-transition'}
                focus:outline-none focus:ring-2 focus:ring-[#3a7bd5] focus:ring-opacity-50
                shadow-md hover:shadow-lg w-full sm:w-auto
              `}
              aria-live="polite"
              data-testid="run-test-button"
            >
              <span className="flex items-center justify-center">
                {testState.status === 'loading' ? (
                  <>Running Test...</>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 5V10L13.3333 11.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Test URL
                  </>
                )}
              </span>
            </button>
          </div>
          
          <hr className="border-t border-[#2a3142] my-8" />
          
          {/* Result display area with dark theme corporate styling */}
          <div className="mt-8">
            <div className="flex items-center mb-3">
              <h2 className="text-lg font-semibold text-[#e1e6ef]">Test Results</h2>
              <div className="ml-auto">
                {testState.status !== 'idle' && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${testState.status === 'loading' ? 'bg-[#1e2433] text-[#3a7bd5]' : testState.status === 'success' && testState.data?.success ? 'bg-[#1c2a25] text-[#48bb78]' : 'bg-[#2d1e24] text-[#f56565]'}`}>
                    {testState.status === 'loading' ? 'Running' : testState.status === 'success' && testState.data?.success ? 'Success' : 'Failed'}
                  </span>
                )}
              </div>
            </div>
            <div 
              className={`p-5 rounded-md border ${testState.status === 'loading' ? 'corporate-loading dark-glow' : testState.status === 'success' ? (testState.data?.success ? 'corporate-success' : 'corporate-error dark-glow-error') : testState.status === 'error' ? 'corporate-error dark-glow-error' : 'corporate-neutral'} transition-colors duration-300`}
              role="status"
              aria-live="polite"
              data-testid="test-results"
            >
              {testState.status === 'success' && testState.data?.success && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#48BB78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke="#48BB78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{getResultContent()}</p>
                  </div>
                </div>
              )}
              {((testState.status === 'success' && !testState.data?.success) || testState.status === 'error') && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#F56565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 6.66667V10" stroke="#F56565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 13.3333H10.0083" stroke="#F56565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{getResultContent()}</p>
                  </div>
                </div>
              )}
              {testState.status === 'loading' && (
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    <svg className="animate-spin h-5 w-5 text-[#3a7bd5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-sm">Loading... Running test on the server.</p>
                </div>
              )}
              {testState.status === 'idle' && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 10L10 6.66667" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 13.3333H10.0083" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{getResultContent()}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Show timestamp if test has been run */}
            {testState.data?.timestamp && (
              <div className="mt-2 text-xs text-[#6c7793] text-right">
                Last run: {new Date(testState.data.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with dark theme corporate styling */}
        <footer className="mt-10 text-center text-xs text-[#6c7793]">
          <div className="flex items-center justify-center space-x-1">
            <span>© {new Date().getFullYear()} CW E2E Test Runner</span>
            <span>•</span>
            <span>Built with React, Tailwind CSS, and Playwright</span>
          </div>
        </footer>
      </div>
      
      {/* Toast notification with dark theme corporate styling */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-md shadow-lg
          ${toast.type === 'success' ? 'dark-bg-success border border-[#2d503c]' : 'dark-bg-error dark-glow-error border border-[#4e2a32]'} text-[#e1e6ef]`}
          role="alert"
          data-testid="toast-notification"
        >
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <svg className="h-5 w-5 text-[#48bb78] mr-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#48bb78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke="#48bb78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="h-5 w-5 text-[#f56565] mr-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#f56565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6.66667V10" stroke="#f56565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 13.3333H10.0083" stroke="#f56565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-auto pl-3 text-[#a0aec0] hover:text-[#e1e6ef] focus:outline-none"
              aria-label="Close notification"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
