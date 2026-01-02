import { Application } from "./Application";

/**
 * Application Entry Point
 * Production-ready server initialization with error handling
 */

/**
 * Initialize and start the application
 */
async function main() {
  try {
    // Create application instance
    const app = new Application();

    // Boot the application (connect to databases, init services, etc.)
    await app.boot();

    // Start the server
    app.start();
  } catch (error) {
    console.error("Fatal error during application startup:", error);
    process.exit(1);
  }
}

// Handle uncaught errors before main() runs
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

// Start the application
main();

/**
 * Export AppRouter type for tRPC (if used)
 * This is a placeholder type that should be updated when implementing tRPC routers
 */
export type AppRouter = any;

/**
 * Export app instance for testing purposes
 * This is primarily used in Jest/Vitest test files
 */
// Export Application at top level for testing
export { Application };
