// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * End-to-End Test for Playwright Test Runner Application
 * 
 * This test verifies that the application can:
 * 1. Load the frontend application
 * 2. Enter a URL in the input field
 * 3. Click the "Test URL" button
 * 4. Wait for the test to complete
 * 5. Verify that the test result indicates success
 */

test('Enter URL, run test and verify success message', async ({ page }) => {
  // Navigate to the frontend application
  await page.goto('http://localhost:3000');
  
  // Verify that the page has loaded correctly
  await expect(page.locator('[data-testid="app-title"]')).toHaveText('Playwright Test Runner');
  
  // Take a screenshot of the initial state
  await page.screenshot({ path: './e2e-tests/screenshots/initial-state.png' });
  
  // Enter a URL in the input field
  const testUrl = 'https://www.google.com';
  console.log(`Entering URL: ${testUrl}`);
  await page.locator('[data-testid="url-input"]').fill(testUrl);
  
  // Click the "Test URL" button
  console.log('Clicking the "Test URL" button...');
  await page.locator('[data-testid="run-test-button"]').click();
  
  // Verify that the loading state is displayed
  await expect(page.locator('[data-testid="test-results"]')).toContainText('Loading... Running test on the server');
  
  // Take a screenshot of the loading state
  await page.screenshot({ path: './e2e-tests/screenshots/loading-state.png' });
  
  // Wait for the test result to be displayed (with timeout)
  console.log('Waiting for test results...');
  await page.waitForSelector('[data-testid="test-results"]:not(:has-text("Loading"))', { 
    timeout: 30000 
  });
  
  // Take a screenshot of the results
  await page.screenshot({ path: './e2e-tests/screenshots/results-state.png' });
  
  // Verify that the test result indicates success
  await expect(page.locator('[data-testid="test-results"]')).toContainText("Playwright test passed");
  await expect(page.locator('[data-testid="test-results"]')).toContainText(testUrl);
  
  // Check for toast notification
  const toast = page.locator('[data-testid="toast-notification"]');
  if (await toast.isVisible()) {
    await expect(toast).toContainText('Test completed successfully');
  }
  
  console.log('E2E test completed successfully!');
});

/**
 * Test for error handling when server is not available
 * 
 * This test verifies that the application handles server errors gracefully
 * Note: This test is expected to fail if the server is running
 */
test('Handle server unavailable gracefully', async ({ page }) => {
  // Skip this test if the server is running
  // In a CI environment, you would ensure the server is not running before this test
  test.skip(process.env.RUN_ALL_TESTS !== 'true', 'Skipping server unavailable test in normal runs');
  
  // Navigate to the frontend application
  await page.goto('http://localhost:3000');
  
  // Enter a URL in the input field
  await page.locator('[data-testid="url-input"]').fill('https://www.example.com');
  
  // Click the "Test URL" button
  await page.locator('[data-testid="run-test-button"]').click();
  
  // Wait for error message
  await page.waitForSelector('[data-testid="test-results"]:has-text("Error")');
  
  // Verify error message is displayed
  await expect(page.locator('[data-testid="test-results"]')).toContainText("Error");
  
  // Take a screenshot of the error state
  await page.screenshot({ path: './e2e-tests/screenshots/error-state.png' });
});

/**
 * Test for validation of URL input
 * 
 * This test verifies that the application validates the URL input
 * and displays an appropriate error message for invalid URLs
 */
test('Validate URL input field', async ({ page }) => {
  // Navigate to the frontend application
  await page.goto('http://localhost:3000');
  
  // Try to submit with empty URL
  await page.locator('[data-testid="run-test-button"]').click();
  
  // Check for toast notification with error message
  const toast = page.locator('[data-testid="toast-notification"]');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Please enter a URL to test');
  
  // Try to submit with invalid URL
  await page.locator('[data-testid="url-input"]').fill('invalid-url');
  await page.locator('[data-testid="run-test-button"]').click();
  
  // Check for toast notification with invalid URL error
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Invalid URL format');
  
  // Take a screenshot of the validation error
  await page.screenshot({ path: './e2e-tests/screenshots/validation-error.png' });
});

/**
 * Test for creating screenshots directory if it doesn't exist
 * This is a utility function to ensure the screenshots directory exists
 */
test.beforeAll(async () => {
  const fs = require('fs');
  const path = require('path');
  const screenshotsDir = path.join('./e2e-tests/screenshots');
  
  if (!fs.existsSync(screenshotsDir)) {
    console.log('Creating screenshots directory...');
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
});
