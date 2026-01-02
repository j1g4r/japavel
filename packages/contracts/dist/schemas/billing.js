import { z } from 'zod';
/**
 * Billing & Subscription Schemas
 * Core schemas for SaaS billing and subscription management
 */
// Currency codes (ISO 4217)
export const CurrencySchema = z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']);
// Billing interval
export const BillingIntervalSchema = z.enum(['monthly', 'yearly', 'quarterly', 'one-time']);
// Subscription status
export const SubscriptionStatusSchema = z.enum([
    'active',
    'trialing',
    'past_due',
    'cancelled',
    'paused',
    'unpaid',
    'incomplete',
]);
// Invoice status
export const InvoiceStatusSchema = z.enum([
    'draft',
    'open',
    'paid',
    'void',
    'uncollectible',
]);
// Payment method type
export const PaymentMethodTypeSchema = z.enum([
    'card',
    'bank_account',
    'paypal',
    'invoice',
]);
// Price schema
export const PriceSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    name: z.string(),
    amount: z.number().int().min(0), // Amount in cents
    currency: CurrencySchema.default('USD'),
    interval: BillingIntervalSchema,
    intervalCount: z.number().int().min(1).default(1),
    trialDays: z.number().int().min(0).default(0),
    active: z.boolean().default(true),
    metadata: z.record(z.unknown()).default({}),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Product schema
export const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    features: z.array(z.string()).default([]),
    limits: z.object({
        users: z.number().int().min(-1).default(-1), // -1 = unlimited
        storage: z.number().int().min(-1).default(-1), // In bytes, -1 = unlimited
        apiCalls: z.number().int().min(-1).default(-1), // Per month, -1 = unlimited
        projects: z.number().int().min(-1).default(-1),
    }).default({}),
    active: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
    metadata: z.record(z.unknown()).default({}),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Subscription schema
export const SubscriptionSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    customerId: z.string(), // External payment provider customer ID
    priceId: z.string().uuid(),
    productId: z.string().uuid(),
    status: SubscriptionStatusSchema.default('active'),
    quantity: z.number().int().min(1).default(1),
    currentPeriodStart: z.date(),
    currentPeriodEnd: z.date(),
    cancelAtPeriodEnd: z.boolean().default(false),
    cancelledAt: z.date().optional(),
    trialStart: z.date().optional(),
    trialEnd: z.date().optional(),
    metadata: z.record(z.unknown()).default({}),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Invoice line item
export const InvoiceLineItemSchema = z.object({
    id: z.string().uuid(),
    description: z.string(),
    quantity: z.number().int().min(1).default(1),
    unitAmount: z.number().int(), // Amount in cents
    amount: z.number().int(), // Total amount in cents
    priceId: z.string().uuid().optional(),
    periodStart: z.date().optional(),
    periodEnd: z.date().optional(),
});
// Invoice schema
export const InvoiceSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    subscriptionId: z.string().uuid().optional(),
    number: z.string(),
    status: InvoiceStatusSchema.default('draft'),
    currency: CurrencySchema.default('USD'),
    subtotal: z.number().int(), // Amount in cents
    tax: z.number().int().default(0),
    total: z.number().int(),
    amountPaid: z.number().int().default(0),
    amountDue: z.number().int(),
    lines: z.array(InvoiceLineItemSchema).default([]),
    dueDate: z.date().optional(),
    paidAt: z.date().optional(),
    hostedInvoiceUrl: z.string().url().optional(),
    invoicePdf: z.string().url().optional(),
    metadata: z.record(z.unknown()).default({}),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Payment method schema
export const PaymentMethodSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    type: PaymentMethodTypeSchema,
    isDefault: z.boolean().default(false),
    card: z.object({
        brand: z.string(),
        last4: z.string().length(4),
        expMonth: z.number().int().min(1).max(12),
        expYear: z.number().int(),
    }).optional(),
    billingDetails: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.object({
            line1: z.string().optional(),
            line2: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string().optional(),
        }).optional(),
    }).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Usage record schema (for metered billing)
export const UsageRecordSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    subscriptionId: z.string().uuid(),
    metricName: z.string(),
    quantity: z.number().min(0),
    timestamp: z.date(),
    idempotencyKey: z.string().optional(),
    metadata: z.record(z.unknown()).default({}),
    createdAt: z.date(),
});
// Coupon schema
export const CouponSchema = z.object({
    id: z.string().uuid(),
    code: z.string().min(3).max(20).toUpperCase(),
    name: z.string(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().min(0), // Percentage (0-100) or fixed amount in cents
    currency: CurrencySchema.optional(), // Required for fixed discounts
    maxRedemptions: z.number().int().min(0).optional(), // null = unlimited
    redemptionCount: z.number().int().min(0).default(0),
    validFrom: z.date().optional(),
    validUntil: z.date().optional(),
    applicableProducts: z.array(z.string().uuid()).default([]), // Empty = all products
    active: z.boolean().default(true),
    metadata: z.record(z.unknown()).default({}),
    createdAt: z.date(),
    updatedAt: z.date(),
});
