import {defineConfig} from 'vitest/config';

// Run regression tests, not archived audit generators or local .tools probes.
export default defineConfig({test:{include:['src/**/*.test.{ts,tsx}','build/**/*.test.mjs'],maxWorkers:2}});
