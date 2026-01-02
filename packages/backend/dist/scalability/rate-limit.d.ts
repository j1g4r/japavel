import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
/**
 * Rate Limiting System
 * Provides flexible rate limiting with multiple strategies
 */
export declare const RateLimitConfigSchema: z.ZodObject<{
    windowMs: z.ZodDefault<z.ZodNumber>;
    maxRequests: z.ZodDefault<z.ZodNumber>;
    keyGenerator: z.ZodDefault<z.ZodEnum<["ip", "user", "tenant", "api-key", "custom"]>>;
    skipFailedRequests: z.ZodDefault<z.ZodBoolean>;
    skipSuccessfulRequests: z.ZodDefault<z.ZodBoolean>;
    headers: z.ZodDefault<z.ZodBoolean>;
    message: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    windowMs: number;
    skipFailedRequests: boolean;
    skipSuccessfulRequests: boolean;
    keyGenerator: "ip" | "user" | "custom" | "tenant" | "api-key";
    headers: boolean;
    maxRequests: number;
}, {
    message?: string | undefined;
    windowMs?: number | undefined;
    skipFailedRequests?: boolean | undefined;
    skipSuccessfulRequests?: boolean | undefined;
    keyGenerator?: "ip" | "user" | "custom" | "tenant" | "api-key" | undefined;
    headers?: boolean | undefined;
    maxRequests?: number | undefined;
}>;
export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;
export interface RateLimitEntry {
    count: number;
    resetAt: number;
    firstRequest: number;
}
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
export declare class MemoryRateLimitStore implements RateLimitStore {
    private store;
    get(key: string): Promise<RateLimitEntry | null>;
    set(key: string, entry: RateLimitEntry): Promise<void>;
    increment(key: string, windowMs: number): Promise<RateLimitEntry>;
    reset(key: string): Promise<void>;
    cleanup(): void;
}
/**
 * Rate limiter class
 */
export declare class RateLimiter {
    private config;
    private store;
    private customKeyGenerator?;
    constructor(config?: Partial<RateLimitConfig>, store?: RateLimitStore, customKeyGenerator?: (req: Request) => string);
    /**
     * Generate key for rate limiting
     */
    private generateKey;
    /**
     * Check rate limit
     */
    check(key: string): Promise<RateLimitResult>;
    /**
     * Express middleware
     */
    middleware(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Reset rate limit for a key
     */
    reset(key: string): Promise<void>;
}
/**
 * Sliding window rate limiter (more accurate but more complex)
 */
export declare class SlidingWindowRateLimiter {
    private config;
    private windows;
    constructor(config?: Partial<RateLimitConfig>);
    check(key: string): Promise<RateLimitResult>;
}
/**
 * Token bucket rate limiter (for burst handling)
 */
export declare class TokenBucketRateLimiter {
    private buckets;
    private maxTokens;
    private refillRate;
    private refillInterval;
    constructor(options?: {
        maxTokens?: number;
        refillRate?: number;
        refillInterval?: number;
    });
    check(key: string, cost?: number): Promise<RateLimitResult>;
}
/**
 * tRPC rate limit middleware
 */
export declare const createTRPCRateLimitMiddleware: (limiter: RateLimiter) => (opts: {
    ctx: {
        req?: Request;
    };
    next: () => Promise<unknown>;
}) => Promise<unknown>;
/**
 * Create rate limiter with default config
 */
export declare const createRateLimiter: (config?: Partial<RateLimitConfig>) => RateLimiter;
//# sourceMappingURL=rate-limit.d.ts.map