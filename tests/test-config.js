// Test environment configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  timeouts: {
    defaultTimeout: 30000,
    navigationTimeout: 10000,
    elementTimeout: 5000
  },
  testUrls: {
    externalEndpoints: ['https://www.google.com']
  }
};

module.exports = config;
