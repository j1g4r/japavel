import { Request, Response, NextFunction } from 'express';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  TenantContext,
  TenantContextSchema,
  Tenant,
  TenantMember,
  TenantStatus,
} from '@japavel/contracts';
import {
  runWithTenantAsync,
  createTenantContext,
  hasRole,
  hasPermission,
} from './context';

/**
 * Tenant Resolution Strategies
 */
export type TenantResolutionStrategy =
  | 'subdomain'    // tenant.example.com
  | 'path'         // example.com/tenant
  | 'header'       // X-Tenant-ID header
  | 'query'        // ?tenant=xxx
  | 'jwt'          // Extract from JWT token
  | 'custom';

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

const defaultConfig: TenantMiddlewareConfig = {
  strategy: 'header',
  headerName: 'x-tenant-id',
  queryParam: 'tenant',
  pathPrefix: '/t/',
  jwtClaim: 'tenant_id',
  allowedStatuses: ['active', 'trial'],
};

/**
 * Resolve tenant ID from request based on strategy
 */
export const resolveTenantId = async (
  req: Request,
  config: TenantMiddlewareConfig
): Promise<string | null> => {
  switch (config.strategy) {
    case 'subdomain': {
      const host = req.hostname || req.headers.host || '';
      const parts = host.split('.');
      if (parts.length >= 3) {
        return parts[0];
      }
      return null;
    }

    case 'path': {
      const prefix = config.pathPrefix || '/t/';
      if (req.path.startsWith(prefix)) {
        const remaining = req.path.slice(prefix.length);
        const tenantSlug = remaining.split('/')[0];
        return tenantSlug || null;
      }
      return null;
    }

    case 'header': {
      const headerName = config.headerName || 'x-tenant-id';
      const value = req.headers[headerName.toLowerCase()];
      return typeof value === 'string' ? value : null;
    }

    case 'query': {
      const paramName = config.queryParam || 'tenant';
      const value = req.query[paramName];
      return typeof value === 'string' ? value : null;
    }

    case 'jwt': {
      // JWT should be parsed by auth middleware first
      const user = (req as Request & { user?: Record<string, unknown> }).user;
      const claim = config.jwtClaim || 'tenant_id';
      return user?.[claim] as string || null;
    }

    case 'custom': {
      if (config.customResolver) {
        return config.customResolver(req);
      }
      return null;
    }

    default:
      return null;
  }
};

/**
 * Express middleware factory for tenant resolution
 */
export const createTenantMiddleware = (
  getTenant: (idOrSlug: string) => Promise<Tenant | null>,
  getMember: (tenantId: string, userId: string) => Promise<TenantMember | null>,
  config: Partial<TenantMiddlewareConfig> = {}
) => {
  const fullConfig = { ...defaultConfig, ...config };

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Resolve tenant ID/slug
      const tenantIdOrSlug = await resolveTenantId(req, fullConfig);

      if (!tenantIdOrSlug) {
        res.status(400).json({ error: 'Tenant not specified' });
        return;
      }

      // Fetch tenant
      const tenant = await getTenant(tenantIdOrSlug);

      if (!tenant) {
        res.status(404).json({ error: 'Tenant not found' });
        return;
      }

      // Check tenant status
      const allowedStatuses = fullConfig.allowedStatuses || ['active', 'trial'];
      if (!allowedStatuses.includes(tenant.status)) {
        res.status(403).json({
          error: 'Tenant access denied',
          reason: `Tenant status: ${tenant.status}`,
        });
        return;
      }

      // Get user ID from auth (if available)
      const userId = (req as Request & { user?: { id?: string } }).user?.id;

      // Fetch membership if user is authenticated
      let member: TenantMember | null = null;
      if (userId) {
        member = await getMember(tenant.id, userId);
      }

      // Create tenant context
      const context = createTenantContext(tenant, member || undefined);

      // Call optional hook
      if (fullConfig.onTenantResolved) {
        await fullConfig.onTenantResolved(tenant, req);
      }

      // Run next middleware within tenant context
      await runWithTenantAsync(context, async () => {
        // Attach context to request for convenience
        (req as Request & { tenantContext?: TenantContext }).tenantContext = context;
        next();
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * tRPC context creator with tenant support
 */
export const createTRPCTenantContext = async (opts: {
  req: Request;
  getTenant: (idOrSlug: string) => Promise<Tenant | null>;
  getMember: (tenantId: string, userId: string) => Promise<TenantMember | null>;
  config?: Partial<TenantMiddlewareConfig>;
}): Promise<TenantContext | null> => {
  const { req, getTenant, getMember, config = {} } = opts;
  const fullConfig = { ...defaultConfig, ...config };

  const tenantIdOrSlug = await resolveTenantId(req, fullConfig);
  if (!tenantIdOrSlug) return null;

  const tenant = await getTenant(tenantIdOrSlug);
  if (!tenant) return null;

  const allowedStatuses = fullConfig.allowedStatuses || ['active', 'trial'];
  if (!allowedStatuses.includes(tenant.status)) return null;

  const userId = (req as Request & { user?: { id?: string } }).user?.id;
  let member: TenantMember | null = null;
  if (userId) {
    member = await getMember(tenant.id, userId);
  }

  return createTenantContext(tenant, member || undefined);
};

/**
 * tRPC middleware for requiring tenant context
 */
export const requireTenantMiddleware = () => {
  return async (opts: { ctx: { tenantContext?: TenantContext }; next: () => Promise<unknown> }) => {
    if (!opts.ctx.tenantContext) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Tenant context required',
      });
    }
    return opts.next();
  };
};

/**
 * tRPC middleware for requiring specific role
 */
export const requireRoleMiddleware = (role: TenantMember['role']) => {
  return async (opts: { ctx: { tenantContext?: TenantContext }; next: () => Promise<unknown> }) => {
    const ctx = opts.ctx.tenantContext;
    if (!ctx) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Tenant context required',
      });
    }

    if (!hasRole(role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Role ${role} or higher required`,
      });
    }

    return opts.next();
  };
};

/**
 * tRPC middleware for requiring specific permission
 */
export const requirePermissionMiddleware = (permission: string) => {
  return async (opts: { ctx: { tenantContext?: TenantContext }; next: () => Promise<unknown> }) => {
    const ctx = opts.ctx.tenantContext;
    if (!ctx) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Tenant context required',
      });
    }

    if (!hasPermission(permission)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Permission ${permission} required`,
      });
    }

    return opts.next();
  };
};
