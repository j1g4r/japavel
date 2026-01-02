import { Request, Response, NextFunction } from 'express';
import { TenantContext, Tenant, TenantMember, TenantStatus } from '@japavel/contracts';
/**
 * Tenant Resolution Strategies
 */
export type TenantResolutionStrategy = 'subdomain' | 'path' | 'header' | 'query' | 'jwt' | 'custom';
export interface TenantMiddlewareConfig {
    strategy: TenantResolutionStrategy;
    headerName?: string;
    queryParam?: string;
    pathPrefix?: string;
    jwtClaim?: string;
    customResolver?: (req: Request) => Promise<string | null>;
    onTenantResolved?: (tenant: Tenant, req: Request) => Promise<void>;
    allowedStatuses?: TenantStatus[];
}
/**
 * Resolve tenant ID from request based on strategy
 */
export declare const resolveTenantId: (req: Request, config: TenantMiddlewareConfig) => Promise<string | null>;
/**
 * Express middleware factory for tenant resolution
 */
export declare const createTenantMiddleware: (getTenant: (idOrSlug: string) => Promise<Tenant | null>, getMember: (tenantId: string, userId: string) => Promise<TenantMember | null>, config?: Partial<TenantMiddlewareConfig>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * tRPC context creator with tenant support
 */
export declare const createTRPCTenantContext: (opts: {
    req: Request;
    getTenant: (idOrSlug: string) => Promise<Tenant | null>;
    getMember: (tenantId: string, userId: string) => Promise<TenantMember | null>;
    config?: Partial<TenantMiddlewareConfig>;
}) => Promise<TenantContext | null>;
/**
 * tRPC middleware for requiring tenant context
 */
export declare const requireTenantMiddleware: () => (opts: {
    ctx: {
        tenantContext?: TenantContext;
    };
    next: () => Promise<unknown>;
}) => Promise<unknown>;
/**
 * tRPC middleware for requiring specific role
 */
export declare const requireRoleMiddleware: (role: TenantMember["role"]) => (opts: {
    ctx: {
        tenantContext?: TenantContext;
    };
    next: () => Promise<unknown>;
}) => Promise<unknown>;
/**
 * tRPC middleware for requiring specific permission
 */
export declare const requirePermissionMiddleware: (permission: string) => (opts: {
    ctx: {
        tenantContext?: TenantContext;
    };
    next: () => Promise<unknown>;
}) => Promise<unknown>;
//# sourceMappingURL=middleware.d.ts.map