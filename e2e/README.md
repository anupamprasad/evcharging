# End-to-End Tests with Playwright

This directory contains end-to-end tests for the EV Charging Station Finder application.

## Test Structure

- `homepage.spec.ts` - Tests for the main homepage and basic UI elements
- `search.spec.ts` - Tests for search functionality
- `filters.spec.ts` - Tests for filter functionality
- `authentication.spec.ts` - Tests for user authentication
- `map-interaction.spec.ts` - Tests for map interactions and geolocation
- `station-details.spec.ts` - Tests for station details panel
- `favorites.spec.ts` - Tests for favorites functionality

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run a specific test file
```bash
npx playwright test e2e/homepage.spec.ts
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
```

## Test Configuration

The Playwright configuration is in `playwright.config.ts`. It includes:
- Automatic dev server startup before tests
- Screenshot capture on failure
- Trace collection on retry
- HTML reporter for test results

## Environment Setup

Make sure you have:
1. Environment variables configured (`.env` file)
2. Supabase project set up with test data
3. Mapbox token configured

## Writing New Tests

When writing new tests:
1. Use descriptive test names
2. Wait for elements to be visible before interacting
3. Use `page.waitForTimeout()` sparingly - prefer waiting for specific elements
4. Mock external services when possible
5. Clean up test data after tests

## CI/CD Integration

For CI/CD pipelines:
- Tests run automatically with `npm run test:e2e`
- Screenshots and traces are saved on failure
- HTML reports are generated in `playwright-report/`

