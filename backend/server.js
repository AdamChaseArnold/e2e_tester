const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'E2E Tester Backend API' });
});

app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'E2E Tester API',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'e2e-tester-backend' });
});

app.post('/api/check-url', async (req, res) => {
  console.log('Received URL check request:', req.body);
  const { url } = req.body;
  
  if (!url) {
    console.log('No URL provided');
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    console.log('Checking URL:', targetUrl);
    
    const response = await axios.get(targetUrl, { 
      timeout: 10000,
      validateStatus: null,
      maxRedirects: 5,
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; E2ETester/1.0)'
      }
    });
    
    console.log('Response status:', response.status);
    
    // Any response indicates the URL is accessible
    const result = { success: true, message: 'URL is accessible' };
    console.log('Sending response:', result);
    res.json(result);
  } catch (error) {
    console.error('Error accessing URL:', error.message);
    res.json({ success: false, message: 'URL is not accessible' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
