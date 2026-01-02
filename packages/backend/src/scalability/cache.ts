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

export type CacheConfig = z.infer<typeof CacheConfigSchema>;

// Cache entry schema
export const CacheEntrySchema = z.object({
  key: z.string(),
  value: z.unknown(),
  ttl: z.number().int().min(0).optional(),
  createdAt: z.number(),
  expiresAt: z.number().optional(),
  tags: z.array(z.string()).default([]),
});

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

  // Batch operations
  mget<T>(keys: string[]): Promise<Map<string, T | null>>;
  mset<T>(entries: Map<string, T>, ttl?: number): Promise<void>;
  mdel(keys: string[]): Promise<number>;

  // Tag-based invalidation
  setWithTags<T>(key: string, value: T, tags: string[], ttl?: number): Promise<void>;
  invalidateByTag(tag: string): Promise<number>;
}

/**
 * In-memory cache backend (for development/testing)
 */
export class MemoryCacheBackend implements CacheBackend {
  private store = new Map<string, CacheEntry>();
  private tagIndex = new Map<string, Set<string>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = CacheConfigSchema.parse(config);
  }

  async get<T>(key: string): Promise<T | null> {
    const prefixedKey = this.prefixKey(key);
    const entry = this.store.get(prefixedKey);

    if (!entry) return null;

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(prefixedKey);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const prefixedKey = this.prefixKey(key);
    const effectiveTTL = ttl ?? this.config.defaultTTL;
    const now = Date.now();

    // Check max size
    if (this.store.size >= this.config.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry = {
      key: prefixedKey,
      value,
      ttl: effectiveTTL,
      createdAt: now,
      expiresAt: effectiveTTL > 0 ? now + effectiveTTL * 1000 : undefined,
      tags: [],
    };

    this.store.set(prefixedKey, entry);
  }

  async delete(key: string): Promise<boolean> {
    const prefixedKey = this.prefixKey(key);
    return this.store.delete(prefixedKey);
  }

  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async clear(): Promise<void> {
    this.store.clear();
    this.tagIndex.clear();
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.store.keys());

    if (!pattern) {
      return allKeys.map(k => this.unprefixKey(k));
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return allKeys
      .filter(k => regex.test(k))
      .map(k => this.unprefixKey(k));
  }

  async mget<T>(keys: string[]): Promise<Map<string, T | null>> {
    const result = new Map<string, T | null>();
    for (const key of keys) {
      result.set(key, await this.get<T>(key));
    }
    return result;
  }

  async mset<T>(entries: Map<string, T>, ttl?: number): Promise<void> {
    for (const [key, value] of entries) {
      await this.set(key, value, ttl);
    }
  }

  async mdel(keys: string[]): Promise<number> {
    let deleted = 0;
    for (const key of keys) {
      if (await this.delete(key)) {
        deleted++;
      }
    }
    return deleted;
  }

  async setWithTags<T>(key: string, value: T, tags: string[], ttl?: number): Promise<void> {
    const prefixedKey = this.prefixKey(key);
    await this.set(key, value, ttl);

    // Update tag index
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(prefixedKey);
    }

    // Update entry with tags
    const entry = this.store.get(prefixedKey);
    if (entry) {
      entry.tags = tags;
    }
  }

  async invalidateByTag(tag: string): Promise<number> {
    const keys = this.tagIndex.get(tag);
    if (!keys) return 0;

    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) {
        count++;
      }
    }

    this.tagIndex.delete(tag);
    return count;
  }

  private prefixKey(key: string): string {
    return `${this.config.keyPrefix}${key}`;
  }

  private unprefixKey(key: string): string {
    return key.slice(this.config.keyPrefix.length);
  }

  private evictOldest(): void {
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
  private backend: CacheBackend;
  private tenantId: string;

  constructor(backend: CacheBackend, tenantId: string) {
    this.backend = backend;
    this.tenantId = tenantId;
  }

  private tenantKey(key: string): string {
    return `tenant:${this.tenantId}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.backend.get<T>(this.tenantKey(key));
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.backend.set(this.tenantKey(key), value, ttl);
  }

  async delete(key: string): Promise<boolean> {
    return this.backend.delete(this.tenantKey(key));
  }

  async invalidateTenant(): Promise<number> {
    const keys = await this.backend.keys(`tenant:${this.tenantId}:*`);
    return this.backend.mdel(keys);
  }
}

/**
 * Cache decorator for functions
 */
export const cached = <T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: {
    key: (...args: Parameters<T>) => string;
    ttl?: number;
    cache: CacheBackend;
    tags?: (...args: Parameters<T>) => string[];
  }
): T => {
  return (async (...args: Parameters<T>) => {
    const cacheKey = options.key(...args);
    const cachedValue = await options.cache.get(cacheKey);

    if (cachedValue !== null) {
      return cachedValue;
    }

    const result = await fn(...args);

    if (options.tags) {
      await options.cache.setWithTags(cacheKey, result, options.tags(...args), options.ttl);
    } else {
      await options.cache.set(cacheKey, result, options.ttl);
    }

    return result;
  }) as T;
};

/**
 * Create cache instance
 */
export const createCache = (config?: Partial<CacheConfig>): CacheBackend => {
  return new MemoryCacheBackend(config);
};
