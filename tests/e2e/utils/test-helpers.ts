import { Page, expect } from '@playwright/test';

/**
 * Helper functions for authentication testing
 */
export const authHelpers = {
  /**
   * Logs in with the provided credentials
   */
  async login(page: Page, email: string, password: string): Promise<void> {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  },

  /**
   * Verifies successful login and dashboard elements
   */
  async verifySuccessfulLogin(page: Page): Promise<void> {
    // Wait for navigation to complete
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    
    // Verify dashboard content
    await expect(page.getByRole('heading', { name: 'Welcome to Decision Matrix' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Matrix' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'My Matrices' })).toBeVisible();
  },

  /**
   * Logs out the current user
   */
  async logout(page: Page): Promise<void> {
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  },

  /**
   * Verifies failed login and error message
   */
  async verifyFailedLogin(page: Page, expectedErrorMessage = 'Invalid login credentials'): Promise<void> {
    await expect(page.getByText(expectedErrorMessage)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  }
};