import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 10000, // Set a global timeout to 10 seconds
  },
});
