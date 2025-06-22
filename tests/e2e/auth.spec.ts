import { test, expect } from '@playwright/test';

// Test data
const VALID_EMAIL = 'lolbass@gmail.com';
const VALID_PASSWORD = 'tototo92';
const INVALID_EMAIL = 'invalid@email.com';
const INVALID_PASSWORD = 'wrongpassword';

test.describe('Authentication Scenarios', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app root before each test
    await page.goto('/');
    
    // Ensure we're on the login page
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('Positive login scenario with valid credentials', async ({ page }) => {
    // Fill in the login form
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(VALID_EMAIL);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(VALID_PASSWORD);
    
    // Click sign in button
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    
    // Verify successful login
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    
    // Verify navigation to dashboard
    await expect(page.getByRole('heading', { name: 'Welcome to Decision Matrix' })).toBeVisible();
    
    // Verify page title
    expect(await page.title()).toBe('My Decision Matrix');
    
    // Verify presence of user menu options
    await expect(page.getByRole('button', { name: 'New Matrix' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'My Matrices' })).toBeVisible();
    
    // Verify elements on dashboard
    await expect(page.getByText('Make better decisions by evaluating multiple options')).toBeVisible();
    await expect(page.getByRole('heading', { name: '⚖️ Define Criteria' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '📝 Add Options' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '📈 Get Results' })).toBeVisible();
    
    // Sign out to cleanup
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('Negative login scenario with invalid email', async ({ page }) => {
    // Fill login form with invalid email
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(INVALID_EMAIL);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(VALID_PASSWORD);
    
    // Click sign in button
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Invalid login credentials')).toBeVisible();
    
    // Make sure we're still on the login page
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('Negative login scenario with invalid password', async ({ page }) => {
    // Fill login form with valid email but invalid password
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(VALID_EMAIL);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(INVALID_PASSWORD);
    
    // Click sign in button
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Invalid login credentials')).toBeVisible();
    
    // Make sure we're still on the login page
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});