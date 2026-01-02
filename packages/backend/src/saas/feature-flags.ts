import { z } from 'zod';
import { getCurrentTenantId, getTenantContext } from '../tenancy/context';

/**
 * Feature Flags System
 * Provides flexible feature flag management for gradual rollouts and A/B testing
 */

// Feature flag type
export const FeatureFlagTypeSchema = z.enum([
  'boolean',      // Simple on/off
  'percentage',   // Percentage rollout
  'variant',      // A/B testing with variants
  'allowlist',    // Specific users/tenants
  'schedule',     // Time-based activation
]);

export type FeatureFlagType = z.infer<typeof FeatureFlagTypeSchema>;

// Feature flag status
export const FeatureFlagStatusSchema = z.enum([
  'active',
  'inactive',
  'archived',
]);

export type FeatureFlagStatus = z.infer<typeof FeatureFlagStatusSchema>;

// Variant definition
export const VariantSchema = z.object({
  name: z.string(),
  weight: z.number().min(0).max(100),
  payload: z.record(z.unknown()).optional(),
});

export type Variant = z.infer<typeof VariantSchema>;

// Targeting rule
export const TargetingRuleSchema = z.object({
  attribute: z.string(),
  operator: z.enum([
    'equals',
    'not_equals',
    'contains',
    'not_contains',
    'starts_with',
    'ends_with',
    'greater_than',
    'less_than',
    'in_list',
    'not_in_list',
    'regex',
  ]),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

export type TargetingRule = z.infer<typeof TargetingRuleSchema>;

// Feature flag schema
export const FeatureFlagSchema = z.object({
  id: z.string(),
  key: z.string().regex(/^[a-z][a-z0-9_-]*$/i),
  name: z.string(),
  description: z.string().optional(),
  type: FeatureFlagTypeSchema,
  status: FeatureFlagStatusSchema.default('inactive'),

  // Boolean flags
  defaultValue: z.boolean().default(false),

  // Percentage rollout
  percentage: z.number().min(0).max(100).optional(),

  // Variants for A/B testing
  variants: z.array(VariantSchema).optional(),

  // Allowlist
  allowedTenants: z.array(z.string()).optional(),
  allowedUsers: z.array(z.string()).optional(),
  blockedTenants: z.array(z.string()).optional(),
  blockedUsers: z.array(z.string()).optional(),

  // Targeting rules
  targetingRules: z.array(TargetingRuleSchema).optional(),

  // Schedule
  startDate: z.date().optional(),
  endDate: z.date().optional(),

  // Metadata
  tags: z.array(z.string()).default([]),
  owner: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

// Evaluation context
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

// Evaluation result
export interface EvaluationResult {
  enabled: boolean;
  variant?: string;
  payload?: Record<string, unknown>;
  reason: string;
}

/**
 * Feature Flag Service
 */
export class FeatureFlagService {
  private flags = new Map<string, FeatureFlag>();
  private overrides = new Map<string, Map<string, boolean>>(); // key -> context_id -> value

  /**
   * Register a feature flag
   */
  register(flag: FeatureFlag): void {
    this.flags.set(flag.key, flag);
  }

  /**
   * Register multiple flags
   */
  registerAll(flags: FeatureFlag[]): void {
    for (const flag of flags) {
      this.register(flag);
    }
  }

  /**
   * Get a feature flag by key
   */
  getFlag(key: string): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  /**
   * List all feature flags
   */
  listFlags(filter?: { status?: FeatureFlagStatus; tag?: string }): FeatureFlag[] {
    let flags = Array.from(this.flags.values());

    if (filter?.status) {
      flags = flags.filter(f => f.status === filter.status);
    }

    if (filter?.tag) {
      flags = flags.filter(f => f.tags.includes(filter.tag as string));
    }

    return flags;
  }

  /**
   * Evaluate a feature flag
   */
  evaluate(key: string, context?: EvaluationContext): EvaluationResult {
    const flag = this.flags.get(key);

    if (!flag) {
      return { enabled: false, reason: 'flag_not_found' };
    }

    if (flag.status !== 'active') {
      return { enabled: false, reason: 'flag_inactive' };
    }

    // Check for overrides
    const overrideKey = this.getOverrideKey(context);
    const overrideMap = this.overrides.get(key);
    if (overrideMap?.has(overrideKey)) {
      return {
        enabled: overrideMap.get(overrideKey)!,
        reason: 'override',
      };
    }

    // Check schedule
    if (flag.startDate || flag.endDate) {
      const now = new Date();
      if (flag.startDate && now < flag.startDate) {
        return { enabled: false, reason: 'before_start_date' };
      }
      if (flag.endDate && now > flag.endDate) {
        return { enabled: false, reason: 'after_end_date' };
      }
    }

    // Check blocklist first
    if (context?.tenantId && flag.blockedTenants?.includes(context.tenantId)) {
      return { enabled: false, reason: 'tenant_blocked' };
    }
    if (context?.userId && flag.blockedUsers?.includes(context.userId)) {
      return { enabled: false, reason: 'user_blocked' };
    }

    // Check allowlist
    if (flag.allowedTenants?.length || flag.allowedUsers?.length) {
      const tenantAllowed = !flag.allowedTenants?.length ||
        (context?.tenantId && flag.allowedTenants.includes(context.tenantId));
      const userAllowed = !flag.allowedUsers?.length ||
        (context?.userId && flag.allowedUsers.includes(context.userId));

      if (tenantAllowed || userAllowed) {
        return { enabled: true, reason: 'allowlist' };
      }

      // If allowlist is defined but not matched, disable
      if (flag.type === 'allowlist') {
        return { enabled: false, reason: 'not_in_allowlist' };
      }
    }

    // Check targeting rules
    if (flag.targetingRules?.length) {
      const matches = this.evaluateRules(flag.targetingRules, context);
      if (!matches) {
        return { enabled: false, reason: 'targeting_rules_not_matched' };
      }
    }

    // Evaluate based on type
    switch (flag.type) {
      case 'boolean':
        return { enabled: flag.defaultValue, reason: 'default_value' };

      case 'percentage':
        const hash = this.hashContext(key, context);
        const enabled = hash < (flag.percentage || 0);
        return { enabled, reason: 'percentage_rollout' };

      case 'variant':
        const variant = this.selectVariant(flag, context);
        return {
          enabled: variant !== null,
          variant: variant?.name,
          payload: variant?.payload,
          reason: 'variant_selected',
        };

      case 'allowlist':
        return { enabled: false, reason: 'not_in_allowlist' };

      case 'schedule':
        return { enabled: true, reason: 'in_schedule' };

      default:
        return { enabled: flag.defaultValue, reason: 'default_value' };
    }
  }

  /**
   * Check if a feature is enabled (simple boolean check)
   */
  isEnabled(key: string, context?: EvaluationContext): boolean {
    return this.evaluate(key, context).enabled;
  }

  /**
   * Get variant for a feature (A/B testing)
   */
  getVariant(key: string, context?: EvaluationContext): string | null {
    const result = this.evaluate(key, context);
    return result.variant || null;
  }

  /**
   * Set an override for testing
   */
  setOverride(key: string, value: boolean, context?: EvaluationContext): void {
    const overrideKey = this.getOverrideKey(context);
    if (!this.overrides.has(key)) {
      this.overrides.set(key, new Map());
    }
    this.overrides.get(key)!.set(overrideKey, value);
  }

  /**
   * Clear override
   */
  clearOverride(key: string, context?: EvaluationContext): void {
    const overrideKey = this.getOverrideKey(context);
    this.overrides.get(key)?.delete(overrideKey);
  }

  /**
   * Clear all overrides
   */
  clearAllOverrides(): void {
    this.overrides.clear();
  }

  /**
   * Get context from tenant context (integration with tenancy)
   */
  getContextFromTenant(): EvaluationContext {
    const tenantContext = getTenantContext();
    return {
      tenantId: tenantContext?.tenantId,
      userId: tenantContext?.userId,
      userRole: tenantContext?.role,
      plan: tenantContext?.tenant?.plan,
    };
  }

  /**
   * Check flag with automatic tenant context
   */
  check(key: string, additionalContext?: Partial<EvaluationContext>): boolean {
    const context = { ...this.getContextFromTenant(), ...additionalContext };
    return this.isEnabled(key, context);
  }

  // Private helper methods

  private getOverrideKey(context?: EvaluationContext): string {
    if (!context) return 'global';
    return `${context.tenantId || ''}-${context.userId || ''}`;
  }

  private hashContext(key: string, context?: EvaluationContext): number {
    // Simple hash function for percentage rollout
    const str = `${key}-${context?.tenantId || ''}-${context?.userId || ''}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash % 100);
  }

  private evaluateRules(rules: TargetingRule[], context?: EvaluationContext): boolean {
    if (!context) return false;

    return rules.every(rule => {
      const value = context[rule.attribute];
      return this.evaluateRule(rule, value);
    });
  }

  private evaluateRule(rule: TargetingRule, value: unknown): boolean {
    const ruleValue = rule.value;

    switch (rule.operator) {
      case 'equals':
        return value === ruleValue;
      case 'not_equals':
        return value !== ruleValue;
      case 'contains':
        return String(value).includes(String(ruleValue));
      case 'not_contains':
        return !String(value).includes(String(ruleValue));
      case 'starts_with':
        return String(value).startsWith(String(ruleValue));
      case 'ends_with':
        return String(value).endsWith(String(ruleValue));
      case 'greater_than':
        return Number(value) > Number(ruleValue);
      case 'less_than':
        return Number(value) < Number(ruleValue);
      case 'in_list':
        return Array.isArray(ruleValue) && ruleValue.includes(value as string);
      case 'not_in_list':
        return Array.isArray(ruleValue) && !ruleValue.includes(value as string);
      case 'regex':
        return new RegExp(String(ruleValue)).test(String(value));
      default:
        return false;
    }
  }

  private selectVariant(flag: FeatureFlag, context?: EvaluationContext): Variant | null {
    if (!flag.variants?.length) return null;

    const hash = this.hashContext(flag.key, context);
    let cumulative = 0;

    for (const variant of flag.variants) {
      cumulative += variant.weight;
      if (hash < cumulative) {
        return variant;
      }
    }

    return flag.variants[flag.variants.length - 1];
  }
}

// Global feature flag service instance
export const featureFlags = new FeatureFlagService();

/**
 * Create feature flag service
 */
export const createFeatureFlagService = (): FeatureFlagService => {
  return new FeatureFlagService();
};

/**
 * Helper function to check a feature flag
 */
export const isFeatureEnabled = (
  key: string,
  context?: EvaluationContext
): boolean => {
  return featureFlags.isEnabled(key, context);
};

/**
 * Helper function with automatic tenant context
 */
export const checkFeature = (key: string): boolean => {
  return featureFlags.check(key);
};
