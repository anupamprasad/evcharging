import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    const loginLink = page.getByRole('link', { name: /Login/i });
    await expect(loginLink).toBeVisible();
    
    await loginLink.click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/login');
    
    // Initially should show Sign In
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();
    
    // Click to toggle to Sign Up
    const toggleLink = page.getByRole('link', { name: /Don't have an account/i });
    await toggleLink.click();
    
    await expect(page.getByRole('heading', { name: /Sign Up/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign Up/i })).toBeVisible();
  });

  test('should show validation error for empty form submission', async ({ page }) => {
    await page.goto('/login');
    
    const submitButton = page.getByRole('button', { name: /Sign In/i });
    await submitButton.click();
    
    // HTML5 validation should prevent submission
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toBeFocused();
  });

  test('should navigate back to home from login page', async ({ page }) => {
    await page.goto('/login');
    
    const backLink = page.getByRole('link', { name: /Back to Home/i });
    await backLink.click();
    
    await expect(page).toHaveURL('/');
  });
});

