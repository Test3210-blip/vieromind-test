import { test, expect } from '@playwright/test';

// This file is for Jest tests only. Playwright tests have been moved to e2e/components.spec.ts

// Example test for a component (replace with your actual component route)
test('should render the home page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Vieromind/i);
});
