import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /EV Charging Station Finder/i })).toBeVisible();
  });

  test('should display the map', async ({ page }) => {
    // Wait for map to load (Mapbox container)
    const mapContainer = page.locator('.mapboxgl-map');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

  test('should display search bar', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by city, address, or PIN code/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display filter panel', async ({ page }) => {
    await expect(page.getByText('Filters')).toBeVisible();
    await expect(page.getByText('Connector Type')).toBeVisible();
    await expect(page.getByText('Charger Type')).toBeVisible();
  });

  test('should display "Use Current Location" button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Use Current Location/i })).toBeVisible();
  });
});

