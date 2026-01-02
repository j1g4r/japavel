import { z } from 'zod';
/**
 * Feature Flags System
 * Provides flexible feature flag management for gradual rollouts and A/B testing
 */
export declare const FeatureFlagTypeSchema: z.ZodEnum<["boolean", "percentage", "variant", "allowlist", "schedule"]>;
export type FeatureFlagType = z.infer<typeof FeatureFlagTypeSchema>;
export declare const FeatureFlagStatusSchema: z.ZodEnum<["active", "inactive", "archived"]>;
export type FeatureFlagStatus = z.infer<typeof FeatureFlagStatusSchema>;
export declare const VariantSchema: z.ZodObject<{
    name: z.ZodString;
    weight: z.ZodNumber;
    payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    weight: number;
    payload?: Record<string, unknown> | undefined;
}, {
    name: string;
    weight: number;
    payload?: Record<string, unknown> | undefined;
}>;
export type Variant = z.infer<typeof VariantSchema>;
export declare const TargetingRuleSchema: z.ZodObject<{
    attribute: z.ZodString;
    operator: z.ZodEnum<["equals", "not_equals", "contains", "not_contains", "starts_with", "ends_with", "greater_than", "less_than", "in_list", "not_in_list", "regex"]>;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>;
}, "strip", z.ZodTypeAny, {
    value: string | number | boolean | string[];
    attribute: string;
    operator: "equals" | "not_equals" | "contains" | "not_contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "in_list" | "not_in_list" | "regex";
}, {
    value: string | number | boolean | string[];
    attribute: string;
    operator: "equals" | "not_equals" | "contains" | "not_contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "in_list" | "not_in_list" | "regex";
}>;
export type TargetingRule = z.infer<typeof TargetingRuleSchema>;
export declare const FeatureFlagSchema: z.ZodObject<{
    id: z.ZodString;
    key: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["boolean", "percentage", "variant", "allowlist", "schedule"]>;
    status: z.ZodDefault<z.ZodEnum<["active", "inactive", "archived"]>>;
    defaultValue: z.ZodDefault<z.ZodBoolean>;
    percentage: z.ZodOptional<z.ZodNumber>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        weight: z.ZodNumber;
        payload: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        weight: number;
        payload?: Record<string, unknown> | undefined;
    }, {
        name: string;
        weight: number;
        payload?: Record<string, unknown> | undefined;
    }>, "many">>;
    allowedTenants: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    allowedUsers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    blockedTenants: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    blockedUsers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    targetingRules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        attribute: z.ZodString;
        operator: z.ZodEnum<["equals", "not_equals", "contains", "not_contains", "starts_with", "ends_with", "greater_than", "less_than", "in_list", "not_in_list", "regex"]>;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | boolean | string[];
        attribute: string;
        operator: "equals" | "not_equals" | "contains" | "not_contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "in_list" | "not_in_list" | "regex";
    }, {
        value: string | number | boolean | string[];
        attribute: string;
        operator: "equals" | "not_equals" | "contains" | "not_contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "in_list" | "not_in_list" | "regex";
    }>, "many">>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    owner: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    key: string;
    type: "boolean" | "percentage" | "variant" | "allowlist" | "schedule";
    status: "active" | "inactive" | "archived";
    name: string;
    id: string;
    createdAt: Date;
    metadata: Record<string, unknown>;
    updatedAt: Date;
    tags: string[];
    defaultValue: boolean;
    description?: string | undefined;
    owner?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    percentage?: number | undefined;
    variants?: {
        name: string;
        weight: number;
        payload?: Record<string, unknown> | undefined;
    }[] | undefined;
    allowedTenants?: string[] | undefined;
    allowedUsers?: string[] | undefined;
    blockedTenants?: string[] | undefined;
    blockedUsers?: string[] | undefined;
    targetingRules?: {
        value: string | number | boolean | string[];
        attribute: string;
        operator: "equals" | "not_equals" | "contains" | "not_contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "in_list" | "not_in_list" | "regex";
    }[] | undefined;
}, {
    key: string;
    type: "boolean" | "percentage" | "variant" | "allowlist" | "schedule";
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status?: "active" | "inactive" | "archived" | undefined;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    owner?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    tags?: string[] | undefined;
    percentage?: number | undefined;
    defaultValue?: boolean | undefined;
    variants?: {
        name: string;
        weight: number;
        payload?: Record<string, unknown> | undefined;
    }[] | undefined;
    allowedTenants?: string[] | undefined;
    allowedUsers?: string[] | undefined;
    blockedTenants?: string[] | undefined;
    blockedUsers?: string[] | undefined;
    targetingRules?: {
        value: string | number | boolean | string[];
        attribute: string;
        operator: "equals" | "not_equals" | "contains" | "not_contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "in_list" | "not_in_list" | "regex";
    }[] | undefined;
}>;
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
export interface EvaluationContext {
    tenantId?: string;
    userId?: string;
    userEmail?: string;
    userRole?: string;
    plan?: string;
    country?: string;
    platform?: string;
    version?: string;
    [key: string]: unknown;
}
export interface EvaluationResult {
    enabled: boolean;
    variant?: string;
    payload?: Record<string, unknown>;
    reason: string;
}
/**
 * Feature Flag Service
 */
export declare class FeatureFlagService {
    private flags;
    private overrides;
    /**
     * Register a feature flag
     */
    register(flag: FeatureFlag): void;
    /**
     * Register multiple flags
     */
    registerAll(flags: FeatureFlag[]): void;
    /**
     * Get a feature flag by key
     */
    getFlag(key: string): FeatureFlag | undefined;
    /**
     * List all feature flags
     */
    listFlags(filter?: {
        status?: FeatureFlagStatus;
        tag?: string;
    }): FeatureFlag[];
    /**
     * Evaluate a feature flag
     */
    evaluate(key: string, context?: EvaluationContext): EvaluationResult;
    /**
     * Check if a feature is enabled (simple boolean check)
     */
    isEnabled(key: string, context?: EvaluationContext): boolean;
    /**
     * Get variant for a feature (A/B testing)
     */
    getVariant(key: string, context?: EvaluationContext): string | null;
    /**
     * Set an override for testing
     */
    setOverride(key: string, value: boolean, context?: EvaluationContext): void;
    /**
     * Clear override
     */
    clearOverride(key: string, context?: EvaluationContext): void;
    /**
     * Clear all overrides
     */
    clearAllOverrides(): void;
    /**
     * Get context from tenant context (integration with tenancy)
     */
    getContextFromTenant(): EvaluationContext;
    /**
     * Check flag with automatic tenant context
     */
    check(key: string, additionalContext?: Partial<EvaluationContext>): boolean;
    private getOverrideKey;
    private hashContext;
    private evaluateRules;
    private evaluateRule;
    private selectVariant;
}
export declare const featureFlags: FeatureFlagService;
/**
 * Create feature flag service
 */
export declare const createFeatureFlagService: () => FeatureFlagService;
/**
 * Helper function to check a feature flag
 */
export declare const isFeatureEnabled: (key: string, context?: EvaluationContext) => boolean;
/**
 * Helper function with automatic tenant context
 */
export declare const checkFeature: (key: string) => boolean;
//# sourceMappingURL=feature-flags.d.ts.map