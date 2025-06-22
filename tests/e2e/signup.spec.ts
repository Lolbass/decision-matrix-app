import { test, expect } from '@playwright/test';
import { authHelpers } from './utils/test-helpers';

// Generate a unique email for testing
const generateUniqueEmail = () => `test-user-${Date.now()}@example.com`;

test.describe('Signup Functionality', () => {
  
  test('UI elements for signup form', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Click the signup tab
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Verify signup form elements
    await expect(page.getByRole('textbox', { name: 'Enter your email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Choose a username' })).toBeVisible();
    await expect(page.getByPlaceholder('Choose a password (min 8 characters with letters and numbers)')).toBeVisible();
    await expect(page.locator('form').getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('Password validation during signup', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Click the signup tab
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Fill in email and username
    const email = generateUniqueEmail();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
    await page.getByRole('textbox', { name: 'Choose a username' }).fill('testuser');
    
    // Test too short password
    await page.getByPlaceholder('Choose a password (min 8 characters with letters and numbers)').fill('short');
    await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
    
    // Verify error message for short password
    await expect(page.getByText('Password must be at least 8 characters long')).toBeVisible();
    
    // Test password without numbers
    await page.getByPlaceholder('Choose a password (min 8 characters with letters and numbers)').fill('passwordonly');
    await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
    
    // Verify error message for password without numbers
    await expect(page.getByText('Password must contain at least one number and one letter')).toBeVisible();
    
    // Test password without letters
    await page.getByPlaceholder('Choose a password (min 8 characters with letters and numbers)').fill('12345678');
    await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
    
    // Verify error message for password without letters
    await expect(page.getByText('Password must contain at least one number and one letter')).toBeVisible();
  });

  // This test should be run only in a test environment where signup is enabled
  // and will only work if the application allows sign-ups without email verification
  test.skip('Complete signup process', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Click the signup tab
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Fill in signup form with valid data
    const email = generateUniqueEmail();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
    await page.getByRole('textbox', { name: 'Choose a username' }).fill('testuser');
    await page.getByPlaceholder('Choose a password (min 8 characters with letters and numbers)').fill('TestPass123');
    
    // Submit the form
    await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
    
    // Depending on your app's behavior, either:
    // 1. User is logged in immediately (if no email verification required)
    // In this case, verify successful login
    try {
      await authHelpers.verifySuccessfulLogin(page);
      // Logout if successfully logged in
      await authHelpers.logout(page);
    } catch {
      // 2. User sees a message asking to verify email
      await expect(page.getByText(/check your email|verify your email|confirm your account/i)).toBeVisible();
    }
  });
});