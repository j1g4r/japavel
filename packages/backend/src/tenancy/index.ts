// Context exports
export {
  getTenantContext,
  requireTenantContext,
  getCurrentTenantId,
  requireTenantId,
  runWithTenant,
  runWithTenantAsync,
  createTenantContext,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  configureIsolation,
  getIsolationConfig,
  getTenantSchema,
  getTenantDatabase,
} from './context';

export type { TenantIsolationConfig, IsolationStrategy } from './context';

// Middleware exports
export {
  resolveTenantId,
  createTenantMiddleware,
  createTRPCTenantContext,
  requireTenantMiddleware,
  requireRoleMiddleware,
  requirePermissionMiddleware,
} from './middleware';

export type { TenantResolutionStrategy, TenantMiddlewareConfig } from './middleware';
