import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load - check for either the header or loading state
    await page.waitForLoadState('networkidle');
    // Wait a bit more for React to render
    await page.waitForTimeout(1000);
  });

  test('should display the main header', async ({ page }) => {
    // Try multiple ways to find the header
    const header = page.locator('h1, header').filter({ hasText: /EV Charging|Charging Station/i }).first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('should display the map or map error message', async ({ page }) => {
    // Wait for either the map to load OR the error message
    const mapContainer = page.locator('.mapboxgl-map');
    const mapError = page.locator('text=/Mapbox token|token not configured/i');
    
    // One of them should be visible
    await Promise.race([
      expect(mapContainer).toBeVisible({ timeout: 15000 }).catch(() => {}),
      expect(mapError).toBeVisible({ timeout: 15000 }).catch(() => {})
    ]);
    
    // At least one should be visible
    const mapVisible = await mapContainer.isVisible().catch(() => false);
    const errorVisible = await mapError.isVisible().catch(() => false);
    expect(mapVisible || errorVisible).toBeTruthy();
  });

  test('should display search bar', async ({ page }) => {
    // Wait for search input with multiple selectors
    const searchInput = page.getByPlaceholder(/Search by city|Search/i).first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('should display filter panel', async ({ page }) => {
    // Wait for filter panel to load
    await page.waitForTimeout(1000);
    const filtersText = page.locator('text=/Filter/i').first();
    await expect(filtersText).toBeVisible({ timeout: 10000 });
  });

  test('should display "Use Current Location" button', async ({ page }) => {
    // Wait for button to appear
    await page.waitForTimeout(1000);
    const locationButton = page.getByRole('button', { name: /Use Current Location|Current Location/i }).first();
    await expect(locationButton).toBeVisible({ timeout: 10000 });
  });
});

