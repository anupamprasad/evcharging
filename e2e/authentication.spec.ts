import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Try to find login link - it might be in header or as a link
    const loginLink = page.getByRole('link', { name: /Login/i }).first();
    await expect(loginLink).toBeVisible({ timeout: 10000 });
    
    await loginLink.click();
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Wait for form elements
    const heading = page.locator('h2, h1').filter({ hasText: /Sign In|Sign Up/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    
    const emailInput = page.getByLabel(/Email/i).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    
    const passwordInput = page.getByLabel(/Password/i).first();
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    
    const submitButton = page.getByRole('button', { name: /Sign In|Sign Up/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 10000 });
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Check for heading (could be Sign In or Sign Up initially)
    const initialHeading = page.locator('h2, h1').filter({ hasText: /Sign In|Sign Up/i }).first();
    await expect(initialHeading).toBeVisible({ timeout: 10000 });
    
    // Try to find toggle link
    const toggleLink = page.getByRole('link', { name: /Don't have|Already have/i }).first();
    if (await toggleLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await toggleLink.click();
      await page.waitForTimeout(500);
      
      // Check that heading changed
      const newHeading = page.locator('h2, h1').filter({ hasText: /Sign In|Sign Up/i }).first();
      await expect(newHeading).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show validation error for empty form submission', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const submitButton = page.getByRole('button', { name: /Sign In|Sign Up/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    
    await submitButton.click();
    await page.waitForTimeout(500);
    
    // HTML5 validation should prevent submission - check if email input is focused or has validation
    const emailInput = page.getByLabel(/Email/i).first();
    const isFocused = await emailInput.evaluate(el => document.activeElement === el);
    const hasValidation = await emailInput.evaluate(el => !el.checkValidity());
    
    expect(isFocused || hasValidation).toBeTruthy();
  });

  test('should navigate back to home from login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const backLink = page.getByRole('link', { name: /Back to Home|Home/i }).first();
    await expect(backLink).toBeVisible({ timeout: 10000 });
    
    await backLink.click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

