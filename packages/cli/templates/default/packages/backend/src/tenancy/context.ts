import { z } from 'zod';
import { TenantContext, TenantContextSchema, Tenant, TenantMember } from '@japavel/contracts';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Multi-Tenancy Context System
 * Provides request-scoped tenant context using AsyncLocalStorage
 */

// Async local storage for tenant context
const tenantStorage = new AsyncLocalStorage<TenantContext>();

/**
 * Get current tenant context
 */
export const getTenantContext = (): TenantContext | undefined => {
  return tenantStorage.getStore();
};

/**
 * Get current tenant context (throws if not set)
 */
export const requireTenantContext = (): TenantContext => {
  const ctx = getTenantContext();
  if (!ctx) {
    throw new Error('Tenant context not set. Ensure request is within tenant scope.');
  }
  return ctx;
};

/**
 * Get current tenant ID
 */
export const getCurrentTenantId = (): string | undefined => {
  return getTenantContext()?.tenantId;
};

/**
 * Get current tenant ID (throws if not set)
 */
export const requireTenantId = (): string => {
  const tenantId = getCurrentTenantId();
  if (!tenantId) {
    throw new Error('Tenant ID not set. Ensure request is within tenant scope.');
  }
  return tenantId;
};

/**
 * Run a function within a tenant context
 */
export const runWithTenant = <T>(
  context: TenantContext,
  fn: () => T
): T => {
  return tenantStorage.run(context, fn);
};

/**
 * Run an async function within a tenant context
 */
export const runWithTenantAsync = <T>(
  context: TenantContext,
  fn: () => Promise<T>
): Promise<T> => {
  return tenantStorage.run(context, fn);
};

/**
 * Create tenant context from tenant and member
 */
export const createTenantContext = (
  tenant: Tenant,
  member?: TenantMember
): TenantContext => {
  return TenantContextSchema.parse({
    tenantId: tenant.id,
    tenant,
    userId: member?.userId,
    role: member?.role,
    permissions: member?.permissions || [],
  });
};

/**
 * Check if current user has permission
 */
export const hasPermission = (permission: string): boolean => {
  const ctx = getTenantContext();
  if (!ctx) return false;

  // Owners and admins have all permissions
  if (ctx.role === 'owner' || ctx.role === 'admin') {
    return true;
  }

  return ctx.permissions.includes(permission);
};

/**
 * Check if current user has any of the specified permissions
 */
export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some(hasPermission);
};

/**
 * Check if current user has all of the specified permissions
 */
export const hasAllPermissions = (permissions: string[]): boolean => {
  return permissions.every(hasPermission);
};

/**
 * Check if current user has specified role or higher
 */
export const hasRole = (requiredRole: TenantMember['role']): boolean => {
  const ctx = getTenantContext();
  if (!ctx?.role) return false;

  const roleHierarchy: Record<string, number> = {
    owner: 100,
    admin: 80,
    billing: 60,
    member: 40,
    viewer: 20,
  };

  const currentLevel = roleHierarchy[ctx.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return currentLevel >= requiredLevel;
};

/**
 * Tenant isolation strategies
 */
export type IsolationStrategy = 'row' | 'schema' | 'database';

/**
 * Tenant isolation configuration
 */
export interface TenantIsolationConfig {
  strategy: IsolationStrategy;
  schemaPrefix?: string;
  databasePrefix?: string;
}

const defaultIsolationConfig: TenantIsolationConfig = {
  strategy: 'row',
};

let isolationConfig = defaultIsolationConfig;

/**
 * Configure tenant isolation strategy
 */
export const configureIsolation = (config: Partial<TenantIsolationConfig>): void => {
  isolationConfig = { ...defaultIsolationConfig, ...config };
};

/**
 * Get current isolation configuration
 */
export const getIsolationConfig = (): TenantIsolationConfig => {
  return isolationConfig;
};

/**
 * Get schema name for current tenant (schema isolation)
 */
export const getTenantSchema = (): string => {
  const tenantId = requireTenantId();
  const prefix = isolationConfig.schemaPrefix || 'tenant_';
  return `${prefix}${tenantId.replace(/-/g, '_')}`;
};

/**
 * Get database name for current tenant (database isolation)
 */
export const getTenantDatabase = (): string => {
  const tenantId = requireTenantId();
  const prefix = isolationConfig.databasePrefix || 'tenant_';
  return `${prefix}${tenantId.replace(/-/g, '_')}`;
};
