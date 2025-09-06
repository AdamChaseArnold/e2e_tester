const { test, expect } = require('@playwright/test');

test.describe('URL Accessibility Tests', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should verify google.com is accessible', async ({ page }) => {
    const urlInput = page.getByTestId('form-input');
    const submitButton = page.getByTestId('form-submit');

    await urlInput.fill('https://www.google.com');
    await submitButton.click();

    const statusMessage = page.getByTestId('url-status');
    await expect(statusMessage).toBeVisible({ timeout: 10000 });
    await expect(statusMessage).toHaveText('URL is accessible', { timeout: 10000 });
    await expect(statusMessage).toHaveClass(/success/);
  });
});
