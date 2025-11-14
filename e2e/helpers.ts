import { Page, expect } from '@playwright/test';

/**
 * Wait for the map to be fully loaded
 */
export async function waitForMapLoad(page: Page, timeout = 10000) {
  await page.waitForSelector('.mapboxgl-map', { timeout });
  // Wait a bit more for markers to render
  await page.waitForTimeout(2000);
}

/**
 * Set geolocation for the page
 */
export async function setGeolocation(
  page: Page,
  latitude: number,
  longitude: number
) {
  await page.context().grantPermissions(['geolocation']);
  await page.context().setGeolocation({ latitude, longitude });
}

/**
 * Use current location button
 */
export async function useCurrentLocation(page: Page) {
  const locationButton = page.getByRole('button', { name: /Use Current Location/i });
  await locationButton.click();
  await page.waitForTimeout(1000);
}

/**
 * Fill search input
 */
export async function fillSearch(page: Page, query: string) {
  const searchInput = page.getByPlaceholder(/Search by city, address, or PIN code/i);
  await searchInput.fill(query);
  await page.waitForTimeout(500); // Wait for filter to apply
}

/**
 * Clear search input
 */
export async function clearSearch(page: Page) {
  const clearButton = page.locator('button').filter({ hasText: '✕' }).first();
  if (await clearButton.isVisible()) {
    await clearButton.click();
  }
}

/**
 * Check a filter checkbox by label text
 */
export async function checkFilter(page: Page, labelText: string | RegExp) {
  const label = page.locator('label').filter({ hasText: labelText }).first();
  if (await label.isVisible()) {
    const checkbox = label.locator('input[type="checkbox"]');
    await checkbox.check();
    return checkbox;
  }
  return null;
}

/**
 * Navigate to login page
 */
export async function goToLogin(page: Page) {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /Sign In|Sign Up/i })).toBeVisible();
}

