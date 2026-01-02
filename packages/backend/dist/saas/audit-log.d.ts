import { z } from 'zod';
/**
 * Audit Logging System
 * Comprehensive audit trail for compliance and security
 */
export declare const AuditCategorySchema: z.ZodEnum<["auth", "access", "data", "admin", "billing", "security", "integration", "system"]>;
export type AuditCategory = z.infer<typeof AuditCategorySchema>;
export declare const AuditSeveritySchema: z.ZodEnum<["info", "warning", "error", "critical"]>;
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;
export declare const AuditOutcomeSchema: z.ZodEnum<["success", "failure", "pending", "partial"]>;
export type AuditOutcome = z.infer<typeof AuditOutcomeSchema>;
export declare const AuditEventSchema: z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodDate;
    tenantId: z.ZodOptional<z.ZodString>;
    actor: z.ZodObject<{
        type: z.ZodEnum<["user", "service", "system", "anonymous"]>;
        id: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        ip: z.ZodOptional<z.ZodString>;
        userAgent: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "user" | "system" | "service" | "anonymous";
        email?: string | undefined;
        name?: string | undefined;
        ip?: string | undefined;
        id?: string | undefined;
        userAgent?: string | undefined;
    }, {
        type: "user" | "system" | "service" | "anonymous";
        email?: string | undefined;
        name?: string | undefined;
        ip?: string | undefined;
        id?: string | undefined;
        userAgent?: string | undefined;
    }>;
    category: z.ZodEnum<["auth", "access", "data", "admin", "billing", "security", "integration", "system"]>;
    action: z.ZodString;
    description: z.ZodString;
    severity: z.ZodDefault<z.ZodEnum<["info", "warning", "error", "critical"]>>;
    outcome: z.ZodDefault<z.ZodEnum<["success", "failure", "pending", "partial"]>>;
    resource: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        name?: string | undefined;
    }, {
        type: string;
        id: string;
        name?: string | undefined;
    }>>;
    changes: z.ZodOptional<z.ZodObject<{
        before: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        after: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        fields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        before?: Record<string, unknown> | undefined;
        after?: Record<string, unknown> | undefined;
        fields?: string[] | undefined;
    }, {
        before?: Record<string, unknown> | undefined;
        after?: Record<string, unknown> | undefined;
        fields?: string[] | undefined;
    }>>;
    context: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        correlationId: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodObject<{
            country: z.ZodOptional<z.ZodString>;
            region: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
        }, {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        sessionId?: string | undefined;
        requestId?: string | undefined;
        correlationId?: string | undefined;
        source?: string | undefined;
        location?: {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
        } | undefined;
    }, {
        sessionId?: string | undefined;
        requestId?: string | undefined;
        correlationId?: string | undefined;
        source?: string | undefined;
        location?: {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
        } | undefined;
    }>>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    timestamp: Date;
    id: string;
    metadata: Record<string, unknown>;
    action: string;
    description: string;
    actor: {
        type: "user" | "system" | "service" | "anonymous";
        email?: string | undefined;
        name?: string | undefined;
        ip?: string | undefined;
        id?: string | undefined;
        userAgent?: string | undefined;
    };
    category: "security" | "data" | "access" | "admin" | "billing" | "auth" | "integration" | "system";
    severity: "info" | "error" | "warning" | "critical";
    outcome: "pending" | "success" | "failure" | "partial";
    tags: string[];
    tenantId?: string | undefined;
    resource?: {
        type: string;
        id: string;
        name?: string | undefined;
    } | undefined;
    changes?: {
        before?: Record<string, unknown> | undefined;
        after?: Record<string, unknown> | undefined;
        fields?: string[] | undefined;
    } | undefined;
    context?: {
        sessionId?: string | undefined;
        requestId?: string | undefined;
        correlationId?: string | undefined;
        source?: string | undefined;
        location?: {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
        } | undefined;
    } | undefined;
}, {
    timestamp: Date;
    id: string;
    action: string;
    description: string;
    actor: {
        type: "user" | "system" | "service" | "anonymous";
        email?: string | undefined;
        name?: string | undefined;
        ip?: string | undefined;
        id?: string | undefined;
        userAgent?: string | undefined;
    };
    category: "security" | "data" | "access" | "admin" | "billing" | "auth" | "integration" | "system";
    tenantId?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    severity?: "info" | "error" | "warning" | "critical" | undefined;
    outcome?: "pending" | "success" | "failure" | "partial" | undefined;
    resource?: {
        type: string;
        id: string;
        name?: string | undefined;
    } | undefined;
    changes?: {
        before?: Record<string, unknown> | undefined;
        after?: Record<string, unknown> | undefined;
        fields?: string[] | undefined;
    } | undefined;
    context?: {
        sessionId?: string | undefined;
        requestId?: string | undefined;
        correlationId?: string | undefined;
        source?: string | undefined;
        location?: {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
        } | undefined;
    } | undefined;
    tags?: string[] | undefined;
}>;
export type AuditEvent = z.infer<typeof AuditEventSchema>;
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
export interface AuditLogBackend {
    write(event: AuditEvent): Promise<void>;
    query(options: AuditQueryOptions): Promise<AuditEvent[]>;
    count(options: AuditQueryOptions): Promise<number>;
    getById(id: string): Promise<AuditEvent | null>;
}
/**
 * In-memory audit log backend (for development/testing)
 */
export declare class MemoryAuditLogBackend implements AuditLogBackend {
    private events;
    private maxEvents;
    constructor(maxEvents?: number);
    write(event: AuditEvent): Promise<void>;
    query(options: AuditQueryOptions): Promise<AuditEvent[]>;
    count(options: AuditQueryOptions): Promise<number>;
    getById(id: string): Promise<AuditEvent | null>;
}
/**
 * Audit Logger Service
 */
export declare class AuditLogger {
    private backend;
    private defaultTags;
    constructor(backend?: AuditLogBackend);
    /**
     * Set default tags for all events
     */
    setDefaultTags(tags: string[]): void;
    /**
     * Log an audit event
     */
    log(event: Omit<z.input<typeof AuditEventSchema>, 'id' | 'timestamp'>): Promise<AuditEvent>;
    /**
     * Log with automatic tenant context
     */
    logWithContext(event: Omit<z.input<typeof AuditEventSchema>, 'id' | 'timestamp' | 'tenantId' | 'actor'> & {
        actor?: Partial<AuditEvent['actor']>;
    }): Promise<AuditEvent>;
    /**
     * Log authentication event
     */
    logAuth(action: string, outcome: AuditOutcome, actor: AuditEvent['actor'], details?: {
        description?: string;
        metadata?: Record<string, unknown>;
    }): Promise<AuditEvent>;
    /**
     * Log data access event
     */
    logDataAccess(action: 'create' | 'read' | 'update' | 'delete', resource: AuditEvent['resource'], changes?: AuditEvent['changes']): Promise<AuditEvent>;
    /**
     * Log security event
     */
    logSecurity(action: string, severity: AuditSeverity, details: {
        description: string;
        actor?: AuditEvent['actor'];
        resource?: AuditEvent['resource'];
        metadata?: Record<string, unknown>;
    }): Promise<AuditEvent>;
    /**
     * Log admin action
     */
    logAdmin(action: string, resource?: AuditEvent['resource'], changes?: AuditEvent['changes']): Promise<AuditEvent>;
    /**
     * Query audit logs
     */
    query(options: AuditQueryOptions): Promise<AuditEvent[]>;
    /**
     * Count audit logs
     */
    count(options: AuditQueryOptions): Promise<number>;
    /**
     * Get audit log by ID
     */
    getById(id: string): Promise<AuditEvent | null>;
    /**
     * Get recent events for a tenant
     */
    getRecentEvents(tenantId: string, limit?: number): Promise<AuditEvent[]>;
    /**
     * Get events for a resource
     */
    getResourceHistory(resourceType: string, resourceId: string, limit?: number): Promise<AuditEvent[]>;
    /**
     * Get events by user
     */
    getUserActivity(userId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<AuditEvent[]>;
}
export declare const auditLogger: AuditLogger;
/**
 * Create audit logger
 */
export declare const createAuditLogger: (backend?: AuditLogBackend) => AuditLogger;
/**
 * Middleware for automatic request logging
 */
export declare const auditMiddleware: () => (req: Request, res: Response, next: NextFunction) => Promise<void>;
import { Request, Response, NextFunction } from 'express';
//# sourceMappingURL=audit-log.d.ts.map