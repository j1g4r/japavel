import { z } from 'zod';
import { getCurrentTenantId } from '../tenancy/context';

/**
 * Usage Metering System
 * Tracks and enforces usage limits for tenants
 */

// Metric type
export const MetricTypeSchema = z.enum([
  'count',      // Simple count (API calls, users, etc.)
  'sum',        // Sum of values (storage, bandwidth)
  'gauge',      // Point-in-time value (active connections)
  'unique',     // Count unique values (unique visitors)
]);

export type MetricType = z.infer<typeof MetricTypeSchema>;

// Metric period
export const MetricPeriodSchema = z.enum([
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
  'all_time',
]);

export type MetricPeriod = z.infer<typeof MetricPeriodSchema>;

// Usage metric definition
export const UsageMetricSchema = z.object({
  name: z.string().regex(/^[a-z][a-z0-9_]*$/),
  displayName: z.string(),
  description: z.string().optional(),
  type: MetricTypeSchema,
  unit: z.string().optional(), // e.g., 'bytes', 'requests', 'users'
  periods: z.array(MetricPeriodSchema).default(['month']),
  aggregation: z.enum(['sum', 'max', 'last']).default('sum'),
});

export type UsageMetric = z.infer<typeof UsageMetricSchema>;

// Usage record
export interface UsageRecord {
  tenantId: string;
  metric: string;
  value: number;
  timestamp: Date;
  dimensions?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

// Usage limit definition
export interface UsageLimit {
  metric: string;
  limit: number;
  period: MetricPeriod;
  action: 'warn' | 'block' | 'throttle';
  warningThreshold?: number; // Percentage at which to warn (e.g., 80)
}

// Usage summary
export interface UsageSummary {
  metric: string;
  current: number;
  limit: number;
  percentage: number;
  period: MetricPeriod;
  periodStart: Date;
  periodEnd: Date;
  remaining: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
}

/**
 * Usage Metering Service
 */
export class UsageMeteringService {
  private metrics = new Map<string, UsageMetric>();
  private limits = new Map<string, Map<string, UsageLimit>>(); // tenantId -> metric -> limit
  private records: UsageRecord[] = [];
  private aggregates = new Map<string, number>(); // key -> value

  /**
   * Register a usage metric
   */
  registerMetric(metric: UsageMetric): void {
    this.metrics.set(metric.name, UsageMetricSchema.parse(metric));
  }

  /**
   * Register multiple metrics
   */
  registerMetrics(metrics: UsageMetric[]): void {
    for (const metric of metrics) {
      this.registerMetric(metric);
    }
  }

  /**
   * Set usage limit for a tenant
   */
  setLimit(tenantId: string, limit: UsageLimit): void {
    if (!this.limits.has(tenantId)) {
      this.limits.set(tenantId, new Map());
    }
    this.limits.get(tenantId)!.set(limit.metric, limit);
  }

  /**
   * Set limits from plan configuration
   */
  setLimitsFromPlan(tenantId: string, planLimits: Record<string, number>): void {
    for (const [metric, limit] of Object.entries(planLimits)) {
      if (limit < 0) continue; // -1 = unlimited

      this.setLimit(tenantId, {
        metric,
        limit,
        period: 'month',
        action: 'block',
        warningThreshold: 80,
      });
    }
  }

  /**
   * Record usage
   */
  async record(record: UsageRecord): Promise<void> {
    const metric = this.metrics.get(record.metric);
    if (!metric) {
      throw new Error(`Unknown metric: ${record.metric}`);
    }

    // Store record
    this.records.push(record);

    // Update aggregates based on metric type
    for (const period of metric.periods) {
      const key = this.getAggregateKey(
        record.tenantId,
        record.metric,
        period,
        record.timestamp
      );

      switch (metric.type) {
        case 'count':
          this.incrementAggregate(key, 1);
          break;
        case 'sum':
          this.incrementAggregate(key, record.value);
          break;
        case 'gauge':
          this.setAggregate(key, record.value);
          break;
        case 'unique':
          // For unique, we'd need a different data structure (HyperLogLog in production)
          this.incrementAggregate(key, 1);
          break;
      }
    }
  }

  /**
   * Record usage for current tenant
   */
  async recordForCurrentTenant(
    metricName: string,
    value: number,
    dimensions?: Record<string, string>
  ): Promise<void> {
    const tenantId = getCurrentTenantId();
    if (!tenantId) {
      throw new Error('No tenant context');
    }

    await this.record({
      tenantId,
      metric: metricName,
      value,
      timestamp: new Date(),
      dimensions,
    });
  }

  /**
   * Increment a counter metric
   */
  async increment(tenantId: string, metric: string, amount = 1): Promise<void> {
    await this.record({
      tenantId,
      metric,
      value: amount,
      timestamp: new Date(),
    });
  }

  /**
   * Get current usage for a tenant
   */
  getUsage(
    tenantId: string,
    metric: string,
    period: MetricPeriod = 'month'
  ): number {
    const key = this.getAggregateKey(tenantId, metric, period, new Date());
    return this.aggregates.get(key) || 0;
  }

  /**
   * Get usage summary for a tenant
   */
  getUsageSummary(
    tenantId: string,
    metric: string,
    period: MetricPeriod = 'month'
  ): UsageSummary {
    const current = this.getUsage(tenantId, metric, period);
    const limit = this.limits.get(tenantId)?.get(metric);
    const limitValue = limit?.limit ?? Infinity;
    const { start, end } = this.getPeriodBounds(period, new Date());

    const percentage = limitValue === Infinity ? 0 : (current / limitValue) * 100;
    const warningThreshold = limit?.warningThreshold ?? 80;

    return {
      metric,
      current,
      limit: limitValue,
      percentage,
      period,
      periodStart: start,
      periodEnd: end,
      remaining: Math.max(0, limitValue - current),
      isOverLimit: current >= limitValue,
      isNearLimit: percentage >= warningThreshold && percentage < 100,
    };
  }

  /**
   * Get all usage summaries for a tenant
   */
  getAllUsageSummaries(tenantId: string): UsageSummary[] {
    const tenantLimits = this.limits.get(tenantId);
    if (!tenantLimits) return [];

    return Array.from(tenantLimits.keys()).map(metric => {
      const limit = tenantLimits.get(metric)!;
      return this.getUsageSummary(tenantId, metric, limit.period);
    });
  }

  /**
   * Check if usage is within limits
   */
  async checkLimit(
    tenantId: string,
    metric: string,
    additionalUsage = 0
  ): Promise<{
    allowed: boolean;
    current: number;
    limit: number;
    action?: string;
    message?: string;
  }> {
    const limit = this.limits.get(tenantId)?.get(metric);

    if (!limit) {
      return { allowed: true, current: 0, limit: Infinity };
    }

    const current = this.getUsage(tenantId, metric, limit.period);
    const projected = current + additionalUsage;

    if (projected > limit.limit) {
      return {
        allowed: limit.action !== 'block',
        current,
        limit: limit.limit,
        action: limit.action,
        message: `Usage limit exceeded for ${metric}. Current: ${current}, Limit: ${limit.limit}`,
      };
    }

    return {
      allowed: true,
      current,
      limit: limit.limit,
    };
  }

  /**
   * Enforce usage limit (throws if exceeded)
   */
  async enforceLimit(tenantId: string, metric: string, additionalUsage = 0): Promise<void> {
    const result = await this.checkLimit(tenantId, metric, additionalUsage);

    if (!result.allowed) {
      throw new UsageLimitExceededError(
        result.message || `Usage limit exceeded for ${metric}`,
        metric,
        result.current,
        result.limit
      );
    }
  }

  /**
   * Reset usage for a period (e.g., at billing cycle)
   */
  resetUsage(tenantId: string, metric: string, period: MetricPeriod): void {
    const key = this.getAggregateKey(tenantId, metric, period, new Date());
    this.aggregates.delete(key);
  }

  /**
   * Get usage history
   */
  getHistory(
    tenantId: string,
    metric: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): UsageRecord[] {
    let records = this.records.filter(
      r => r.tenantId === tenantId && r.metric === metric
    );

    if (options?.startDate) {
      records = records.filter(r => r.timestamp >= options.startDate!);
    }

    if (options?.endDate) {
      records = records.filter(r => r.timestamp <= options.endDate!);
    }

    if (options?.limit) {
      records = records.slice(-options.limit);
    }

    return records;
  }

  // Private helper methods

  private getAggregateKey(
    tenantId: string,
    metric: string,
    period: MetricPeriod,
    date: Date
  ): string {
    const periodKey = this.getPeriodKey(period, date);
    return `${tenantId}:${metric}:${period}:${periodKey}`;
  }

  private getPeriodKey(period: MetricPeriod, date: Date): string {
    const d = new Date(date);

    switch (period) {
      case 'minute':
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
      case 'hour':
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
      case 'day':
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      case 'week':
        const week = Math.ceil(d.getDate() / 7);
        return `${d.getFullYear()}-${d.getMonth()}-${week}`;
      case 'month':
        return `${d.getFullYear()}-${d.getMonth()}`;
      case 'year':
        return `${d.getFullYear()}`;
      case 'all_time':
        return 'all';
      default:
        return 'all';
    }
  }

  private getPeriodBounds(period: MetricPeriod, date: Date): { start: Date; end: Date } {
    const d = new Date(date);
    let start: Date;
    let end: Date;

    switch (period) {
      case 'minute':
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
        end = new Date(start.getTime() + 60000);
        break;
      case 'hour':
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
        end = new Date(start.getTime() + 3600000);
        break;
      case 'day':
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        end = new Date(start.getTime() + 86400000);
        break;
      case 'week':
        const dayOfWeek = d.getDay();
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dayOfWeek);
        end = new Date(start.getTime() + 7 * 86400000);
        break;
      case 'month':
        start = new Date(d.getFullYear(), d.getMonth(), 1);
        end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        break;
      case 'year':
        start = new Date(d.getFullYear(), 0, 1);
        end = new Date(d.getFullYear() + 1, 0, 1);
        break;
      default:
        start = new Date(0);
        end = new Date();
    }

    return { start, end };
  }

  private incrementAggregate(key: string, value: number): void {
    const current = this.aggregates.get(key) || 0;
    this.aggregates.set(key, current + value);
  }

  private setAggregate(key: string, value: number): void {
    this.aggregates.set(key, value);
  }
}

/**
 * Usage limit exceeded error
 */
export class UsageLimitExceededError extends Error {
  constructor(
    message: string,
    public metric: string,
    public current: number,
    public limit: number
  ) {
    super(message);
    this.name = 'UsageLimitExceededError';
  }
}

// Global usage metering service instance
export const usageMetering = new UsageMeteringService();

/**
 * Create usage metering service
 */
export const createUsageMeteringService = (): UsageMeteringService => {
  return new UsageMeteringService();
};

// Common metrics
export const commonMetrics: UsageMetric[] = [
  {
    name: 'api_requests',
    displayName: 'API Requests',
    description: 'Number of API requests made',
    type: 'count',
    unit: 'requests',
    periods: ['hour', 'day', 'month'],
    aggregation: 'sum',
  },
  {
    name: 'storage_bytes',
    displayName: 'Storage Used',
    description: 'Total storage used in bytes',
    type: 'sum',
    unit: 'bytes',
    periods: ['day', 'month'],
    aggregation: 'last',
  },
  {
    name: 'active_users',
    displayName: 'Active Users',
    description: 'Number of active users',
    type: 'gauge',
    unit: 'users',
    periods: ['day', 'month'],
    aggregation: 'max',
  },
  {
    name: 'bandwidth_bytes',
    displayName: 'Bandwidth Used',
    description: 'Total bandwidth used in bytes',
    type: 'sum',
    unit: 'bytes',
    periods: ['day', 'month'],
    aggregation: 'sum',
  },
];
