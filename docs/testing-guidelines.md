# Testing Guidelines

## Overview

All new features must include appropriate tests. Tests should be meaningful, maintainable, and follow the practices outlined below.

## Unit Tests

- **Framework**: Jest
- **Purpose**: Test individual functions and React components in isolation.
- **File naming**: `*.test.js` or `*.test.ts`
- **Backend location**: `packages/backend/__tests__/`
- **Frontend location**: `packages/frontend/src/__tests__/`
- Name test files to match what they test (e.g., `app.test.js` for `app.js`).

## Integration Tests

- **Framework**: Jest + Supertest
- **Purpose**: Test backend API endpoints with real HTTP requests.
- **File naming**: `*.test.js` or `*.test.ts`
- **Location**: `packages/backend/__tests__/integration/`
- Name integration test files based on what they test (e.g., `todos-api.test.js` for TODO API endpoints).

## End-to-End (E2E) Tests

- **Framework**: Playwright (required)
- **Purpose**: Test complete UI workflows through browser automation.
- **File naming**: `*.spec.js` or `*.spec.ts`
- **Location**: `tests/e2e/`
- **Browser**: Test with one browser only (Chromium).
- **Pattern**: Tests must use the Page Object Model (POM) pattern.
- **Scope**: Limit to 5-8 E2E tests covering critical user journeys. Focus on quality over quantity.
- Name E2E test files based on the user journey they test (e.g., `todo-workflow.spec.js`).

## Port Configuration

Always use environment variables with sensible defaults for port configuration:

- **Backend**: `const PORT = process.env.PORT || 3030;`
- **Frontend**: React's default port is 3000, overridable with the `PORT` environment variable.

This allows CI/CD workflows to dynamically detect ports.

## General Principles

- **All tests must be isolated and independent** - each test sets up its own data and does not rely on other tests.
- **Setup and teardown hooks are required** - tests must succeed on multiple consecutive runs.
- **No over-mocking** - integration tests should use real wiring; only mock external services or network boundaries.
- **Assertions must be meaningful** - avoid phantom assertions that pass regardless of correctness.
- **Test both happy paths and key edge cases** - cover error states, empty states, and boundary conditions.
