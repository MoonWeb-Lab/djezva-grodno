import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 8000,
  },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173/djezva-grodno/',
    trace: 'on-first-retry',
    channel: 'msedge',
    viewport: { width: 390, height: 844 },
    isMobile: true,
  },
});
