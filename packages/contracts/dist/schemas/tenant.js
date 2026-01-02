import { z } from 'zod';
/**
 * Multi-Tenancy Schemas
 * Core schemas for multi-tenant SaaS applications
 */
// Tenant status
export const TenantStatusSchema = z.enum([
    'active',
    'suspended',
    'pending',
    'trial',
    'cancelled',
]);
// Tenant plan/tier
export const TenantPlanSchema = z.enum([
    'free',
    'starter',
    'professional',
    'enterprise',
    'custom',
]);
// Tenant settings
export const TenantSettingsSchema = z.object({
    maxUsers: z.number().int().min(1).default(5),
    maxStorage: z.number().int().min(0).default(1073741824), // 1GB in bytes
    features: z.array(z.string()).default([]),
    customDomain: z.string().optional(),
    ssoEnabled: z.boolean().default(false),
    apiRateLimit: z.number().int().min(0).default(1000), // requests per hour
    retentionDays: z.number().int().min(1).default(90),
});
// Main Tenant schema
export const TenantSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
    status: TenantStatusSchema.default('pending'),
    plan: TenantPlanSchema.default('free'),
    settings: TenantSettingsSchema.default({}),
    ownerId: z.string().uuid(),
    billingEmail: z.string().email().optional(),
    metadata: z.record(z.unknown()).default({}),
    createdAt: z.date(),
    updatedAt: z.date(),
    trialEndsAt: z.date().optional(),
    suspendedAt: z.date().optional(),
    suspendedReason: z.string().optional(),
});
// Tenant creation input
export const CreateTenantInputSchema = TenantSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    suspendedAt: true,
    suspendedReason: true,
});
// Tenant update input
export const UpdateTenantInputSchema = TenantSchema.partial().required({ id: true });
// Tenant member role
export const TenantMemberRoleSchema = z.enum([
    'owner',
    'admin',
    'member',
    'viewer',
    'billing',
]);
// Tenant membership
export const TenantMemberSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    userId: z.string().uuid(),
    role: TenantMemberRoleSchema.default('member'),
    permissions: z.array(z.string()).default([]),
    invitedBy: z.string().uuid().optional(),
    invitedAt: z.date().optional(),
    joinedAt: z.date(),
    lastActiveAt: z.date().optional(),
});
// Tenant invitation
export const TenantInvitationSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    email: z.string().email(),
    role: TenantMemberRoleSchema.default('member'),
    token: z.string(),
    invitedBy: z.string().uuid(),
    expiresAt: z.date(),
    acceptedAt: z.date().optional(),
    createdAt: z.date(),
});
// Tenant context for request handling
export const TenantContextSchema = z.object({
    tenantId: z.string().uuid(),
    tenant: TenantSchema.optional(),
    userId: z.string().uuid().optional(),
    role: TenantMemberRoleSchema.optional(),
    permissions: z.array(z.string()).default([]),
});
