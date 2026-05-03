import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    pool: "forks",
    server: {
      deps: {
        // Keep Node built-ins (node:sqlite, node:fs, etc.) external so Vite
        // doesn't try to bundle them.
        external: [/^node:/]
      }
    }
  }
});
