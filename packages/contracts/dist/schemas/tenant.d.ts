import { z } from 'zod';
/**
 * Multi-Tenancy Schemas
 * Core schemas for multi-tenant SaaS applications
 */
export declare const TenantStatusSchema: z.ZodEnum<["active", "suspended", "pending", "trial", "cancelled"]>;
export type TenantStatus = z.infer<typeof TenantStatusSchema>;
export declare const TenantPlanSchema: z.ZodEnum<["free", "starter", "professional", "enterprise", "custom"]>;
export type TenantPlan = z.infer<typeof TenantPlanSchema>;
export declare const TenantSettingsSchema: z.ZodObject<{
    maxUsers: z.ZodDefault<z.ZodNumber>;
    maxStorage: z.ZodDefault<z.ZodNumber>;
    features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    customDomain: z.ZodOptional<z.ZodString>;
    ssoEnabled: z.ZodDefault<z.ZodBoolean>;
    apiRateLimit: z.ZodDefault<z.ZodNumber>;
    retentionDays: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    maxUsers: number;
    maxStorage: number;
    features: string[];
    ssoEnabled: boolean;
    apiRateLimit: number;
    retentionDays: number;
    customDomain?: string | undefined;
}, {
    maxUsers?: number | undefined;
    maxStorage?: number | undefined;
    features?: string[] | undefined;
    customDomain?: string | undefined;
    ssoEnabled?: boolean | undefined;
    apiRateLimit?: number | undefined;
    retentionDays?: number | undefined;
}>;
export type TenantSettings = z.infer<typeof TenantSettingsSchema>;
export declare const TenantSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["active", "suspended", "pending", "trial", "cancelled"]>>;
    plan: z.ZodDefault<z.ZodEnum<["free", "starter", "professional", "enterprise", "custom"]>>;
    settings: z.ZodDefault<z.ZodObject<{
        maxUsers: z.ZodDefault<z.ZodNumber>;
        maxStorage: z.ZodDefault<z.ZodNumber>;
        features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        customDomain: z.ZodOptional<z.ZodString>;
        ssoEnabled: z.ZodDefault<z.ZodBoolean>;
        apiRateLimit: z.ZodDefault<z.ZodNumber>;
        retentionDays: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxUsers: number;
        maxStorage: number;
        features: string[];
        ssoEnabled: boolean;
        apiRateLimit: number;
        retentionDays: number;
        customDomain?: string | undefined;
    }, {
        maxUsers?: number | undefined;
        maxStorage?: number | undefined;
        features?: string[] | undefined;
        customDomain?: string | undefined;
        ssoEnabled?: boolean | undefined;
        apiRateLimit?: number | undefined;
        retentionDays?: number | undefined;
    }>>;
    ownerId: z.ZodString;
    billingEmail: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    trialEndsAt: z.ZodOptional<z.ZodDate>;
    suspendedAt: z.ZodOptional<z.ZodDate>;
    suspendedReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "suspended" | "pending" | "trial" | "cancelled";
    id: string;
    name: string;
    slug: string;
    plan: "free" | "starter" | "professional" | "enterprise" | "custom";
    settings: {
        maxUsers: number;
        maxStorage: number;
        features: string[];
        ssoEnabled: boolean;
        apiRateLimit: number;
        retentionDays: number;
        customDomain?: string | undefined;
    };
    ownerId: string;
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    billingEmail?: string | undefined;
    trialEndsAt?: Date | undefined;
    suspendedAt?: Date | undefined;
    suspendedReason?: string | undefined;
}, {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    status?: "active" | "suspended" | "pending" | "trial" | "cancelled" | undefined;
    plan?: "free" | "starter" | "professional" | "enterprise" | "custom" | undefined;
    settings?: {
        maxUsers?: number | undefined;
        maxStorage?: number | undefined;
        features?: string[] | undefined;
        customDomain?: string | undefined;
        ssoEnabled?: boolean | undefined;
        apiRateLimit?: number | undefined;
        retentionDays?: number | undefined;
    } | undefined;
    billingEmail?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    trialEndsAt?: Date | undefined;
    suspendedAt?: Date | undefined;
    suspendedReason?: string | undefined;
}>;
export type Tenant = z.infer<typeof TenantSchema>;
export declare const CreateTenantInputSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["active", "suspended", "pending", "trial", "cancelled"]>>;
    plan: z.ZodDefault<z.ZodEnum<["free", "starter", "professional", "enterprise", "custom"]>>;
    settings: z.ZodDefault<z.ZodObject<{
        maxUsers: z.ZodDefault<z.ZodNumber>;
        maxStorage: z.ZodDefault<z.ZodNumber>;
        features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        customDomain: z.ZodOptional<z.ZodString>;
        ssoEnabled: z.ZodDefault<z.ZodBoolean>;
        apiRateLimit: z.ZodDefault<z.ZodNumber>;
        retentionDays: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxUsers: number;
        maxStorage: number;
        features: string[];
        ssoEnabled: boolean;
        apiRateLimit: number;
        retentionDays: number;
        customDomain?: string | undefined;
    }, {
        maxUsers?: number | undefined;
        maxStorage?: number | undefined;
        features?: string[] | undefined;
        customDomain?: string | undefined;
        ssoEnabled?: boolean | undefined;
        apiRateLimit?: number | undefined;
        retentionDays?: number | undefined;
    }>>;
    ownerId: z.ZodString;
    billingEmail: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    trialEndsAt: z.ZodOptional<z.ZodDate>;
    suspendedAt: z.ZodOptional<z.ZodDate>;
    suspendedReason: z.ZodOptional<z.ZodString>;
}, "id" | "createdAt" | "updatedAt" | "suspendedAt" | "suspendedReason">, "strip", z.ZodTypeAny, {
    status: "active" | "suspended" | "pending" | "trial" | "cancelled";
    name: string;
    slug: string;
    plan: "free" | "starter" | "professional" | "enterprise" | "custom";
    settings: {
        maxUsers: number;
        maxStorage: number;
        features: string[];
        ssoEnabled: boolean;
        apiRateLimit: number;
        retentionDays: number;
        customDomain?: string | undefined;
    };
    ownerId: string;
    metadata: Record<string, unknown>;
    billingEmail?: string | undefined;
    trialEndsAt?: Date | undefined;
}, {
    name: string;
    slug: string;
    ownerId: string;
    status?: "active" | "suspended" | "pending" | "trial" | "cancelled" | undefined;
    plan?: "free" | "starter" | "professional" | "enterprise" | "custom" | undefined;
    settings?: {
        maxUsers?: number | undefined;
        maxStorage?: number | undefined;
        features?: string[] | undefined;
        customDomain?: string | undefined;
        ssoEnabled?: boolean | undefined;
        apiRateLimit?: number | undefined;
        retentionDays?: number | undefined;
    } | undefined;
    billingEmail?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    trialEndsAt?: Date | undefined;
}>;
export type CreateTenantInput = z.infer<typeof CreateTenantInputSchema>;
export declare const UpdateTenantInputSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["active", "suspended", "pending", "trial", "cancelled"]>>>;
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    plan: z.ZodOptional<z.ZodDefault<z.ZodEnum<["free", "starter", "professional", "enterprise", "custom"]>>>;
    settings: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        maxUsers: z.ZodDefault<z.ZodNumber>;
        maxStorage: z.ZodDefault<z.ZodNumber>;
        features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        customDomain: z.ZodOptional<z.ZodString>;
        ssoEnabled: z.ZodDefault<z.ZodBoolean>;
        apiRateLimit: z.ZodDefault<z.ZodNumber>;
        retentionDays: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        maxUsers: number;
        maxStorage: number;
        features: string[];
        ssoEnabled: boolean;
        apiRateLimit: number;
        retentionDays: number;
        customDomain?: string | undefined;
    }, {
        maxUsers?: number | undefined;
        maxStorage?: number | undefined;
        features?: string[] | undefined;
        customDomain?: string | undefined;
        ssoEnabled?: boolean | undefined;
        apiRateLimit?: number | undefined;
        retentionDays?: number | undefined;
    }>>>;
    ownerId: z.ZodOptional<z.ZodString>;
    billingEmail: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    trialEndsAt: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    suspendedAt: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    suspendedReason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: "active" | "suspended" | "pending" | "trial" | "cancelled" | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    plan?: "free" | "starter" | "professional" | "enterprise" | "custom" | undefined;
    settings?: {
        maxUsers: number;
        maxStorage: number;
        features: string[];
        ssoEnabled: boolean;
        apiRateLimit: number;
        retentionDays: number;
        customDomain?: string | undefined;
    } | undefined;
    ownerId?: string | undefined;
    billingEmail?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    trialEndsAt?: Date | undefined;
    suspendedAt?: Date | undefined;
    suspendedReason?: string | undefined;
}, {
    id: string;
    status?: "active" | "suspended" | "pending" | "trial" | "cancelled" | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    plan?: "free" | "starter" | "professional" | "enterprise" | "custom" | undefined;
    settings?: {
        maxUsers?: number | undefined;
        maxStorage?: number | undefined;
        features?: string[] | undefined;
        customDomain?: string | undefined;
        ssoEnabled?: boolean | undefined;
        apiRateLimit?: number | undefined;
        retentionDays?: number | undefined;
    } | undefined;
    ownerId?: string | undefined;
    billingEmail?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    trialEndsAt?: Date | undefined;
    suspendedAt?: Date | undefined;
    suspendedReason?: string | undefined;
}>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantInputSchema>;
export declare const TenantMemberRoleSchema: z.ZodEnum<["owner", "admin", "member", "viewer", "billing"]>;
export type TenantMemberRole = z.infer<typeof TenantMemberRoleSchema>;
export declare const TenantMemberSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["owner", "admin", "member", "viewer", "billing"]>>;
    permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    invitedBy: z.ZodOptional<z.ZodString>;
    invitedAt: z.ZodOptional<z.ZodDate>;
    joinedAt: z.ZodDate;
    lastActiveAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tenantId: string;
    userId: string;
    role: "owner" | "admin" | "member" | "viewer" | "billing";
    permissions: string[];
    joinedAt: Date;
    invitedBy?: string | undefined;
    invitedAt?: Date | undefined;
    lastActiveAt?: Date | undefined;
}, {
    id: string;
    tenantId: string;
    userId: string;
    joinedAt: Date;
    role?: "owner" | "admin" | "member" | "viewer" | "billing" | undefined;
    permissions?: string[] | undefined;
    invitedBy?: string | undefined;
    invitedAt?: Date | undefined;
    lastActiveAt?: Date | undefined;
}>;
export type TenantMember = z.infer<typeof TenantMemberSchema>;
export declare const TenantInvitationSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    email: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["owner", "admin", "member", "viewer", "billing"]>>;
    token: z.ZodString;
    invitedBy: z.ZodString;
    expiresAt: z.ZodDate;
    acceptedAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    tenantId: string;
    role: "owner" | "admin" | "member" | "viewer" | "billing";
    invitedBy: string;
    email: string;
    token: string;
    expiresAt: Date;
    acceptedAt?: Date | undefined;
}, {
    id: string;
    createdAt: Date;
    tenantId: string;
    invitedBy: string;
    email: string;
    token: string;
    expiresAt: Date;
    role?: "owner" | "admin" | "member" | "viewer" | "billing" | undefined;
    acceptedAt?: Date | undefined;
}>;
export type TenantInvitation = z.infer<typeof TenantInvitationSchema>;
export declare const TenantContextSchema: z.ZodObject<{
    tenantId: z.ZodString;
    tenant: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
        status: z.ZodDefault<z.ZodEnum<["active", "suspended", "pending", "trial", "cancelled"]>>;
        plan: z.ZodDefault<z.ZodEnum<["free", "starter", "professional", "enterprise", "custom"]>>;
        settings: z.ZodDefault<z.ZodObject<{
            maxUsers: z.ZodDefault<z.ZodNumber>;
            maxStorage: z.ZodDefault<z.ZodNumber>;
            features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            customDomain: z.ZodOptional<z.ZodString>;
            ssoEnabled: z.ZodDefault<z.ZodBoolean>;
            apiRateLimit: z.ZodDefault<z.ZodNumber>;
            retentionDays: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            maxUsers: number;
            maxStorage: number;
            features: string[];
            ssoEnabled: boolean;
            apiRateLimit: number;
            retentionDays: number;
            customDomain?: string | undefined;
        }, {
            maxUsers?: number | undefined;
            maxStorage?: number | undefined;
            features?: string[] | undefined;
            customDomain?: string | undefined;
            ssoEnabled?: boolean | undefined;
            apiRateLimit?: number | undefined;
            retentionDays?: number | undefined;
        }>>;
        ownerId: z.ZodString;
        billingEmail: z.ZodOptional<z.ZodString>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        trialEndsAt: z.ZodOptional<z.ZodDate>;
        suspendedAt: z.ZodOptional<z.ZodDate>;
        suspendedReason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "active" | "suspended" | "pending" | "trial" | "cancelled";
        id: string;
        name: string;
        slug: string;
        plan: "free" | "starter" | "professional" | "enterprise" | "custom";
        settings: {
            maxUsers: number;
            maxStorage: number;
            features: string[];
            ssoEnabled: boolean;
            apiRateLimit: number;
            retentionDays: number;
            customDomain?: string | undefined;
        };
        ownerId: string;
        metadata: Record<string, unknown>;
        createdAt: Date;
        updatedAt: Date;
        billingEmail?: string | undefined;
        trialEndsAt?: Date | undefined;
        suspendedAt?: Date | undefined;
        suspendedReason?: string | undefined;
    }, {
        id: string;
        name: string;
        slug: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status?: "active" | "suspended" | "pending" | "trial" | "cancelled" | undefined;
        plan?: "free" | "starter" | "professional" | "enterprise" | "custom" | undefined;
        settings?: {
            maxUsers?: number | undefined;
            maxStorage?: number | undefined;
            features?: string[] | undefined;
            customDomain?: string | undefined;
            ssoEnabled?: boolean | undefined;
            apiRateLimit?: number | undefined;
            retentionDays?: number | undefined;
        } | undefined;
        billingEmail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        trialEndsAt?: Date | undefined;
        suspendedAt?: Date | undefined;
        suspendedReason?: string | undefined;
    }>>;
    userId: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["owner", "admin", "member", "viewer", "billing"]>>;
    permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    permissions: string[];
    userId?: string | undefined;
    role?: "owner" | "admin" | "member" | "viewer" | "billing" | undefined;
    tenant?: {
        status: "active" | "suspended" | "pending" | "trial" | "cancelled";
        id: string;
        name: string;
        slug: string;
        plan: "free" | "starter" | "professional" | "enterprise" | "custom";
        settings: {
            maxUsers: number;
            maxStorage: number;
            features: string[];
            ssoEnabled: boolean;
            apiRateLimit: number;
            retentionDays: number;
            customDomain?: string | undefined;
        };
        ownerId: string;
        metadata: Record<string, unknown>;
        createdAt: Date;
        updatedAt: Date;
        billingEmail?: string | undefined;
        trialEndsAt?: Date | undefined;
        suspendedAt?: Date | undefined;
        suspendedReason?: string | undefined;
    } | undefined;
}, {
    tenantId: string;
    userId?: string | undefined;
    role?: "owner" | "admin" | "member" | "viewer" | "billing" | undefined;
    permissions?: string[] | undefined;
    tenant?: {
        id: string;
        name: string;
        slug: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        status?: "active" | "suspended" | "pending" | "trial" | "cancelled" | undefined;
        plan?: "free" | "starter" | "professional" | "enterprise" | "custom" | undefined;
        settings?: {
            maxUsers?: number | undefined;
            maxStorage?: number | undefined;
            features?: string[] | undefined;
            customDomain?: string | undefined;
            ssoEnabled?: boolean | undefined;
            apiRateLimit?: number | undefined;
            retentionDays?: number | undefined;
        } | undefined;
        billingEmail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        trialEndsAt?: Date | undefined;
        suspendedAt?: Date | undefined;
        suspendedReason?: string | undefined;
    } | undefined;
}>;
export type TenantContext = z.infer<typeof TenantContextSchema>;
//# sourceMappingURL=tenant.d.ts.map