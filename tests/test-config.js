// Test environment configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:5001',
  timeouts: {
    defaultTimeout: 30000,
    navigationTimeout: 10000,
    elementTimeout: 5000
  },
  testUrls: {
    externalEndpoints: ['https://www.example.com']
  }
};

module.exports = config;
