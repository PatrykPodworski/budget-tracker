import { test, expect } from '@playwright/test';

test.describe('Calendar Component', () => {
  test('should display calendar with proper layout on receipt page', async ({ page }) => {
    // Go to a receipt that exists (based on the screenshot showing receipt ID)
    // Using the ID from the screenshot: 6279c952-b874-4f9c-a041-3c5057565e82
    await page.goto('http://localhost:3001/receipts/6279c952-b874-4f9c-a041-3c5057565e82', {
      waitUntil: 'networkidle',
    });

    // Wait for the date button to appear and click it
    const dateButton = page.locator('button:has-text("25.10.2025")').or(page.locator('button').filter({ hasText: /\d{2}\.\d{2}\.\d{4}/ }));
    await dateButton.first().click({ timeout: 10000 });

    // Wait for calendar to appear
    await page.waitForSelector('[role="grid"]', { timeout: 5000 });

    // Verify the calendar is visible and has proper structure
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();

    // Check that calendar month header is present
    const monthCaption = page.locator('text=/październik|pazdziernik|october/i');
    await expect(monthCaption).toBeVisible();

    // Check navigation buttons are visible (specific to calendar)
    const prevButton = page.locator('button[aria-label="Go to the Previous Month"]');
    const nextButton = page.locator('button[aria-label="Go to the Next Month"]');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Check that days are clickable
    const dayButton = page.locator('button:has-text("25")').first();
    await expect(dayButton).toBeVisible();

    // Verify weekday abbreviations are visible in some form
    const weekdayText = page.locator('text=/pon|wto|śro|czw|pią|sob|nie/i');
    const weekdayCount = await weekdayText.count();
    expect(weekdayCount).toBeGreaterThan(0);

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'tests/screenshots/calendar-fixed.png',
      fullPage: false
    });

    console.log('✓ Calendar layout verified successfully');
  });
});
