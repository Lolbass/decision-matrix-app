# My Decision Matrix - Testing

This folder contains end-to-end tests for the My Decision Matrix application using Playwright.

## Setup

To run the tests, you need to:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with UI mode:
```bash
npm run test:ui
```

Run tests in debug mode:
```bash
npm run test:debug
```

## Test Structure

- `e2e/auth.spec.ts` - Tests for authentication functionality (login with valid/invalid credentials)
- `e2e/auth-flow.spec.ts` - Tests for the complete authentication flow (login, navigation, logout)
- `e2e/signup.spec.ts` - Tests for the signup functionality
- `e2e/utils/test-helpers.ts` - Helper functions for common test operations

## Test Data

The tests use the following credentials:
- Valid user: `lolbass@gmail.com` / `tototo92`
- Invalid credentials for negative testing

## Notes

- The test for the complete signup process is skipped by default as it may create real accounts in your database. Enable it only in test environments.
- Before running tests, make sure your development server is accessible at `http://localhost:5173` (or update the baseURL in `playwright.config.ts`).
- Tests are configured to automatically start and stop the development server.