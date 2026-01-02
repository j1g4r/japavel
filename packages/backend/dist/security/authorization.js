import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getTenantContext } from '../tenancy/context';
/**
 * Authorization System (RBAC + ABAC)
 * Role-Based and Attribute-Based Access Control
 */
// Permission action
export const PermissionActionSchema = z.enum([
    'create',
    'read',
    'update',
    'delete',
    'list',
    'manage',
    '*', // All actions
]);
// Permission schema
export const PermissionSchema = z.object({
    resource: z.string(),
    action: PermissionActionSchema,
    conditions: z.record(z.unknown()).optional(),
});
// Role schema
export const RoleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    permissions: z.array(PermissionSchema),
    inherits: z.array(z.string()).default([]),
    isSystem: z.boolean().default(false),
    metadata: z.record(z.unknown()).default({}),
});
// Policy schema (for ABAC)
export const PolicySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    effect: z.enum(['allow', 'deny']),
    resources: z.array(z.string()),
    actions: z.array(PermissionActionSchema),
    conditions: z.array(z.object({
        field: z.string(),
        operator: z.enum([
            'equals',
            'not_equals',
            'in',
            'not_in',
            'contains',
            'starts_with',
            'ends_with',
            'greater_than',
            'less_than',
            'matches', // regex
        ]),
        value: z.unknown(),
    })),
    priority: z.number().int().default(0),
});
/**
 * Role-Based Access Control Manager
 */
export class RBACManager {
    roles = new Map();
    /**
     * Register a role
     */
    registerRole(role) {
        this.roles.set(role.id, RoleSchema.parse(role));
    }
    /**
     * Register multiple roles
     */
    registerRoles(roles) {
        for (const role of roles) {
            this.registerRole(role);
        }
    }
    /**
     * Get role by ID
     */
    getRole(roleId) {
        return this.roles.get(roleId);
    }
    /**
     * Get all permissions for a role (including inherited)
     */
    getRolePermissions(roleId, visited = new Set()) {
        if (visited.has(roleId))
            return []; // Prevent circular inheritance
        visited.add(roleId);
        const role = this.roles.get(roleId);
        if (!role)
            return [];
        const permissions = [...role.permissions];
        // Include inherited permissions
        for (const inheritedRoleId of role.inherits) {
            permissions.push(...this.getRolePermissions(inheritedRoleId, visited));
        }
        return permissions;
    }
    /**
     * Check if a role has permission
     */
    hasPermission(roleId, resource, action) {
        const permissions = this.getRolePermissions(roleId);
        return permissions.some(p => {
            const resourceMatch = p.resource === '*' || p.resource === resource ||
                (p.resource.endsWith('*') && resource.startsWith(p.resource.slice(0, -1)));
            const actionMatch = p.action === '*' || p.action === action;
            return resourceMatch && actionMatch;
        });
    }
    /**
     * Check if any of the roles has permission
     */
    anyRoleHasPermission(roleIds, resource, action) {
        for (const roleId of roleIds) {
            if (this.hasPermission(roleId, resource, action)) {
                return { allowed: true, matchedRole: roleId };
            }
        }
        return { allowed: false };
    }
}
/**
 * Attribute-Based Access Control Manager
 */
export class ABACManager {
    policies = [];
    /**
     * Add a policy
     */
    addPolicy(policy) {
        this.policies.push(PolicySchema.parse(policy));
        // Sort by priority (higher priority first)
        this.policies.sort((a, b) => b.priority - a.priority);
    }
    /**
     * Add multiple policies
     */
    addPolicies(policies) {
        for (const policy of policies) {
            this.addPolicy(policy);
        }
    }
    /**
     * Evaluate policies for a request
     */
    evaluate(resource, action, context) {
        for (const policy of this.policies) {
            // Check if policy applies to this resource
            const resourceMatch = policy.resources.some(r => r === '*' || r === resource ||
                (r.endsWith('*') && resource.startsWith(r.slice(0, -1))));
            if (!resourceMatch)
                continue;
            // Check if policy applies to this action
            const actionMatch = policy.actions.includes('*') ||
                policy.actions.includes(action);
            if (!actionMatch)
                continue;
            // Evaluate conditions
            const conditionsMet = this.evaluateConditions(policy.conditions, context);
            if (conditionsMet) {
                return {
                    allowed: policy.effect === 'allow',
                    matchedPolicy: policy.id,
                    reason: `Policy ${policy.name}: ${policy.effect}`,
                };
            }
        }
        // Default deny if no policy matched
        return {
            allowed: false,
            reason: 'No matching policy found',
        };
    }
    /**
     * Evaluate policy conditions
     */
    evaluateConditions(conditions, context) {
        return conditions.every(condition => {
            const fieldValue = this.getFieldValue(condition.field, context);
            return this.evaluateCondition(condition.operator, fieldValue, condition.value);
        });
    }
    /**
     * Get field value from context
     */
    getFieldValue(field, context) {
        const parts = field.split('.');
        let value = context;
        for (const part of parts) {
            if (value === null || value === undefined)
                return undefined;
            value = value[part];
        }
        return value;
    }
    /**
     * Evaluate a single condition
     */
    evaluateCondition(operator, fieldValue, conditionValue) {
        switch (operator) {
            case 'equals':
                return fieldValue === conditionValue;
            case 'not_equals':
                return fieldValue !== conditionValue;
            case 'in':
                return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
            case 'not_in':
                return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
            case 'contains':
                return String(fieldValue).includes(String(conditionValue));
            case 'starts_with':
                return String(fieldValue).startsWith(String(conditionValue));
            case 'ends_with':
                return String(fieldValue).endsWith(String(conditionValue));
            case 'greater_than':
                return Number(fieldValue) > Number(conditionValue);
            case 'less_than':
                return Number(fieldValue) < Number(conditionValue);
            case 'matches':
                return new RegExp(String(conditionValue)).test(String(fieldValue));
            default:
                return false;
        }
    }
}
/**
 * Combined Authorization Manager
 */
export class AuthorizationManager {
    rbac = new RBACManager();
    abac = new ABACManager();
    /**
     * Register roles
     */
    registerRoles(roles) {
        this.rbac.registerRoles(roles);
    }
    /**
     * Add policies
     */
    addPolicies(policies) {
        this.abac.addPolicies(policies);
    }
    /**
     * Check authorization
     */
    async check(resource, action, context) {
        // Check RBAC first
        const rbacResult = this.rbac.anyRoleHasPermission(context.roles, resource, action);
        if (rbacResult.allowed) {
            // If RBAC allows, check ABAC for potential deny
            const abacResult = this.abac.evaluate(resource, action, context);
            // ABAC deny overrides RBAC allow
            if (!abacResult.allowed && abacResult.matchedPolicy) {
                return {
                    allowed: false,
                    reason: abacResult.reason,
                    matchedPolicy: abacResult.matchedPolicy,
                };
            }
            return {
                allowed: true,
                reason: `Allowed by role: ${rbacResult.matchedRole}`,
                matchedRole: rbacResult.matchedRole,
            };
        }
        // Check ABAC as fallback
        const abacResult = this.abac.evaluate(resource, action, context);
        return {
            allowed: abacResult.allowed,
            reason: abacResult.reason,
            matchedPolicy: abacResult.matchedPolicy,
        };
    }
    /**
     * Enforce authorization (throws if denied)
     */
    async enforce(resource, action, context) {
        const result = await this.check(resource, action, context);
        if (!result.allowed) {
            throw new AuthorizationError(`Access denied: ${result.reason}`, resource, action);
        }
    }
    /**
     * Get context from current tenant
     */
    getContextFromTenant() {
        const tenantContext = getTenantContext();
        return {
            userId: tenantContext?.userId,
            tenantId: tenantContext?.tenantId,
            roles: tenantContext?.role ? [tenantContext.role] : [],
            attributes: {
                permissions: tenantContext?.permissions || [],
                tenantPlan: tenantContext?.tenant?.plan,
                tenantStatus: tenantContext?.tenant?.status,
            },
        };
    }
}
/**
 * Authorization error
 */
export class AuthorizationError extends Error {
    resource;
    action;
    constructor(message, resource, action) {
        super(message);
        this.resource = resource;
        this.action = action;
        this.name = 'AuthorizationError';
    }
}
// Global authorization manager
export const authz = new AuthorizationManager();
/**
 * tRPC authorization middleware
 */
export const requirePermission = (resource, action) => {
    return async (opts) => {
        const context = authz.getContextFromTenant();
        const result = await authz.check(resource, action, context);
        if (!result.allowed) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: result.reason,
            });
        }
        return opts.next();
    };
};
// Default roles
export const defaultRoles = [
    {
        metadata: {},
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Full system access',
        permissions: [{ resource: '*', action: '*' }],
        inherits: [],
        isSystem: true,
    },
    {
        metadata: {},
        id: 'tenant_owner',
        name: 'Tenant Owner',
        description: 'Full tenant access',
        permissions: [
            { resource: 'tenant:*', action: '*' },
            { resource: 'user:*', action: '*' },
            { resource: 'billing:*', action: '*' },
            { resource: 'settings:*', action: '*' },
        ],
        inherits: ['tenant_admin'],
        isSystem: true,
    },
    {
        metadata: {},
        id: 'tenant_admin',
        name: 'Tenant Admin',
        description: 'Tenant administration',
        permissions: [
            { resource: 'user:*', action: 'manage' },
            { resource: 'settings:*', action: '*' },
        ],
        inherits: ['member'],
        isSystem: true,
    },
    {
        metadata: {},
        id: 'member',
        name: 'Member',
        description: 'Standard member access',
        permissions: [
            { resource: 'user:self', action: 'read' },
            { resource: 'user:self', action: 'update' },
        ],
        inherits: [],
        isSystem: true,
    },
    {
        metadata: {},
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access',
        permissions: [
            { resource: '*', action: 'read' },
            { resource: '*', action: 'list' },
        ],
        inherits: [],
        isSystem: true,
    },
];
// Initialize with default roles
authz.registerRoles(defaultRoles);
