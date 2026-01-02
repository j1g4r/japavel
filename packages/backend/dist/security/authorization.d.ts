import { z } from 'zod';
/**
 * Authorization System (RBAC + ABAC)
 * Role-Based and Attribute-Based Access Control
 */
export declare const PermissionActionSchema: z.ZodEnum<["create", "read", "update", "delete", "list", "manage", "*"]>;
export type PermissionAction = z.infer<typeof PermissionActionSchema>;
export declare const PermissionSchema: z.ZodObject<{
    resource: z.ZodString;
    action: z.ZodEnum<["create", "read", "update", "delete", "list", "manage", "*"]>;
    conditions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    action: "*" | "create" | "delete" | "read" | "update" | "list" | "manage";
    resource: string;
    conditions?: Record<string, unknown> | undefined;
}, {
    action: "*" | "create" | "delete" | "read" | "update" | "list" | "manage";
    resource: string;
    conditions?: Record<string, unknown> | undefined;
}>;
export type Permission = z.infer<typeof PermissionSchema>;
export declare const RoleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    permissions: z.ZodArray<z.ZodObject<{
        resource: z.ZodString;
        action: z.ZodEnum<["create", "read", "update", "delete", "list", "manage", "*"]>;
        conditions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        action: "*" | "create" | "delete" | "read" | "update" | "list" | "manage";
        resource: string;
        conditions?: Record<string, unknown> | undefined;
    }, {
        action: "*" | "create" | "delete" | "read" | "update" | "list" | "manage";
        resource: string;
        conditions?: Record<string, unknown> | undefined;
    }>, "many">;
    inherits: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isSystem: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    metadata: Record<string, unknown>;
    permissions: {
        action: "*" | "create" | "delete" | "read" | "update" | "list" | "manage";
        resource: string;
        conditions?: Record<string, unknown> | undefined;
    }[];
    inherits: string[];
    isSystem: boolean;
    description?: string | undefined;
}, {
    name: string;
    id: string;
    permissions: {
        action: "*" | "create" | "delete" | "read" | "update" | "list" | "manage";
        resource: string;
        conditions?: Record<string, unknown> | undefined;
    }[];
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    inherits?: string[] | undefined;
    isSystem?: boolean | undefined;
}>;
export type Role = z.infer<typeof RoleSchema>;
export declare const PolicySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    effect: z.ZodEnum<["allow", "deny"]>;
    resources: z.ZodArray<z.ZodString, "many">;
    actions: z.ZodArray<z.ZodEnum<["create", "read", "update", "delete", "list", "manage", "*"]>, "many">;
    conditions: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["equals", "not_equals", "in", "not_in", "contains", "starts_with", "ends_with", "greater_than", "less_than", "matches"]>;
        value: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        operator: "in" | "equals" | "not_equals" | "contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "not_in" | "matches";
        field: string;
        value?: unknown;
    }, {
        operator: "in" | "equals" | "not_equals" | "contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "not_in" | "matches";
        field: string;
        value?: unknown;
    }>, "many">;
    priority: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    priority: number;
    conditions: {
        operator: "in" | "equals" | "not_equals" | "contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "not_in" | "matches";
        field: string;
        value?: unknown;
    }[];
    effect: "deny" | "allow";
    resources: string[];
    actions: ("*" | "create" | "delete" | "read" | "update" | "list" | "manage")[];
    description?: string | undefined;
}, {
    name: string;
    id: string;
    conditions: {
        operator: "in" | "equals" | "not_equals" | "contains" | "starts_with" | "ends_with" | "greater_than" | "less_than" | "not_in" | "matches";
        field: string;
        value?: unknown;
    }[];
    effect: "deny" | "allow";
    resources: string[];
    actions: ("*" | "create" | "delete" | "read" | "update" | "list" | "manage")[];
    description?: string | undefined;
    priority?: number | undefined;
}>;
export type Policy = z.infer<typeof PolicySchema>;
export interface AuthorizationContext {
    userId?: string;
    tenantId?: string;
    roles: string[];
    attributes: Record<string, unknown>;
}
export interface AuthorizationResult {
    allowed: boolean;
    reason: string;
    matchedRole?: string;
    matchedPolicy?: string;
}
/**
 * Role-Based Access Control Manager
 */
export declare class RBACManager {
    private roles;
    /**
     * Register a role
     */
    registerRole(role: Role): void;
    /**
     * Register multiple roles
     */
    registerRoles(roles: Role[]): void;
    /**
     * Get role by ID
     */
    getRole(roleId: string): Role | undefined;
    /**
     * Get all permissions for a role (including inherited)
     */
    getRolePermissions(roleId: string, visited?: Set<string>): Permission[];
    /**
     * Check if a role has permission
     */
    hasPermission(roleId: string, resource: string, action: PermissionAction): boolean;
    /**
     * Check if any of the roles has permission
     */
    anyRoleHasPermission(roleIds: string[], resource: string, action: PermissionAction): {
        allowed: boolean;
        matchedRole?: string;
    };
}
/**
 * Attribute-Based Access Control Manager
 */
export declare class ABACManager {
    private policies;
    /**
     * Add a policy
     */
    addPolicy(policy: Policy): void;
    /**
     * Add multiple policies
     */
    addPolicies(policies: Policy[]): void;
    /**
     * Evaluate policies for a request
     */
    evaluate(resource: string, action: PermissionAction, context: AuthorizationContext): {
        allowed: boolean;
        matchedPolicy?: string;
        reason: string;
    };
    /**
     * Evaluate policy conditions
     */
    private evaluateConditions;
    /**
     * Get field value from context
     */
    private getFieldValue;
    /**
     * Evaluate a single condition
     */
    private evaluateCondition;
}
/**
 * Combined Authorization Manager
 */
export declare class AuthorizationManager {
    private rbac;
    private abac;
    /**
     * Register roles
     */
    registerRoles(roles: Role[]): void;
    /**
     * Add policies
     */
    addPolicies(policies: Policy[]): void;
    /**
     * Check authorization
     */
    check(resource: string, action: PermissionAction, context: AuthorizationContext): Promise<AuthorizationResult>;
    /**
     * Enforce authorization (throws if denied)
     */
    enforce(resource: string, action: PermissionAction, context: AuthorizationContext): Promise<void>;
    /**
     * Get context from current tenant
     */
    getContextFromTenant(): AuthorizationContext;
}
/**
 * Authorization error
 */
export declare class AuthorizationError extends Error {
    resource: string;
    action: PermissionAction;
    constructor(message: string, resource: string, action: PermissionAction);
}
export declare const authz: AuthorizationManager;
/**
 * tRPC authorization middleware
 */
export declare const requirePermission: (resource: string, action: PermissionAction) => (opts: {
    ctx: {
        userId?: string;
    };
    next: () => Promise<unknown>;
}) => Promise<unknown>;
export declare const defaultRoles: Role[];
//# sourceMappingURL=authorization.d.ts.map