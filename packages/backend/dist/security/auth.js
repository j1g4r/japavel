import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
/**
 * Authentication Patterns
 * Secure authentication utilities and middleware
 */
// Token types
export const TokenTypeSchema = z.enum([
    'access',
    'refresh',
    'api_key',
    'verification',
    'password_reset',
    'invitation',
]);
// Session schema
export const SessionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    tenantId: z.string().uuid().optional(),
    token: z.string(),
    refreshToken: z.string().optional(),
    expiresAt: z.date(),
    createdAt: z.date(),
    lastActiveAt: z.date(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    metadata: z.record(z.unknown()).default({}),
});
// API Key schema
export const ApiKeySchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    name: z.string(),
    keyHash: z.string(),
    keyPrefix: z.string(), // First 8 chars for identification
    scopes: z.array(z.string()).default([]),
    rateLimit: z.number().int().optional(),
    expiresAt: z.date().optional(),
    lastUsedAt: z.date().optional(),
    createdBy: z.string().uuid(),
    createdAt: z.date(),
    revokedAt: z.date().optional(),
});
// Auth user schema
export const AuthUserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    passwordHash: z.string().optional(),
    emailVerified: z.boolean().default(false),
    mfaEnabled: z.boolean().default(false),
    mfaSecret: z.string().optional(),
    failedLoginAttempts: z.number().int().default(0),
    lockedUntil: z.date().optional(),
    lastLoginAt: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
/**
 * Password utilities
 */
export const passwordUtils = {
    /**
     * Hash a password with salt
     */
    async hash(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(password, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    },
    /**
     * Verify password against hash
     */
    async verify(password, storedHash) {
        const [salt, hash] = storedHash.split(':');
        const newHash = crypto.scryptSync(password, salt, 64).toString('hex');
        return hash === newHash;
    },
    /**
     * Validate password strength
     */
    validate(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain a number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain a special character');
        }
        return { valid: errors.length === 0, errors };
    },
};
/**
 * Token utilities
 */
export const tokenUtils = {
    /**
     * Generate secure random token
     */
    generate(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    },
    /**
     * Generate API key with prefix
     */
    generateApiKey(prefix = 'nxs') {
        const key = `${prefix}_${crypto.randomBytes(24).toString('base64url')}`;
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');
        const keyPrefix = key.slice(0, 8);
        return { key, keyHash, keyPrefix };
    },
    /**
     * Hash a token for storage
     */
    hash(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    },
    /**
     * Verify a token against its hash
     */
    verify(token, hash) {
        const tokenHash = this.hash(token);
        return crypto.timingSafeEqual(Buffer.from(tokenHash), Buffer.from(hash));
    },
};
/**
 * Session manager
 */
export class SessionManager {
    sessions = new Map();
    userSessions = new Map();
    /**
     * Create a new session
     */
    async create(userId, options) {
        const expiresIn = options?.expiresIn ?? 3600 * 24; // 24 hours default
        const session = {
            id: crypto.randomUUID(),
            userId,
            tenantId: options?.tenantId,
            token: tokenUtils.generate(),
            refreshToken: tokenUtils.generate(),
            expiresAt: new Date(Date.now() + expiresIn * 1000),
            createdAt: new Date(),
            lastActiveAt: new Date(),
            ip: options?.ip,
            userAgent: options?.userAgent,
            metadata: options?.metadata || {},
        };
        this.sessions.set(session.id, session);
        // Track user sessions
        if (!this.userSessions.has(userId)) {
            this.userSessions.set(userId, new Set());
        }
        this.userSessions.get(userId).add(session.id);
        return session;
    }
    /**
     * Get session by ID
     */
    async get(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        // Check expiration
        if (new Date() > session.expiresAt) {
            await this.revoke(sessionId);
            return null;
        }
        return session;
    }
    /**
     * Get session by token
     */
    async getByToken(token) {
        for (const session of this.sessions.values()) {
            if (session.token === token) {
                if (new Date() > session.expiresAt) {
                    await this.revoke(session.id);
                    return null;
                }
                return session;
            }
        }
        return null;
    }
    /**
     * Update session activity
     */
    async touch(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastActiveAt = new Date();
        }
    }
    /**
     * Revoke a session
     */
    async revoke(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return false;
        this.sessions.delete(sessionId);
        this.userSessions.get(session.userId)?.delete(sessionId);
        return true;
    }
    /**
     * Revoke all sessions for a user
     */
    async revokeAllForUser(userId) {
        const sessionIds = this.userSessions.get(userId);
        if (!sessionIds)
            return 0;
        let count = 0;
        for (const sessionId of sessionIds) {
            this.sessions.delete(sessionId);
            count++;
        }
        this.userSessions.delete(userId);
        return count;
    }
    /**
     * Get all sessions for a user
     */
    async getUserSessions(userId) {
        const sessionIds = this.userSessions.get(userId);
        if (!sessionIds)
            return [];
        const sessions = [];
        for (const sessionId of sessionIds) {
            const session = await this.get(sessionId);
            if (session) {
                sessions.push(session);
            }
        }
        return sessions;
    }
    /**
     * Cleanup expired sessions
     */
    async cleanup() {
        const now = new Date();
        let removed = 0;
        for (const [id, session] of this.sessions) {
            if (now > session.expiresAt) {
                await this.revoke(id);
                removed++;
            }
        }
        return removed;
    }
}
// Global session manager
export const sessionManager = new SessionManager();
/**
 * Authentication middleware
 */
export const authMiddleware = (options) => {
    const { required = true, allowApiKey = true } = options || {};
    return async (req, res, next) => {
        try {
            let session = null;
            // Try Bearer token first
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                const token = authHeader.slice(7);
                session = await sessionManager.getByToken(token);
            }
            // Try API key if allowed
            if (!session && allowApiKey) {
                const apiKey = req.headers['x-api-key'];
                if (apiKey) {
                    // In production, verify against stored API keys
                    // For now, this is a placeholder
                }
            }
            if (!session && required) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }
            if (session) {
                await sessionManager.touch(session.id);
                req.user = { id: session.userId };
                req.session = session;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
/**
 * tRPC authentication context
 */
export const createAuthContext = async (opts) => {
    const authHeader = opts.req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return {};
    }
    const token = authHeader.slice(7);
    const session = await sessionManager.getByToken(token);
    if (!session) {
        return {};
    }
    await sessionManager.touch(session.id);
    return {
        userId: session.userId,
        session,
    };
};
/**
 * tRPC protected procedure middleware
 */
export const requireAuth = () => {
    return async (opts) => {
        if (!opts.ctx.userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            });
        }
        return opts.next();
    };
};
/**
 * Rate limit failed login attempts
 */
export const loginRateLimiter = {
    attempts: new Map(),
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 30 * 60 * 1000, // 30 minutes
    check(identifier) {
        const entry = this.attempts.get(identifier);
        const now = Date.now();
        if (!entry) {
            return { allowed: true };
        }
        // Check if lockout period has passed
        if (entry.count >= this.maxAttempts) {
            const lockoutEnd = entry.lastAttempt + this.lockoutMs;
            if (now < lockoutEnd) {
                return { allowed: false, retryAfter: Math.ceil((lockoutEnd - now) / 1000) };
            }
            // Lockout expired, reset
            this.attempts.delete(identifier);
            return { allowed: true };
        }
        // Check if window has expired
        if (now - entry.lastAttempt > this.windowMs) {
            this.attempts.delete(identifier);
            return { allowed: true };
        }
        return { allowed: true };
    },
    recordFailure(identifier) {
        const entry = this.attempts.get(identifier) || { count: 0, lastAttempt: 0 };
        entry.count++;
        entry.lastAttempt = Date.now();
        this.attempts.set(identifier, entry);
    },
    reset(identifier) {
        this.attempts.delete(identifier);
    },
};
