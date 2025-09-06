import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHelloAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/hello');
      setApiResponse(response.data);
    } catch (err) {
      setError('Failed to fetch from API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRootAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/');
      setApiResponse(response.data);
    } catch (err) {
      setError('Failed to fetch from API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🌍 Hello World Full Stack App</h1>
          <p>React Frontend + Express Backend + Playwright Testing</p>
        </header>

        <div className="api-section">
          <h2>Test API Endpoints</h2>
          <button 
            className="button" 
            onClick={fetchRootAPI}
            disabled={loading}
            data-testid="root-api-button"
          >
            {loading ? 'Loading...' : 'Fetch Root API'}
          </button>
          
          <button 
            className="button" 
            onClick={fetchHelloAPI}
            disabled={loading}
            data-testid="hello-api-button"
          >
            {loading ? 'Loading...' : 'Fetch Hello API'}
          </button>

          {apiResponse && (
            <div className="response" data-testid="api-response">
              <h3>API Response:</h3>
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          )}

          {error && (
            <div className="response error" data-testid="api-error">
              <h3>Error:</h3>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="api-section">
          <h2>Features</h2>
          <ul style={{ textAlign: 'left' }}>
            <li>✅ React 18 Frontend</li>
            <li>✅ Express Backend with CORS</li>
            <li>✅ API Integration with Axios</li>
            <li>✅ Error Handling</li>
            <li>✅ Responsive Design</li>
            <li>✅ Playwright Testing Ready</li>
            <li>✅ Docker Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
