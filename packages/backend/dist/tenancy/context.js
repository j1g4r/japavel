import { TenantContextSchema } from '@japavel/contracts';
import { AsyncLocalStorage } from 'async_hooks';
/**
 * Multi-Tenancy Context System
 * Provides request-scoped tenant context using AsyncLocalStorage
 */
// Async local storage for tenant context
const tenantStorage = new AsyncLocalStorage();
/**
 * Get current tenant context
 */
export const getTenantContext = () => {
    return tenantStorage.getStore();
};
/**
 * Get current tenant context (throws if not set)
 */
export const requireTenantContext = () => {
    const ctx = getTenantContext();
    if (!ctx) {
        throw new Error('Tenant context not set. Ensure request is within tenant scope.');
    }
    return ctx;
};
/**
 * Get current tenant ID
 */
export const getCurrentTenantId = () => {
    return getTenantContext()?.tenantId;
};
/**
 * Get current tenant ID (throws if not set)
 */
export const requireTenantId = () => {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
        throw new Error('Tenant ID not set. Ensure request is within tenant scope.');
    }
    return tenantId;
};
/**
 * Run a function within a tenant context
 */
export const runWithTenant = (context, fn) => {
    return tenantStorage.run(context, fn);
};
/**
 * Run an async function within a tenant context
 */
export const runWithTenantAsync = (context, fn) => {
    return tenantStorage.run(context, fn);
};
/**
 * Create tenant context from tenant and member
 */
export const createTenantContext = (tenant, member) => {
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
export const hasPermission = (permission) => {
    const ctx = getTenantContext();
    if (!ctx)
        return false;
    // Owners and admins have all permissions
    if (ctx.role === 'owner' || ctx.role === 'admin') {
        return true;
    }
    return ctx.permissions.includes(permission);
};
/**
 * Check if current user has any of the specified permissions
 */
export const hasAnyPermission = (permissions) => {
    return permissions.some(hasPermission);
};
/**
 * Check if current user has all of the specified permissions
 */
export const hasAllPermissions = (permissions) => {
    return permissions.every(hasPermission);
};
/**
 * Check if current user has specified role or higher
 */
export const hasRole = (requiredRole) => {
    const ctx = getTenantContext();
    if (!ctx?.role)
        return false;
    const roleHierarchy = {
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
const defaultIsolationConfig = {
    strategy: 'row',
};
let isolationConfig = defaultIsolationConfig;
/**
 * Configure tenant isolation strategy
 */
export const configureIsolation = (config) => {
    isolationConfig = { ...defaultIsolationConfig, ...config };
};
/**
 * Get current isolation configuration
 */
export const getIsolationConfig = () => {
    return isolationConfig;
};
/**
 * Get schema name for current tenant (schema isolation)
 */
export const getTenantSchema = () => {
    const tenantId = requireTenantId();
    const prefix = isolationConfig.schemaPrefix || 'tenant_';
    return `${prefix}${tenantId.replace(/-/g, '_')}`;
};
/**
 * Get database name for current tenant (database isolation)
 */
export const getTenantDatabase = () => {
    const tenantId = requireTenantId();
    const prefix = isolationConfig.databasePrefix || 'tenant_';
    return `${prefix}${tenantId.replace(/-/g, '_')}`;
};
