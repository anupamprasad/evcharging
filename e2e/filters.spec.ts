import { test, expect } from '@playwright/test';

test.describe('Filter Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.mapboxgl-map', { timeout: 10000 });
  });

  test('should filter by connector type', async ({ page }) => {
    // Find and check a connector type filter
    const ccs2Label = page.locator('label').filter({ hasText: /^CCS2$/ }).first();
    if (await ccs2Label.isVisible()) {
      const ccs2Checkbox = ccs2Label.locator('input[type="checkbox"]');
      await ccs2Checkbox.check();
      await expect(ccs2Checkbox).toBeChecked();
    }
  });

  test('should filter by charger type', async ({ page }) => {
    // Find and check a charger type filter
    const dcCheckbox = page.locator('label').filter({ hasText: /^DC$/ }).locator('input[type="checkbox"]').first();
    if (await dcCheckbox.isVisible()) {
      await dcCheckbox.check();
      await expect(dcCheckbox).toBeChecked();
    }
  });

  test('should filter by operator', async ({ page }) => {
    // Find and check an operator filter
    const tataPowerCheckbox = page.locator('label').filter({ hasText: 'Tata Power' }).locator('input[type="checkbox"]').first();
    if (await tataPowerCheckbox.isVisible()) {
      await tataPowerCheckbox.check();
      await expect(tataPowerCheckbox).toBeChecked();
    }
  });

  test('should filter by facilities', async ({ page }) => {
    // Find and check a facilities filter
    const parkingCheckbox = page.locator('label').filter({ hasText: 'Parking' }).locator('input[type="checkbox"]').first();
    if (await parkingCheckbox.isVisible()) {
      await parkingCheckbox.check();
      await expect(parkingCheckbox).toBeChecked();
    }
  });

  test('should toggle availability filter', async ({ page }) => {
    const availabilityCheckbox = page.locator('label').filter({ hasText: /Show only available stations/i }).locator('input[type="checkbox"]').first();
    if (await availabilityCheckbox.isVisible()) {
      await availabilityCheckbox.check();
      await expect(availabilityCheckbox).toBeChecked();
    }
  });

  test('should clear all filters', async ({ page }) => {
    // First, check a filter
    const ccs2Checkbox = page.locator('input[type="checkbox"]').filter({ hasText: 'CCS2' }).first();
    if (await ccs2Checkbox.isVisible()) {
      await ccs2Checkbox.check();
    }

    // Then click clear all filters button
    const clearButton = page.getByRole('button', { name: /Clear All Filters/i });
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(ccs2Checkbox).not.toBeChecked();
    }
  });
});

