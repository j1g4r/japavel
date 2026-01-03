import { z } from 'zod';
/**
 * Caching Layer
 * Provides a unified caching interface with multiple backend support
 */
export declare const CacheConfigSchema: z.ZodObject<{
    defaultTTL: z.ZodDefault<z.ZodNumber>;
    maxSize: z.ZodDefault<z.ZodNumber>;
    keyPrefix: z.ZodDefault<z.ZodString>;
    serializer: z.ZodDefault<z.ZodEnum<["json", "msgpack"]>>;
}, "strip", z.ZodTypeAny, {
    keyPrefix: string;
    maxSize: number;
    defaultTTL: number;
    serializer: "json" | "msgpack";
}, {
    keyPrefix?: string | undefined;
    maxSize?: number | undefined;
    defaultTTL?: number | undefined;
    serializer?: "json" | "msgpack" | undefined;
}>;
export type CacheConfig = z.infer<typeof CacheConfigSchema>;
export declare const CacheEntrySchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodUnknown;
    ttl: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodNumber;
    expiresAt: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    createdAt: number;
    key: string;
    tags: string[];
    expiresAt?: number | undefined;
    value?: unknown;
    ttl?: number | undefined;
}, {
    createdAt: number;
    key: string;
    expiresAt?: number | undefined;
    value?: unknown;
    tags?: string[] | undefined;
    ttl?: number | undefined;
}>;
export type CacheEntry = z.infer<typeof CacheEntrySchema>;
/**
 * Cache backend interface
 */
export interface CacheBackend {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    clear(): Promise<void>;
    keys(pattern?: string): Promise<string[]>;
    mget<T>(keys: string[]): Promise<Map<string, T | null>>;
    mset<T>(entries: Map<string, T>, ttl?: number): Promise<void>;
    mdel(keys: string[]): Promise<number>;
    setWithTags<T>(key: string, value: T, tags: string[], ttl?: number): Promise<void>;
    invalidateByTag(tag: string): Promise<number>;
}
/**
 * In-memory cache backend (for development/testing)
 */
export declare class MemoryCacheBackend implements CacheBackend {
    private store;
    private tagIndex;
    private config;
    constructor(config?: Partial<CacheConfig>);
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    clear(): Promise<void>;
    keys(pattern?: string): Promise<string[]>;
    mget<T>(keys: string[]): Promise<Map<string, T | null>>;
    mset<T>(entries: Map<string, T>, ttl?: number): Promise<void>;
    mdel(keys: string[]): Promise<number>;
    setWithTags<T>(key: string, value: T, tags: string[], ttl?: number): Promise<void>;
    invalidateByTag(tag: string): Promise<number>;
    private prefixKey;
    private unprefixKey;
    private evictOldest;
}
/**
 * Cache manager with tenant isolation
 */
export declare class TenantAwareCache {
    private backend;
    private tenantId;
    constructor(backend: CacheBackend, tenantId: string);
    private tenantKey;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<boolean>;
    invalidateTenant(): Promise<number>;
}
/**
 * Cache decorator for functions
 */
export declare const cached: <T extends (...args: unknown[]) => Promise<unknown>>(fn: T, options: {
    key: (...args: Parameters<T>) => string;
    ttl?: number;
    cache: CacheBackend;
    tags?: (...args: Parameters<T>) => string[];
}) => T;
/**
 * Create cache instance
 */
export declare const createCache: (config?: Partial<CacheConfig>) => CacheBackend;
//# sourceMappingURL=cache.d.ts.map