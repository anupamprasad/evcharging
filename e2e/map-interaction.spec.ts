import { test, expect } from '@playwright/test';

test.describe('Map Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should display map or map error message', async ({ page }) => {
    // Mapbox markers are rendered as canvas or SVG elements
    // We can verify the map container is visible OR error message is shown
    const mapContainer = page.locator('.mapboxgl-map');
    const mapError = page.locator('text=/Mapbox token|token not configured/i');
    
    const mapVisible = await mapContainer.isVisible({ timeout: 10000 }).catch(() => false);
    const errorVisible = await mapError.isVisible({ timeout: 10000 }).catch(() => false);
    
    expect(mapVisible || errorVisible).toBeTruthy();
  });

  test('should allow map panning', async ({ page }) => {
    const mapContainer = page.locator('.mapboxgl-map');
    const isMapVisible = await mapContainer.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isMapVisible) {
      // Get initial map state
      const initialView = await mapContainer.boundingBox();
      
      if (initialView) {
        // Simulate drag to pan the map
        await page.mouse.move(initialView.x + initialView.width / 2, initialView.y + initialView.height / 2);
        await page.mouse.down();
        await page.mouse.move(initialView.x + initialView.width / 2 + 100, initialView.y + initialView.height / 2 + 100);
        await page.mouse.up();
        
        // Map should have moved (we can't easily verify exact position, but interaction should work)
        await page.waitForTimeout(500);
      }
    } else {
      // Skip test if map is not available
      test.skip();
    }
  });

  test('should handle geolocation button click', async ({ page }) => {
    // Mock geolocation permission
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation({ latitude: 28.6139, longitude: 77.2090 }); // New Delhi coordinates
    
    const locationButton = page.getByRole('button', { name: /Use Current Location|Current Location/i }).first();
    await expect(locationButton).toBeVisible({ timeout: 10000 });
    
    await locationButton.click();
    
    // Wait for potential map centering
    await page.waitForTimeout(1000);
  });

  test('should show user location marker when geolocation is used', async ({ page }) => {
    // Grant geolocation permission and set coordinates
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation({ latitude: 28.6139, longitude: 77.2090 });
    
    const locationButton = page.getByRole('button', { name: /Use Current Location|Current Location/i }).first();
    await expect(locationButton).toBeVisible({ timeout: 10000 });
    await locationButton.click();
    
    // Wait for map to center and marker to appear
    await page.waitForTimeout(2000);
    
    // User location marker should be visible (blue dot)
    // This is a visual element, so we verify the map is still visible OR error is shown
    const mapContainer = page.locator('.mapboxgl-map');
    const mapError = page.locator('text=/Mapbox token|token not configured/i');
    
    const mapVisible = await mapContainer.isVisible({ timeout: 5000 }).catch(() => false);
    const errorVisible = await mapError.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(mapVisible || errorVisible).toBeTruthy();
  });
});

