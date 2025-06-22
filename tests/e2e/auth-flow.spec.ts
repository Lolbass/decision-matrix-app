import { test, expect } from '@playwright/test';
import { authHelpers } from './utils/test-helpers';

// Test data
const VALID_EMAIL = 'lolbass@gmail.com';
const VALID_PASSWORD = 'tototo92';
const INVALID_EMAIL = 'invalid@email.com';
const INVALID_PASSWORD = 'wrongpassword';

test.describe('Authentication Flow', () => {
  
  test('Complete authentication flow: login, navigate, and logout', async ({ page }) => {
    // Start at the home page
    await page.goto('/');
    
    // Login with valid credentials
    await authHelpers.login(page, VALID_EMAIL, VALID_PASSWORD);
    
    // Verify successful login
    await authHelpers.verifySuccessfulLogin(page);
    
    // Test navigation to matrix page
    await page.getByRole('button', { name: 'New Matrix' }).click();
    
    // Check if we're on the matrix page (this would need to be updated based on your app's UI)
    // For example, verify a matrix-related element is visible
    
    // Return to home
    await page.getByText('Decision Matrix').click();
    
    // Verify we're back on home page
    await expect(page.getByRole('heading', { name: 'Welcome to Decision Matrix' })).toBeVisible();
    
    // Logout
    await authHelpers.logout(page);
    
    // Verify we're logged out
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });
  
  test('Authentication persistence after page refresh', async ({ page }) => {
    // Login with valid credentials
    await authHelpers.login(page, VALID_EMAIL, VALID_PASSWORD);
    
    // Verify successful login
    await authHelpers.verifySuccessfulLogin(page);
    
    // Reload the page
    await page.reload();
    
    // Verify we're still logged in after page refresh
    await authHelpers.verifySuccessfulLogin(page);
    
    // Logout to clean up
    await authHelpers.logout(page);
  });

  test('Attempt to access protected page when not logged in', async ({ page }) => {
    // Try to navigate directly to a protected route (Update this based on your app's routes)
    await page.goto('/matrices');
    
    // Should redirect to login page
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
  
  test('Error message disappears when clicking close button', async ({ page }) => {
    // Attempt login with wrong credentials to trigger error
    await authHelpers.login(page, VALID_EMAIL, INVALID_PASSWORD);
    
    // Verify error appears
    await expect(page.getByText('Invalid login credentials')).toBeVisible();
    
    // Click the close button on the error message
    await page.getByRole('button', { name: 'Close alert' }).click();
    
    // Verify error message is no longer visible
    await expect(page.getByText('Invalid login credentials')).not.toBeVisible();
  });
});