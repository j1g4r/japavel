import { z } from "zod";
import { Request, Response, NextFunction } from "express";
/**
 * Authentication Patterns
 * Secure authentication utilities and middleware
 */
export declare const TokenTypeSchema: z.ZodEnum<["access", "refresh", "api_key", "verification", "password_reset", "invitation"]>;
export type TokenType = z.infer<typeof TokenTypeSchema>;
export declare const SessionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    tenantId: z.ZodOptional<z.ZodString>;
    token: z.ZodString;
    refreshToken: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodDate;
    createdAt: z.ZodDate;
    lastActiveAt: z.ZodDate;
    ip: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    lastActiveAt: Date;
    metadata: Record<string, unknown>;
    tenantId?: string | undefined;
    refreshToken?: string | undefined;
    ip?: string | undefined;
    userAgent?: string | undefined;
}, {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    lastActiveAt: Date;
    tenantId?: string | undefined;
    refreshToken?: string | undefined;
    ip?: string | undefined;
    userAgent?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type Session = z.infer<typeof SessionSchema>;
export declare const ApiKeySchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    name: z.ZodString;
    keyHash: z.ZodString;
    keyPrefix: z.ZodString;
    scopes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    rateLimit: z.ZodOptional<z.ZodNumber>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    lastUsedAt: z.ZodOptional<z.ZodDate>;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
    revokedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tenantId: string;
    createdAt: Date;
    name: string;
    keyHash: string;
    keyPrefix: string;
    scopes: string[];
    createdBy: string;
    expiresAt?: Date | undefined;
    rateLimit?: number | undefined;
    lastUsedAt?: Date | undefined;
    revokedAt?: Date | undefined;
}, {
    id: string;
    tenantId: string;
    createdAt: Date;
    name: string;
    keyHash: string;
    keyPrefix: string;
    createdBy: string;
    expiresAt?: Date | undefined;
    scopes?: string[] | undefined;
    rateLimit?: number | undefined;
    lastUsedAt?: Date | undefined;
    revokedAt?: Date | undefined;
}>;
export type ApiKey = z.infer<typeof ApiKeySchema>;
export declare const AuthUserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    passwordHash: z.ZodOptional<z.ZodString>;
    emailVerified: z.ZodDefault<z.ZodBoolean>;
    mfaEnabled: z.ZodDefault<z.ZodBoolean>;
    mfaSecret: z.ZodOptional<z.ZodString>;
    failedLoginAttempts: z.ZodDefault<z.ZodNumber>;
    lockedUntil: z.ZodOptional<z.ZodDate>;
    lastLoginAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    email: string;
    emailVerified: boolean;
    mfaEnabled: boolean;
    failedLoginAttempts: number;
    updatedAt: Date;
    passwordHash?: string | undefined;
    mfaSecret?: string | undefined;
    lockedUntil?: Date | undefined;
    lastLoginAt?: Date | undefined;
}, {
    id: string;
    createdAt: Date;
    email: string;
    updatedAt: Date;
    passwordHash?: string | undefined;
    emailVerified?: boolean | undefined;
    mfaEnabled?: boolean | undefined;
    mfaSecret?: string | undefined;
    failedLoginAttempts?: number | undefined;
    lockedUntil?: Date | undefined;
    lastLoginAt?: Date | undefined;
}>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
/**
 * Password utilities
 */
export declare const passwordUtils: {
    /**
     * Hash a password with salt
     */
    hash(password: string): Promise<string>;
    /**
     * Verify password against hash
     */
    verify(password: string, storedHash: string): Promise<boolean>;
    /**
     * Validate password strength
     */
    validate(password: string): {
        valid: boolean;
        errors: string[];
    };
};
/**
 * Token utilities
 */
export declare const tokenUtils: {
    /**
     * Generate secure random token
     */
    generate(length?: number): string;
    /**
     * Generate API key with prefix
     */
    generateApiKey(prefix?: string): {
        key: string;
        keyHash: string;
        keyPrefix: string;
    };
    /**
     * Hash a token for storage
     */
    hash(token: string): string;
    /**
     * Verify a token against its hash
     */
    verify(token: string, hash: string): boolean;
};
/**
 * Session manager with Redis persistence
 */
export declare class SessionManager {
    private redis;
    constructor(redisUrl?: string);
    /**
     * Create a new session
     */
    create(userId: string, options?: {
        tenantId?: string;
        expiresIn?: number;
        ip?: string;
        userAgent?: string;
        metadata?: Record<string, unknown>;
    }): Promise<Session>;
    /**
     * Get session by ID
     */
    get(sessionId: string): Promise<Session | null>;
    /**
     * Get session by token
     */
    getByToken(token: string): Promise<Session | null>;
    /**
     * Update session activity
     */
    touch(sessionId: string): Promise<void>;
    /**
     * Revoke a session
     */
    revoke(sessionId: string): Promise<boolean>;
    /**
     * Revoke all sessions for a user
     */
    revokeAllForUser(userId: string): Promise<number>;
    /**
     * Get all sessions for a user
     */
    getUserSessions(userId: string): Promise<Session[]>;
    /**
     * Cleanup expired sessions
     */
    cleanup(): Promise<number>;
    /**
     * Get session count for a user
     */
    getUserSessionCount(userId: string): Promise<number>;
    /**
     * Check if session exists
     */
    exists(sessionId: string): Promise<boolean>;
    /**
     * Disconnect from Redis
     */
    disconnect(): Promise<void>;
}
/**
 * Get or create session manager instance
 */
export declare const getSessionManager: () => SessionManager;
/**
 * Initialize session manager with custom Redis URL
 */
export declare const initSessionManager: (redisUrl: string) => SessionManager;
/**
 * Global session manager instance for export
 */
export declare const sessionManager: SessionManager;
/**
 * Authentication middleware
 */
export declare const authMiddleware: (options?: {
    required?: boolean;
    allowApiKey?: boolean;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * tRPC authentication context
 */
export declare const createAuthContext: (opts: {
    req: Request;
}) => Promise<{
    userId?: string;
    session?: Session;
}>;
/**
 * tRPC protected procedure middleware
 */
export declare const requireAuth: () => (opts: {
    ctx: {
        userId?: string;
    };
    next: () => Promise<unknown>;
}) => Promise<unknown>;
/**
 * Rate limit failed login attempts
 */
export declare const loginRateLimiter: {
    attempts: Map<string, {
        count: number;
        lastAttempt: number;
    }>;
    maxAttempts: number;
    windowMs: number;
    lockoutMs: number;
    check(identifier: string): {
        allowed: boolean;
        retryAfter?: number;
    };
    recordFailure(identifier: string): void;
    reset(identifier: string): void;
};
//# sourceMappingURL=auth.d.ts.map