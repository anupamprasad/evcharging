import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load - check for either the header or loading state
    await page.waitForLoadState('networkidle');
    // Wait for React to render and Supabase to load
    await page.waitForTimeout(2000);
    // Wait for header to be visible as a sign that page loaded
    await page.waitForSelector('h1:has-text("EV Charging Station Finder")', { timeout: 10000 }).catch(() => {});
  });

  test('should display the main header', async ({ page }) => {
    // The header contains "EV Charging Station Finder" in an h1
    const header = page.locator('h1:has-text("EV Charging Station Finder")');
    await expect(header).toBeVisible({ timeout: 15000 });
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
    // Search input has placeholder "Search by city, address, or PIN code..."
    const searchInput = page.getByPlaceholder('Search by city, address, or PIN code...');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
  });

  test('should display filter panel', async ({ page }) => {
    // Filter panel has heading "Filters"
    const filtersHeading = page.locator('h3:has-text("Filters")');
    await expect(filtersHeading).toBeVisible({ timeout: 15000 });
  });

  test('should display "Use Current Location" button', async ({ page }) => {
    // Button text is "📍 Use Current Location"
    const locationButton = page.getByRole('button', { name: /Use Current Location/i });
    await expect(locationButton).toBeVisible({ timeout: 15000 });
  });
});

