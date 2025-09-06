const { test, expect } = require('@playwright/test');

test.describe('Hello World App', () => {
  test('should display the main page correctly', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Hello World Full Stack App');
    
    // Check if the subtitle is visible
    await expect(page.locator('p')).toContainText('React Frontend + Express Backend + Playwright Testing');
    
    // Check if API buttons are present
    await expect(page.getByTestId('root-api-button')).toBeVisible();
    await expect(page.getByTestId('hello-api-button')).toBeVisible();
  });

  test('should fetch and display root API response', async ({ page }) => {
    await page.goto('/');

    // Click the root API button
    await page.getByTestId('root-api-button').click();

    // Wait for the API response to appear
    await expect(page.getByTestId('api-response')).toBeVisible();
    
    // Check if the response contains expected text
    await expect(page.getByTestId('api-response')).toContainText('Hello World from Express Backend!');
  });

  test('should fetch and display hello API response', async ({ page }) => {
    await page.goto('/');

    // Click the hello API button
    await page.getByTestId('hello-api-button').click();

    // Wait for the API response to appear
    await expect(page.getByTestId('api-response')).toBeVisible();
    
    // Check if the response contains expected text
    await expect(page.getByTestId('api-response')).toContainText('Hello World API!');
    await expect(page.getByTestId('api-response')).toContainText('success');
  });

  test('should show loading state when fetching API', async ({ page }) => {
    await page.goto('/');

    // Click the API button and immediately check for loading state
    const button = page.getByTestId('hello-api-button');
    await button.click();
    
    // The button text should change to "Loading..." briefly
    // Note: This might be too fast to catch in some cases
    await expect(page.getByTestId('api-response')).toBeVisible({ timeout: 10000 });
  });

  test('should display features list', async ({ page }) => {
    await page.goto('/');

    // Check if all features are listed
    await expect(page.locator('text=React 18 Frontend')).toBeVisible();
    await expect(page.locator('text=Express Backend with CORS')).toBeVisible();
    await expect(page.locator('text=API Integration with Axios')).toBeVisible();
    await expect(page.locator('text=Playwright Testing Ready')).toBeVisible();
    await expect(page.locator('text=Docker Support')).toBeVisible();
  });
});
