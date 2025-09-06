import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(null);

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🧪 E2E Tester</h1>
        </header>


        <div className="form-section">
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!inputValue) return;

            setLoading(true);
            setStatus(null);

            try {
              const response = await axios.post('http://localhost:5000/api/check-url', {
                url: inputValue
              });
              if (response.data.success) {
                setStatus({ success: true, message: 'URL is accessible' });
              } else {
                setStatus({ success: false, message: 'URL is not accessible' });
              }
            } catch (error) {
              setStatus({ success: false, message: 'URL is not accessible' });
            } finally {
              setLoading(false);
            }
          }}>
            <div className="form-group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter URL to test"
                className="form-input"
                data-testid="form-input"
              />
              <button 
                type="submit" 
                className="button"
                data-testid="form-submit"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Submit'}
              </button>
            </div>
            {status && (
              <div className={`status-message ${status.success ? 'success' : 'error'}`} data-testid="url-status">
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
