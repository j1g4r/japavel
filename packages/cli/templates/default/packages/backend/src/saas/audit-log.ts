import { z } from 'zod';
import { getCurrentTenantId, getTenantContext } from '../tenancy/context';

/**
 * Audit Logging System
 * Comprehensive audit trail for compliance and security
 */

// Audit event category
export const AuditCategorySchema = z.enum([
  'auth',           // Authentication events
  'access',         // Resource access
  'data',           // Data operations (CRUD)
  'admin',          // Administrative actions
  'billing',        // Billing and subscription
  'security',       // Security-related events
  'integration',    // Third-party integrations
  'system',         // System events
]);

export type AuditCategory = z.infer<typeof AuditCategorySchema>;

// Audit event severity
export const AuditSeveritySchema = z.enum([
  'info',
  'warning',
  'error',
  'critical',
]);

export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;

// Audit event outcome
export const AuditOutcomeSchema = z.enum([
  'success',
  'failure',
  'pending',
  'partial',
]);

export type AuditOutcome = z.infer<typeof AuditOutcomeSchema>;

// Audit event schema
export const AuditEventSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date(),
  tenantId: z.string().uuid().optional(),

  // Actor information
  actor: z.object({
    type: z.enum(['user', 'service', 'system', 'anonymous']),
    id: z.string().optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
  }),

  // Event details
  category: AuditCategorySchema,
  action: z.string(),
  description: z.string(),
  severity: AuditSeveritySchema.default('info'),
  outcome: AuditOutcomeSchema.default('success'),

  // Resource affected
  resource: z.object({
    type: z.string(),
    id: z.string(),
    name: z.string().optional(),
  }).optional(),

  // Changes made (for data events)
  changes: z.object({
    before: z.record(z.unknown()).optional(),
    after: z.record(z.unknown()).optional(),
    fields: z.array(z.string()).optional(),
  }).optional(),

  // Additional context
  context: z.object({
    requestId: z.string().optional(),
    sessionId: z.string().optional(),
    correlationId: z.string().optional(),
    source: z.string().optional(),
    location: z.object({
      country: z.string().optional(),
      region: z.string().optional(),
      city: z.string().optional(),
    }).optional(),
  }).optional(),

  // Metadata
  metadata: z.record(z.unknown()).default({}),
  tags: z.array(z.string()).default([]),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

// Audit query options
export interface AuditQueryOptions {
  tenantId?: string;
  actorId?: string;
  category?: AuditCategory;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  severity?: AuditSeverity;
  outcome?: AuditOutcome;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  orderBy?: 'timestamp' | 'severity';
  orderDirection?: 'asc' | 'desc';
}

// Audit log backend interface
export interface AuditLogBackend {
  write(event: AuditEvent): Promise<void>;
  query(options: AuditQueryOptions): Promise<AuditEvent[]>;
  count(options: AuditQueryOptions): Promise<number>;
  getById(id: string): Promise<AuditEvent | null>;
}

/**
 * In-memory audit log backend (for development/testing)
 */
export class MemoryAuditLogBackend implements AuditLogBackend {
  private events: AuditEvent[] = [];
  private maxEvents: number;

  constructor(maxEvents = 10000) {
    this.maxEvents = maxEvents;
  }

  async write(event: AuditEvent): Promise<void> {
    this.events.push(event);

    // Rotate if exceeding max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  async query(options: AuditQueryOptions): Promise<AuditEvent[]> {
    let events = [...this.events];

    // Apply filters
    if (options.tenantId) {
      events = events.filter(e => e.tenantId === options.tenantId);
    }
    if (options.actorId) {
      events = events.filter(e => e.actor.id === options.actorId);
    }
    if (options.category) {
      events = events.filter(e => e.category === options.category);
    }
    if (options.action) {
      events = events.filter(e => e.action === options.action);
    }
    if (options.resourceType) {
      events = events.filter(e => e.resource?.type === options.resourceType);
    }
    if (options.resourceId) {
      events = events.filter(e => e.resource?.id === options.resourceId);
    }
    if (options.severity) {
      events = events.filter(e => e.severity === options.severity);
    }
    if (options.outcome) {
      events = events.filter(e => e.outcome === options.outcome);
    }
    if (options.startDate) {
      events = events.filter(e => e.timestamp >= options.startDate!);
    }
    if (options.endDate) {
      events = events.filter(e => e.timestamp <= options.endDate!);
    }

    // Sort
    const orderBy = options.orderBy || 'timestamp';
    const direction = options.orderDirection || 'desc';

    events.sort((a, b) => {
      let aVal: number, bVal: number;

      if (orderBy === 'timestamp') {
        aVal = a.timestamp.getTime();
        bVal = b.timestamp.getTime();
      } else {
        const severityOrder = { info: 0, warning: 1, error: 2, critical: 3 };
        aVal = severityOrder[a.severity];
        bVal = severityOrder[b.severity];
      }

      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Paginate
    const offset = options.offset || 0;
    const limit = options.limit || 100;

    return events.slice(offset, offset + limit);
  }

  async count(options: AuditQueryOptions): Promise<number> {
    const events = await this.query({ ...options, limit: undefined, offset: undefined });
    return events.length;
  }

  async getById(id: string): Promise<AuditEvent | null> {
    return this.events.find(e => e.id === id) || null;
  }
}

/**
 * Audit Logger Service
 */
export class AuditLogger {
  private backend: AuditLogBackend;
  private defaultTags: string[] = [];

  constructor(backend?: AuditLogBackend) {
    this.backend = backend || new MemoryAuditLogBackend();
  }

  /**
   * Set default tags for all events
   */
  setDefaultTags(tags: string[]): void {
    this.defaultTags = tags;
  }

  /**
   * Log an audit event
   */
  async log(event: Omit<z.input<typeof AuditEventSchema>, 'id' | 'timestamp'>): Promise<AuditEvent> {
    const fullEvent = AuditEventSchema.parse({
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      tags: [...this.defaultTags, ...(event.tags || [])],
    });

    await this.backend.write(fullEvent);
    return fullEvent;
  }

  /**
   * Log with automatic tenant context
   */
  async logWithContext(
    event: Omit<z.input<typeof AuditEventSchema>, 'id' | 'timestamp' | 'tenantId' | 'actor'> & {
      actor?: Partial<AuditEvent['actor']>;
    }
  ): Promise<AuditEvent> {
    const tenantContext = getTenantContext();

    return this.log({
      ...event,
      tenantId: tenantContext?.tenantId,
      actor: {
        type: tenantContext?.userId ? 'user' : 'anonymous',
        id: tenantContext?.userId,
        ...event.actor,
      },
    });
  }

  // Convenience methods for common events

  /**
   * Log authentication event
   */
  async logAuth(
    action: string,
    outcome: AuditOutcome,
    actor: AuditEvent['actor'],
    details?: { description?: string; metadata?: Record<string, unknown> }
  ): Promise<AuditEvent> {
    return this.log({
      category: 'auth',
      action,
      description: details?.description || `Authentication: ${action}`,
      outcome,
      severity: outcome === 'failure' ? 'warning' : 'info',
      actor,
      tenantId: getCurrentTenantId(),
      metadata: details?.metadata || {},
    });
  }

  /**
   * Log data access event
   */
  async logDataAccess(
    action: 'create' | 'read' | 'update' | 'delete',
    resource: AuditEvent['resource'],
    changes?: AuditEvent['changes']
  ): Promise<AuditEvent> {
    const tenantContext = getTenantContext();

    return this.log({
      category: 'data',
      action: `${resource?.type}.${action}`,
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource?.type}: ${resource?.id}`,
      outcome: 'success',
      severity: 'info',
      actor: {
        type: tenantContext?.userId ? 'user' : 'system',
        id: tenantContext?.userId,
      },
      tenantId: tenantContext?.tenantId,
      resource,
      changes,
    });
  }

  /**
   * Log security event
   */
  async logSecurity(
    action: string,
    severity: AuditSeverity,
    details: {
      description: string;
      actor?: AuditEvent['actor'];
      resource?: AuditEvent['resource'];
      metadata?: Record<string, unknown>;
    }
  ): Promise<AuditEvent> {
    return this.log({
      category: 'security',
      action,
      description: details.description,
      outcome: severity === 'critical' || severity === 'error' ? 'failure' : 'success',
      severity,
      actor: details.actor || { type: 'system' },
      tenantId: getCurrentTenantId(),
      resource: details.resource,
      metadata: details.metadata || {},
    });
  }

  /**
   * Log admin action
   */
  async logAdmin(
    action: string,
    resource?: AuditEvent['resource'],
    changes?: AuditEvent['changes']
  ): Promise<AuditEvent> {
    const tenantContext = getTenantContext();

    return this.log({
      category: 'admin',
      action,
      description: `Admin action: ${action}`,
      outcome: 'success',
      severity: 'info',
      actor: {
        type: 'user',
        id: tenantContext?.userId,
      },
      tenantId: tenantContext?.tenantId,
      resource,
      changes,
    });
  }

  /**
   * Query audit logs
   */
  async query(options: AuditQueryOptions): Promise<AuditEvent[]> {
    return this.backend.query(options);
  }

  /**
   * Count audit logs
   */
  async count(options: AuditQueryOptions): Promise<number> {
    return this.backend.count(options);
  }

  /**
   * Get audit log by ID
   */
  async getById(id: string): Promise<AuditEvent | null> {
    return this.backend.getById(id);
  }

  /**
   * Get recent events for a tenant
   */
  async getRecentEvents(
    tenantId: string,
    limit = 50
  ): Promise<AuditEvent[]> {
    return this.query({ tenantId, limit, orderBy: 'timestamp', orderDirection: 'desc' });
  }

  /**
   * Get events for a resource
   */
  async getResourceHistory(
    resourceType: string,
    resourceId: string,
    limit = 100
  ): Promise<AuditEvent[]> {
    return this.query({
      resourceType,
      resourceId,
      limit,
      orderBy: 'timestamp',
      orderDirection: 'desc',
    });
  }

  /**
   * Get events by user
   */
  async getUserActivity(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<AuditEvent[]> {
    return this.query({
      actorId: userId,
      ...options,
      orderBy: 'timestamp',
      orderDirection: 'desc',
    });
  }
}

// Global audit logger instance
export const auditLogger = new AuditLogger();

/**
 * Create audit logger
 */
export const createAuditLogger = (backend?: AuditLogBackend): AuditLogger => {
  return new AuditLogger(backend);
};

/**
 * Middleware for automatic request logging
 */
export const auditMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const startTime = Date.now();

    // Log on response finish
    res.on('finish', async () => {
      const duration = Date.now() - startTime;
      const success = res.statusCode < 400;

      await auditLogger.logWithContext({
        category: 'access',
        action: `${req.method} ${req.path}`,
        description: `${req.method} ${req.path} - ${res.statusCode}`,
        outcome: success ? 'success' : 'failure',
        severity: success ? 'info' : (res.statusCode >= 500 ? 'error' : 'warning'),
        actor: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
        },
      });
    });

    next();
  };
};

// Type imports for middleware
import { Request, Response, NextFunction } from 'express';
