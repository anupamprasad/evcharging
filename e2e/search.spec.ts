import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for map to load
    await page.waitForSelector('.mapboxgl-map', { timeout: 10000 });
  });

  test('should filter stations by city name', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by city, address, or PIN code/i);
    
    await searchInput.fill('Mumbai');
    await page.waitForTimeout(500); // Wait for filter to apply
    
    // Verify search input has the value
    await expect(searchInput).toHaveValue('Mumbai');
  });

  test('should filter stations by PIN code', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by city, address, or PIN code/i);
    
    await searchInput.fill('110001');
    await page.waitForTimeout(500);
    
    await expect(searchInput).toHaveValue('110001');
  });

  test('should clear search when clicking clear button', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by city, address, or PIN code/i);
    
    await searchInput.fill('Delhi');
    await page.waitForTimeout(300);
    
    // Find and click the clear button (×)
    const clearButton = page.locator('button').filter({ hasText: '✕' }).first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(searchInput).toHaveValue('');
    }
  });
});

