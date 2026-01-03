import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import Redis from "ioredis";

/**
 * Authentication Patterns
 * Secure authentication utilities and middleware
 */

// Token types
export const TokenTypeSchema = z.enum([
  "access",
  "refresh",
  "api_key",
  "verification",
  "password_reset",
  "invitation",
]);

export type TokenType = z.infer<typeof TokenTypeSchema>;

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

export type Session = z.infer<typeof SessionSchema>;

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

export type ApiKey = z.infer<typeof ApiKeySchema>;

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

export type AuthUser = z.infer<typeof AuthUserSchema>;

/**
 * Password utilities
 */
export const passwordUtils = {
  /**
   * Hash a password with salt
   */
  async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  },

  /**
   * Verify password against hash
   */
  async verify(password: string, storedHash: string): Promise<boolean> {
    const [salt, hash] = storedHash.split(":");
    const newHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return hash === newHash;
  },

  /**
   * Validate password strength
   */
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain a number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain a special character");
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
  generate(length = 32): string {
    return crypto.randomBytes(length).toString("hex");
  },

  /**
   * Generate API key with prefix
   */
  generateApiKey(prefix = "nxs"): {
    key: string;
    keyHash: string;
    keyPrefix: string;
  } {
    const key = `${prefix}_${crypto.randomBytes(24).toString("base64url")}`;
    const keyHash = crypto.createHash("sha256").update(key).digest("hex");
    const keyPrefix = key.slice(0, 8);

    return { key, keyHash, keyPrefix };
  },

  /**
   * Hash a token for storage
   */
  hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  },

  /**
   * Verify a token against its hash
   */
  verify(token: string, hash: string): boolean {
    const tokenHash = this.hash(token);
    return crypto.timingSafeEqual(Buffer.from(tokenHash), Buffer.from(hash));
  },
};

/**
 * Session manager with Redis persistence
 */
export class SessionManager {
  private redis: Redis;

  constructor(redisUrl?: string) {
    const url = redisUrl || process.env.REDIS_URL;
    if (!url) {
      throw new Error(
        "Redis URL required. Set REDIS_URL environment variable.",
      );
    }
    this.redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      enableReadyCheck: true,
      enableOfflineQueue: true,
    });

    // Handle connection errors
    this.redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    this.redis.on("connect", () => {
      console.log("Redis connected successfully");
    });
  }

  /**
   * Create a new session
   */
  async create(
    userId: string,
    options?: {
      tenantId?: string;
      expiresIn?: number; // seconds
      ip?: string;
      userAgent?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<Session> {
    const expiresIn = options?.expiresIn ?? 3600 * 24; // 24 hours default

    const session: Session = {
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

    // Store session in Redis with expiration
    const pipeline = this.redis.pipeline();
    pipeline.setex(`session:${session.id}`, expiresIn, JSON.stringify(session));

    // Store token to session mapping
    pipeline.setex(`token:${session.token}`, expiresIn, session.id);

    // Add to user's session list
    pipeline.sadd(`user_sessions:${userId}`, session.id);
    pipeline.expire(`user_sessions:${userId}`, expiresIn);

    await pipeline.exec();

    return session;
  }

  /**
   * Get session by ID
   */
  async get(sessionId: string): Promise<Session | null> {
    const data = await this.redis.get(`session:${sessionId}`);
    if (!data) return null;

    const session: Session = JSON.parse(data);

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
  async getByToken(token: string): Promise<Session | null> {
    const sessionId = await this.redis.get(`token:${token}`);
    if (!sessionId) return null;

    return await this.get(sessionId);
  }

  /**
   * Update session activity
   */
  async touch(sessionId: string): Promise<void> {
    const session = await this.get(sessionId);
    if (!session) return;

    session.lastActiveAt = new Date();

    // Update session in Redis
    const ttl = await this.redis.ttl(`session:${sessionId}`);
    if (ttl > 0) {
      await this.redis.setex(
        `session:${sessionId}`,
        ttl,
        JSON.stringify(session),
      );
    }
  }

  /**
   * Revoke a session
   */
  async revoke(sessionId: string): Promise<boolean> {
    const data = await this.redis.get(`session:${sessionId}`);
    if (!data) return false;

    const session: Session = JSON.parse(data);

    const pipeline = this.redis.pipeline();

    // Remove session
    pipeline.del(`session:${sessionId}`);

    // Remove token mapping
    if (session.token) {
      pipeline.del(`token:${session.token}`);
    }

    // Remove from user's session list
    pipeline.srem(`user_sessions:${session.userId}`, sessionId);

    await pipeline.exec();

    return true;
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllForUser(userId: string): Promise<number> {
    const sessionIds = await this.redis.smembers(`user_sessions:${userId}`);
    if (!sessionIds || sessionIds.length === 0) return 0;

    let count = 0;
    for (const sessionId of sessionIds) {
      const revoked = await this.revoke(sessionId);
      if (revoked) count++;
    }

    // Clear user's session list
    await this.redis.del(`user_sessions:${userId}`);

    return count;
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    const sessionIds = await this.redis.smembers(`user_sessions:${userId}`);
    if (!sessionIds || sessionIds.length === 0) return [];

    const sessions: Session[] = [];

    // Fetch all sessions in parallel
    const promises = sessionIds.map((id) => this.get(id));
    const results = await Promise.all(promises);

    for (const session of results) {
      if (session) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  /**
   * Cleanup expired sessions
   */
  async cleanup(): Promise<number> {
    // Redis automatically handles expiration of keys
    // This method is kept for API compatibility
    return 0;
  }

  /**
   * Get session count for a user
   */
  async getUserSessionCount(userId: string): Promise<number> {
    return await this.redis.scard(`user_sessions:${userId}`);
  }

  /**
   * Check if session exists
   */
  async exists(sessionId: string): Promise<boolean> {
    return (await this.redis.exists(`session:${sessionId}`)) > 0;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}

// Global session manager instance
let sessionManagerInstance: SessionManager | null = null;

/**
 * Get or create session manager instance
 */
export const getSessionManager = (): SessionManager => {
  if (!sessionManagerInstance) {
    sessionManagerInstance = new SessionManager();
  }
  return sessionManagerInstance;
};

/**
 * Initialize session manager with custom Redis URL
 */
export const initSessionManager = (redisUrl: string): SessionManager => {
  sessionManagerInstance = new SessionManager(redisUrl);
  return sessionManagerInstance;
};

/**
 * Legacy export for backward compatibility
 */
// Lazy getter for backward compatibility - only initializes when accessed
Object.defineProperty(exports, "sessionManager", {
  get: () => getSessionManager(),
  enumerable: true,
  configurable: false,
});

/**
 * Authentication middleware
 */
export const authMiddleware = (options?: {
  required?: boolean;
  allowApiKey?: boolean;
}) => {
  const { required = true, allowApiKey = true } = options || {};

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let session: Session | null = null;

      // Try Bearer token first
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        session = await sessionManager.getByToken(token);
      }

      // Try API key if allowed
      if (!session && allowApiKey) {
        const apiKey = req.headers["x-api-key"] as string;
        if (apiKey) {
          // In production, verify against stored API keys
          // For now, this is a placeholder
        }
      }

      if (!session && required) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      if (session) {
        await sessionManager.touch(session.id);
        (req as Request & { user?: { id: string }; session?: Session }).user = {
          id: session.userId,
        };
        (req as Request & { session?: Session }).session = session;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * tRPC authentication context
 */
export const createAuthContext = async (opts: {
  req: Request;
}): Promise<{ userId?: string; session?: Session }> => {
  const authHeader = opts.req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
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
  return async (opts: {
    ctx: { userId?: string };
    next: () => Promise<unknown>;
  }) => {
    if (!opts.ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }
    return opts.next();
  };
};

/**
 * Rate limit failed login attempts
 */
export const loginRateLimiter = {
  attempts: new Map<string, { count: number; lastAttempt: number }>(),
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  lockoutMs: 30 * 60 * 1000, // 30 minutes

  check(identifier: string): { allowed: boolean; retryAfter?: number } {
    const entry = this.attempts.get(identifier);
    const now = Date.now();

    if (!entry) {
      return { allowed: true };
    }

    // Check if lockout period has passed
    if (entry.count >= this.maxAttempts) {
      const lockoutEnd = entry.lastAttempt + this.lockoutMs;
      if (now < lockoutEnd) {
        return {
          allowed: false,
          retryAfter: Math.ceil((lockoutEnd - now) / 1000),
        };
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

  recordFailure(identifier: string): void {
    const entry = this.attempts.get(identifier) || { count: 0, lastAttempt: 0 };
    entry.count++;
    entry.lastAttempt = Date.now();
    this.attempts.set(identifier, entry);
  },

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  },
};
