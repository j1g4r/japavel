import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { TRPCError } from '@trpc/server';

/**
 * Rate Limiting System
 * Provides flexible rate limiting with multiple strategies
 */

// Rate limit configuration schema
export const RateLimitConfigSchema = z.object({
  windowMs: z.number().int().min(1000).default(60000), // 1 minute
  maxRequests: z.number().int().min(1).default(100),
  keyGenerator: z.enum(['ip', 'user', 'tenant', 'api-key', 'custom']).default('ip'),
  skipFailedRequests: z.boolean().default(false),
  skipSuccessfulRequests: z.boolean().default(false),
  headers: z.boolean().default(true),
  message: z.string().default('Too many requests, please try again later'),
});

export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;

// Rate limit entry
export interface RateLimitEntry {
  count: number;
  resetAt: number;
  firstRequest: number;
}

// Rate limit result
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
  limit: number;
}

/**
 * Rate limit store interface
 */
export interface RateLimitStore {
  get(key: string): Promise<RateLimitEntry | null>;
  set(key: string, entry: RateLimitEntry): Promise<void>;
  increment(key: string, windowMs: number): Promise<RateLimitEntry>;
  reset(key: string): Promise<void>;
}

/**
 * In-memory rate limit store
 */
export class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>();

  async get(key: string): Promise<RateLimitEntry | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if window has expired
    if (Date.now() > entry.resetAt) {
      this.store.delete(key);
      return null;
    }

    return entry;
  }

  async set(key: string, entry: RateLimitEntry): Promise<void> {
    this.store.set(key, entry);
  }

  async increment(key: string, windowMs: number): Promise<RateLimitEntry> {
    const now = Date.now();
    let entry = await this.get(key);

    if (!entry) {
      entry = {
        count: 1,
        resetAt: now + windowMs,
        firstRequest: now,
      };
    } else {
      entry.count++;
    }

    await this.set(key, entry);
    return entry;
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  // Cleanup expired entries (call periodically)
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Rate limiter class
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private store: RateLimitStore;
  private customKeyGenerator?: (req: Request) => string;

  constructor(
    config: Partial<RateLimitConfig> = {},
    store?: RateLimitStore,
    customKeyGenerator?: (req: Request) => string
  ) {
    this.config = RateLimitConfigSchema.parse(config);
    this.store = store || new MemoryRateLimitStore();
    this.customKeyGenerator = customKeyGenerator;
  }

  /**
   * Generate key for rate limiting
   */
  private generateKey(req: Request): string {
    switch (this.config.keyGenerator) {
      case 'ip':
        return `ip:${req.ip || req.socket.remoteAddress || 'unknown'}`;

      case 'user':
        const userId = (req as Request & { user?: { id?: string } }).user?.id;
        return userId ? `user:${userId}` : `ip:${req.ip}`;

      case 'tenant':
        const tenantId = (req as Request & { tenantContext?: { tenantId?: string } }).tenantContext?.tenantId;
        return tenantId ? `tenant:${tenantId}` : `ip:${req.ip}`;

      case 'api-key':
        const apiKey = req.headers['x-api-key'] || req.query.api_key;
        return apiKey ? `apikey:${apiKey}` : `ip:${req.ip}`;

      case 'custom':
        if (this.customKeyGenerator) {
          return this.customKeyGenerator(req);
        }
        return `ip:${req.ip}`;

      default:
        return `ip:${req.ip}`;
    }
  }

  /**
   * Check rate limit
   */
  async check(key: string): Promise<RateLimitResult> {
    const entry = await this.store.increment(key, this.config.windowMs);
    const now = Date.now();

    const allowed = entry.count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    const retryAfter = allowed ? 0 : Math.ceil((entry.resetAt - now) / 1000);

    return {
      allowed,
      remaining,
      resetAt: entry.resetAt,
      retryAfter,
      limit: this.config.maxRequests,
    };
  }

  /**
   * Express middleware
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const key = this.generateKey(req);
      const result = await this.check(key);

      // Set rate limit headers
      if (this.config.headers) {
        res.setHeader('X-RateLimit-Limit', result.limit);
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetAt / 1000));
      }

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter);
        res.status(429).json({
          error: this.config.message,
          retryAfter: result.retryAfter,
        });
        return;
      }

      next();
    };
  }

  /**
   * Reset rate limit for a key
   */
  async reset(key: string): Promise<void> {
    await this.store.reset(key);
  }
}

/**
 * Sliding window rate limiter (more accurate but more complex)
 */
export class SlidingWindowRateLimiter {
  private config: RateLimitConfig;
  private windows = new Map<string, number[]>();

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = RateLimitConfigSchema.parse(config);
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get or create window
    let timestamps = this.windows.get(key) || [];

    // Remove expired timestamps
    timestamps = timestamps.filter(t => t > windowStart);

    // Add current request
    timestamps.push(now);
    this.windows.set(key, timestamps);

    const count = timestamps.length;
    const allowed = count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - count);

    // Calculate when the oldest request will expire
    const oldestInWindow = timestamps[0] || now;
    const resetAt = oldestInWindow + this.config.windowMs;
    const retryAfter = allowed ? 0 : Math.ceil((resetAt - now) / 1000);

    return {
      allowed,
      remaining,
      resetAt,
      retryAfter,
      limit: this.config.maxRequests,
    };
  }
}

/**
 * Token bucket rate limiter (for burst handling)
 */
export class TokenBucketRateLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>();
  private maxTokens: number;
  private refillRate: number; // tokens per second
  private refillInterval: number;

  constructor(options: {
    maxTokens?: number;
    refillRate?: number;
    refillInterval?: number;
  } = {}) {
    this.maxTokens = options.maxTokens ?? 100;
    this.refillRate = options.refillRate ?? 10;
    this.refillInterval = options.refillInterval ?? 1000;
  }

  async check(key: string, cost = 1): Promise<RateLimitResult> {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: now };
      this.buckets.set(key, bucket);
    }

    // Refill tokens
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval) * this.refillRate;

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    // Check if we have enough tokens
    const allowed = bucket.tokens >= cost;

    if (allowed) {
      bucket.tokens -= cost;
    }

    const remaining = bucket.tokens;
    const timeUntilNextToken = this.refillInterval / this.refillRate;
    const retryAfter = allowed ? 0 : Math.ceil((cost - bucket.tokens) * timeUntilNextToken / 1000);

    return {
      allowed,
      remaining,
      resetAt: now + (this.maxTokens - remaining) * timeUntilNextToken,
      retryAfter,
      limit: this.maxTokens,
    };
  }
}

/**
 * tRPC rate limit middleware
 */
export const createTRPCRateLimitMiddleware = (limiter: RateLimiter) => {
  return async (opts: {
    ctx: { req?: Request };
    next: () => Promise<unknown>;
  }) => {
    const req = opts.ctx.req;
    if (!req) {
      return opts.next();
    }

    const key = req.ip || 'unknown';
    const result = await limiter.check(key);

    if (!result.allowed) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
      });
    }

    return opts.next();
  };
};

/**
 * Create rate limiter with default config
 */
export const createRateLimiter = (config?: Partial<RateLimitConfig>): RateLimiter => {
  return new RateLimiter(config);
};
