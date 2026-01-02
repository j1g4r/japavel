import { TenantContext, Tenant, TenantMember } from '@japavel/contracts';
/**
 * Get current tenant context
 */
export declare const getTenantContext: () => TenantContext | undefined;
/**
 * Get current tenant context (throws if not set)
 */
export declare const requireTenantContext: () => TenantContext;
/**
 * Get current tenant ID
 */
export declare const getCurrentTenantId: () => string | undefined;
/**
 * Get current tenant ID (throws if not set)
 */
export declare const requireTenantId: () => string;
/**
 * Run a function within a tenant context
 */
export declare const runWithTenant: <T>(context: TenantContext, fn: () => T) => T;
/**
 * Run an async function within a tenant context
 */
export declare const runWithTenantAsync: <T>(context: TenantContext, fn: () => Promise<T>) => Promise<T>;
/**
 * Create tenant context from tenant and member
 */
export declare const createTenantContext: (tenant: Tenant, member?: TenantMember) => TenantContext;
/**
 * Check if current user has permission
 */
export declare const hasPermission: (permission: string) => boolean;
/**
 * Check if current user has any of the specified permissions
 */
export declare const hasAnyPermission: (permissions: string[]) => boolean;
/**
 * Check if current user has all of the specified permissions
 */
export declare const hasAllPermissions: (permissions: string[]) => boolean;
/**
 * Check if current user has specified role or higher
 */
export declare const hasRole: (requiredRole: TenantMember["role"]) => boolean;
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
/**
 * Configure tenant isolation strategy
 */
export declare const configureIsolation: (config: Partial<TenantIsolationConfig>) => void;
/**
 * Get current isolation configuration
 */
export declare const getIsolationConfig: () => TenantIsolationConfig;
/**
 * Get schema name for current tenant (schema isolation)
 */
export declare const getTenantSchema: () => string;
/**
 * Get database name for current tenant (database isolation)
 */
export declare const getTenantDatabase: () => string;
//# sourceMappingURL=context.d.ts.map