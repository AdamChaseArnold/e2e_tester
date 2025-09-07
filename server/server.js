/**
 * Playwright Express Test Server
 * 
 * A production-ready Express.js server that integrates with Playwright
 * to run browser tests and return the results via a REST API.
 */

// Import required modules
const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

// Create Express application
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes to allow frontend access

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

/**
 * POST endpoint to run a Playwright test
 * This endpoint launches a headless browser, navigates to the provided URL,
 * and returns the test results
 */
app.post('/run-test', async (req, res) => {
  console.log('Received request to run Playwright test');
  
  // Get URL from request body
  const { url } = req.body;
  
  // Validate URL
  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'URL is required in the request body'
    });
  }
  
  // Validate URL format
  try {
    new URL(url); // This will throw an error if the URL is invalid
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Invalid URL format: ${error.message}`
    });
  }
  
  console.log(`Testing URL: ${url}`);
  
  // Initialize test result object
  let testResult = {
    success: false,
    message: 'Test not completed'
  };
  
  // Launch browser
  let browser = null;
  let context = null;
  let page = null;
  
  try {
    // Set timeout for the entire test operation
    const testTimeout = setTimeout(() => {
      throw new Error('Test execution timed out after 30 seconds');
    }, 30000);
    
    console.log('Launching headless browser...');
    browser = await chromium.launch({ 
      headless: true,
      // Additional browser launch options for production
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    // Create a new browser context with viewport and user agent set
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Playwright E2E Test Runner/1.0'
    });
    
    // Create a new page with error handling
    page = await context.newPage();
    
    // Set navigation timeout
    page.setDefaultNavigationTimeout(15000);
    
    // Navigate to the provided URL with robust error handling
    console.log(`Navigating to ${url}...`);
    const response = await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Verify response status
    if (!response) {
      throw new Error(`Failed to get response from ${url}`);
    }
    
    if (response.status() >= 400) {
      throw new Error(`Received HTTP ${response.status()} from ${url}`);
    }
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log('Network did not reach idle state, but continuing test...');
    });
    
    // Get the page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Take a screenshot for evidence (useful for debugging)
    const screenshotPath = './test-evidence.png';
    await page.screenshot({ path: screenshotPath, fullPage: true })
      .catch(err => console.error('Failed to take screenshot:', err));
    
    // Test passed if we got this far
    testResult = {
      success: true,
      message: `Playwright test passed: Successfully loaded ${url} with title '${title}'`,
      timestamp: new Date().toISOString(),
      title: title
    };
    
    // Clear the timeout since test completed successfully
    clearTimeout(testTimeout);
    
  } catch (error) {
    // Handle any errors that occur during the test
    console.error('Error running Playwright test:', error);
    testResult = {
      success: false,
      message: `Playwright test failed with error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  } finally {
    // Ensure all resources are properly closed to prevent leaks
    try {
      if (page) await page.close().catch(() => {});
      if (context) await context.close().catch(() => {});
      if (browser) {
        console.log('Closing browser...');
        await browser.close().catch(err => {
          console.error('Error closing browser:', err);
        });
      }
    } catch (closeError) {
      console.error('Error during cleanup:', closeError);
    }
    
    // Return the test result
    console.log('Sending test result:', JSON.stringify(testResult, null, 2));
    res.json(testResult);
  }
});

/**
 * GET endpoint to run a Playwright test (legacy support)
 * This endpoint is kept for backward compatibility
 */
app.get('/run-test', async (req, res) => {
  console.log('Received GET request to run Playwright test (legacy endpoint)');
  
  // Initialize test result object
  let testResult = {
    success: false,
    message: 'Test not completed'
  };
  
  // Launch browser
  let browser = null;
  let context = null;
  let page = null;
  
  try {
    // Set timeout for the entire test operation
    const testTimeout = setTimeout(() => {
      throw new Error('Test execution timed out after 30 seconds');
    }, 30000);
    
    console.log('Launching headless browser...');
    browser = await chromium.launch({ 
      headless: true,
      // Additional browser launch options for production
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    // Create a new browser context with viewport and user agent set
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Playwright E2E Test Runner/1.0'
    });
    
    // Create a new page with error handling
    page = await context.newPage();
    
    // Set navigation timeout
    page.setDefaultNavigationTimeout(15000);
    
    // Navigate to Google with robust error handling
    console.log('Navigating to https://www.google.com...');
    const response = await page.goto('https://www.google.com', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Verify response status
    if (!response) {
      throw new Error('Failed to get response from https://www.google.com');
    }
    
    if (response.status() >= 400) {
      throw new Error(`Received HTTP ${response.status()} from https://www.google.com`);
    }
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log('Network did not reach idle state, but continuing test...');
    });
    
    // Get the page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Take a screenshot for evidence (useful for debugging)
    const screenshotPath = './test-evidence.png';
    await page.screenshot({ path: screenshotPath, fullPage: true })
      .catch(err => console.error('Failed to take screenshot:', err));
    
    // Assert that the title is 'Google'
    if (title === 'Google') {
      testResult = {
        success: true,
        message: "Playwright test passed: The title is 'Google'.",
        timestamp: new Date().toISOString()
      };
    } else {
      testResult = {
        success: false,
        message: `Playwright test failed: The title is not 'Google'. Actual title: '${title}'`,
        timestamp: new Date().toISOString()
      };
    }
    
    // Clear the timeout since test completed successfully
    clearTimeout(testTimeout);
    
  } catch (error) {
    // Handle any errors that occur during the test
    console.error('Error running Playwright test:', error);
    testResult = {
      success: false,
      message: `Playwright test failed with error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  } finally {
    // Ensure all resources are properly closed to prevent leaks
    try {
      if (page) await page.close().catch(() => {});
      if (context) await context.close().catch(() => {});
      if (browser) {
        console.log('Closing browser...');
        await browser.close().catch(err => {
          console.error('Error closing browser:', err);
        });
      }
    } catch (closeError) {
      console.error('Error during cleanup:', closeError);
    }
    
    // Return the test result
    console.log('Sending test result:', JSON.stringify(testResult, null, 2));
    res.json(testResult);
  }
});

// Health check endpoint for monitoring systems
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Start the server with proper error handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 Access the test endpoint at http://localhost:${PORT}/run-test (POST)`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}
