const { test, expect } = require('@playwright/test');

test.describe('URL Accessibility Tests', () => {
  // Increase overall test timeout
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  // Mock the API response to ensure consistent test results
  test('should verify URL accessibility check works', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/check-url', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'URL is accessible' })
      });
    });

    // Fill the form
    const urlInput = page.getByTestId('form-input');
    const submitButton = page.getByTestId('form-submit');

    await urlInput.fill('https://example.com');
    await submitButton.click();

    // Check the result
    const statusMessage = page.getByTestId('url-status');
    await expect(statusMessage).toBeVisible({ timeout: 15000 });
    await expect(statusMessage).toHaveText('URL is accessible', { timeout: 15000 });
    await expect(statusMessage).toHaveClass(/success/);
  });
});
