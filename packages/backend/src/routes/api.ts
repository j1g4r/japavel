import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  securityHeaders,
  corsConfig,
  authRateLimiter,
  apiRateLimiter,
  strictRateLimiter,
  logRequest,
  logResponse,
  errorHandler,
  notFoundHandler,
  healthCheck,
} from "../middleware";
import { authMiddleware } from "../security/auth";
import cors from "cors";

/**
 * API Routes Configuration
 * Secure routing with proper middleware and error handling
 */

const router = Router();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Apply security headers to all routes
router.use(securityHeaders);

// CORS configuration
router.use(cors(corsConfig));

// General rate limiting for all API routes
router.use(apiRateLimiter);

// Request/response logging
router.use(logRequest);
router.use(logResponse);

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * GET /api/health
 * Health check endpoint
 */
router.get("/health", healthCheck);

// ============================================================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================================================

/**
 * Auth routes with elevated rate limiting
 */
const authRouter = Router();

// Apply stricter rate limiting to auth endpoints
authRouter.use(authRateLimiter);

/**
 * POST /api/auth/register
 * User registration
 */
authRouter.post("/register", AuthController.register);

/**
 * POST /api/auth/login
 * User login
 */
authRouter.post("/login", AuthController.login);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
authRouter.post("/refresh", AuthController.refreshToken);

// Mount auth router
router.use("/auth", authRouter);

// ============================================================================
// PROTECTED ROUTES (Authentication Required)
// ============================================================================

const protectedRouter = Router();

// Apply authentication middleware to all protected routes
protectedRouter.use(authMiddleware());

/**
 * GET /api/me
 * Get current user information
 */
protectedRouter.get("/me", AuthController.me);

/**
 * POST /api/auth/logout
 * Logout current session
 */
protectedRouter.post("/logout", AuthController.logout);

/**
 * POST /api/auth/logout-all
 * Logout from all devices
 */
protectedRouter.post("/logout-all", AuthController.logoutAll);

// Mount protected router
router.use("", protectedRouter);

// ============================================================================
// ADMIN ROUTES (Admin Rights Required)
// ============================================================================

const adminRouter = Router();

// Apply authentication and authorization for admin routes
adminRouter.use(authMiddleware());
// TODO: Add admin authorization middleware here
// adminRouter.use(requireAdmin());

/**
 * Admin-specific endpoints would go here
 * e.g., user management, system settings, etc.
 */

// Mount admin router
router.use("/admin", adminRouter);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler - must be last
router.use(notFoundHandler);

// Global error handler - must be last
router.use(errorHandler);

// ============================================================================
// EXPORT
// ============================================================================

export default router;
export const apiRouter = router;

/**
 * Route groups for organization
 */
export const Route = {
  /**
   * Create a route group with a prefix
   */
  group: (prefix: string, callback: () => void): void => {
    callback();
  },
};

/**
 * HTTP method helpers
 */
export const httpMethods = {
  get: (path: string, handler: (...args: any[]) => any) =>
    router.get(path, handler as any),
  post: (path: string, handler: (...args: any[]) => any) =>
    router.post(path, handler as any),
  put: (path: string, handler: (...args: any[]) => any) =>
    router.put(path, handler as any),
  patch: (path: string, handler: (...args: any[]) => any) =>
    router.patch(path, handler as any),
  delete: (path: string, handler: (...args: any[]) => any) =>
    router.delete(path, handler as any),
};
