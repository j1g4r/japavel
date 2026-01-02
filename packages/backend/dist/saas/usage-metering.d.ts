import { z } from 'zod';
/**
 * Usage Metering System
 * Tracks and enforces usage limits for tenants
 */
export declare const MetricTypeSchema: z.ZodEnum<["count", "sum", "gauge", "unique"]>;
export type MetricType = z.infer<typeof MetricTypeSchema>;
export declare const MetricPeriodSchema: z.ZodEnum<["minute", "hour", "day", "week", "month", "year", "all_time"]>;
export type MetricPeriod = z.infer<typeof MetricPeriodSchema>;
export declare const UsageMetricSchema: z.ZodObject<{
    name: z.ZodString;
    displayName: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["count", "sum", "gauge", "unique"]>;
    unit: z.ZodOptional<z.ZodString>;
    periods: z.ZodDefault<z.ZodArray<z.ZodEnum<["minute", "hour", "day", "week", "month", "year", "all_time"]>, "many">>;
    aggregation: z.ZodDefault<z.ZodEnum<["sum", "max", "last"]>>;
}, "strip", z.ZodTypeAny, {
    type: "count" | "sum" | "gauge" | "unique";
    name: string;
    displayName: string;
    periods: ("minute" | "hour" | "day" | "week" | "month" | "year" | "all_time")[];
    aggregation: "sum" | "max" | "last";
    description?: string | undefined;
    unit?: string | undefined;
}, {
    type: "count" | "sum" | "gauge" | "unique";
    name: string;
    displayName: string;
    description?: string | undefined;
    unit?: string | undefined;
    periods?: ("minute" | "hour" | "day" | "week" | "month" | "year" | "all_time")[] | undefined;
    aggregation?: "sum" | "max" | "last" | undefined;
}>;
export type UsageMetric = z.infer<typeof UsageMetricSchema>;
export interface UsageRecord {
    tenantId: string;
    metric: string;
    value: number;
    timestamp: Date;
    dimensions?: Record<string, string>;
    metadata?: Record<string, unknown>;
}
export interface UsageLimit {
    metric: string;
    limit: number;
    period: MetricPeriod;
    action: 'warn' | 'block' | 'throttle';
    warningThreshold?: number;
}
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
export declare class UsageMeteringService {
    private metrics;
    private limits;
    private records;
    private aggregates;
    /**
     * Register a usage metric
     */
    registerMetric(metric: UsageMetric): void;
    /**
     * Register multiple metrics
     */
    registerMetrics(metrics: UsageMetric[]): void;
    /**
     * Set usage limit for a tenant
     */
    setLimit(tenantId: string, limit: UsageLimit): void;
    /**
     * Set limits from plan configuration
     */
    setLimitsFromPlan(tenantId: string, planLimits: Record<string, number>): void;
    /**
     * Record usage
     */
    record(record: UsageRecord): Promise<void>;
    /**
     * Record usage for current tenant
     */
    recordForCurrentTenant(metricName: string, value: number, dimensions?: Record<string, string>): Promise<void>;
    /**
     * Increment a counter metric
     */
    increment(tenantId: string, metric: string, amount?: number): Promise<void>;
    /**
     * Get current usage for a tenant
     */
    getUsage(tenantId: string, metric: string, period?: MetricPeriod): number;
    /**
     * Get usage summary for a tenant
     */
    getUsageSummary(tenantId: string, metric: string, period?: MetricPeriod): UsageSummary;
    /**
     * Get all usage summaries for a tenant
     */
    getAllUsageSummaries(tenantId: string): UsageSummary[];
    /**
     * Check if usage is within limits
     */
    checkLimit(tenantId: string, metric: string, additionalUsage?: number): Promise<{
        allowed: boolean;
        current: number;
        limit: number;
        action?: string;
        message?: string;
    }>;
    /**
     * Enforce usage limit (throws if exceeded)
     */
    enforceLimit(tenantId: string, metric: string, additionalUsage?: number): Promise<void>;
    /**
     * Reset usage for a period (e.g., at billing cycle)
     */
    resetUsage(tenantId: string, metric: string, period: MetricPeriod): void;
    /**
     * Get usage history
     */
    getHistory(tenantId: string, metric: string, options?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): UsageRecord[];
    private getAggregateKey;
    private getPeriodKey;
    private getPeriodBounds;
    private incrementAggregate;
    private setAggregate;
}
/**
 * Usage limit exceeded error
 */
export declare class UsageLimitExceededError extends Error {
    metric: string;
    current: number;
    limit: number;
    constructor(message: string, metric: string, current: number, limit: number);
}
export declare const usageMetering: UsageMeteringService;
/**
 * Create usage metering service
 */
export declare const createUsageMeteringService: () => UsageMeteringService;
export declare const commonMetrics: UsageMetric[];
//# sourceMappingURL=usage-metering.d.ts.map