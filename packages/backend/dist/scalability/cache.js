import { z } from 'zod';
/**
 * Caching Layer
 * Provides a unified caching interface with multiple backend support
 */
// Cache configuration schema
export const CacheConfigSchema = z.object({
    defaultTTL: z.number().int().min(0).default(3600), // 1 hour
    maxSize: z.number().int().min(0).default(10000),
    keyPrefix: z.string().default('japavel:'),
    serializer: z.enum(['json', 'msgpack']).default('json'),
});
// Cache entry schema
export const CacheEntrySchema = z.object({
    key: z.string(),
    value: z.unknown(),
    ttl: z.number().int().min(0).optional(),
    createdAt: z.number(),
    expiresAt: z.number().optional(),
    tags: z.array(z.string()).default([]),
});
/**
 * In-memory cache backend (for development/testing)
 */
export class MemoryCacheBackend {
    store = new Map();
    tagIndex = new Map();
    config;
    constructor(config = {}) {
        this.config = CacheConfigSchema.parse(config);
    }
    async get(key) {
        const prefixedKey = this.prefixKey(key);
        const entry = this.store.get(prefixedKey);
        if (!entry)
            return null;
        // Check expiration
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.store.delete(prefixedKey);
            return null;
        }
        return entry.value;
    }
    async set(key, value, ttl) {
        const prefixedKey = this.prefixKey(key);
        const effectiveTTL = ttl ?? this.config.defaultTTL;
        const now = Date.now();
        // Check max size
        if (this.store.size >= this.config.maxSize) {
            this.evictOldest();
        }
        const entry = {
            key: prefixedKey,
            value,
            ttl: effectiveTTL,
            createdAt: now,
            expiresAt: effectiveTTL > 0 ? now + effectiveTTL * 1000 : undefined,
            tags: [],
        };
        this.store.set(prefixedKey, entry);
    }
    async delete(key) {
        const prefixedKey = this.prefixKey(key);
        return this.store.delete(prefixedKey);
    }
    async exists(key) {
        const value = await this.get(key);
        return value !== null;
    }
    async clear() {
        this.store.clear();
        this.tagIndex.clear();
    }
    async keys(pattern) {
        const allKeys = Array.from(this.store.keys());
        if (!pattern) {
            return allKeys.map(k => this.unprefixKey(k));
        }
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return allKeys
            .filter(k => regex.test(k))
            .map(k => this.unprefixKey(k));
    }
    async mget(keys) {
        const result = new Map();
        for (const key of keys) {
            result.set(key, await this.get(key));
        }
        return result;
    }
    async mset(entries, ttl) {
        for (const [key, value] of entries) {
            await this.set(key, value, ttl);
        }
    }
    async mdel(keys) {
        let deleted = 0;
        for (const key of keys) {
            if (await this.delete(key)) {
                deleted++;
            }
        }
        return deleted;
    }
    async setWithTags(key, value, tags, ttl) {
        const prefixedKey = this.prefixKey(key);
        await this.set(key, value, ttl);
        // Update tag index
        for (const tag of tags) {
            if (!this.tagIndex.has(tag)) {
                this.tagIndex.set(tag, new Set());
            }
            this.tagIndex.get(tag).add(prefixedKey);
        }
        // Update entry with tags
        const entry = this.store.get(prefixedKey);
        if (entry) {
            entry.tags = tags;
        }
    }
    async invalidateByTag(tag) {
        const keys = this.tagIndex.get(tag);
        if (!keys)
            return 0;
        let count = 0;
        for (const key of keys) {
            if (this.store.delete(key)) {
                count++;
            }
        }
        this.tagIndex.delete(tag);
        return count;
    }
    prefixKey(key) {
        return `${this.config.keyPrefix}${key}`;
    }
    unprefixKey(key) {
        return key.slice(this.config.keyPrefix.length);
    }
    evictOldest() {
        // Simple LRU-like eviction: remove oldest entry
        const oldest = this.store.entries().next().value;
        if (oldest) {
            this.store.delete(oldest[0]);
        }
    }
}
/**
 * Cache manager with tenant isolation
 */
export class TenantAwareCache {
    backend;
    tenantId;
    constructor(backend, tenantId) {
        this.backend = backend;
        this.tenantId = tenantId;
    }
    tenantKey(key) {
        return `tenant:${this.tenantId}:${key}`;
    }
    async get(key) {
        return this.backend.get(this.tenantKey(key));
    }
    async set(key, value, ttl) {
        return this.backend.set(this.tenantKey(key), value, ttl);
    }
    async delete(key) {
        return this.backend.delete(this.tenantKey(key));
    }
    async invalidateTenant() {
        const keys = await this.backend.keys(`tenant:${this.tenantId}:*`);
        return this.backend.mdel(keys);
    }
}
/**
 * Cache decorator for functions
 */
export const cached = (fn, options) => {
    return (async (...args) => {
        const cacheKey = options.key(...args);
        const cachedValue = await options.cache.get(cacheKey);
        if (cachedValue !== null) {
            return cachedValue;
        }
        const result = await fn(...args);
        if (options.tags) {
            await options.cache.setWithTags(cacheKey, result, options.tags(...args), options.ttl);
        }
        else {
            await options.cache.set(cacheKey, result, options.ttl);
        }
        return result;
    });
};
/**
 * Create cache instance
 */
export const createCache = (config) => {
    return new MemoryCacheBackend(config);
};
