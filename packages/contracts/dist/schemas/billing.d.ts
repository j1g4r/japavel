import { z } from 'zod';
/**
 * Billing & Subscription Schemas
 * Core schemas for SaaS billing and subscription management
 */
export declare const CurrencySchema: z.ZodEnum<["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]>;
export type Currency = z.infer<typeof CurrencySchema>;
export declare const BillingIntervalSchema: z.ZodEnum<["monthly", "yearly", "quarterly", "one-time"]>;
export type BillingInterval = z.infer<typeof BillingIntervalSchema>;
export declare const SubscriptionStatusSchema: z.ZodEnum<["active", "trialing", "past_due", "cancelled", "paused", "unpaid", "incomplete"]>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export declare const InvoiceStatusSchema: z.ZodEnum<["draft", "open", "paid", "void", "uncollectible"]>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;
export declare const PaymentMethodTypeSchema: z.ZodEnum<["card", "bank_account", "paypal", "invoice"]>;
export type PaymentMethodType = z.infer<typeof PaymentMethodTypeSchema>;
export declare const PriceSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    name: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]>>;
    interval: z.ZodEnum<["monthly", "yearly", "quarterly", "one-time"]>;
    intervalCount: z.ZodDefault<z.ZodNumber>;
    trialDays: z.ZodDefault<z.ZodNumber>;
    active: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
    metadata: Record<string, unknown>;
    productId: string;
    amount: number;
    currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";
    interval: "monthly" | "yearly" | "quarterly" | "one-time";
    intervalCount: number;
    trialDays: number;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    amount: number;
    interval: "monthly" | "yearly" | "quarterly" | "one-time";
    active?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    currency?: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | undefined;
    intervalCount?: number | undefined;
    trialDays?: number | undefined;
}>;
export type Price = z.infer<typeof PriceSchema>;
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    features: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    limits: z.ZodDefault<z.ZodObject<{
        users: z.ZodDefault<z.ZodNumber>;
        storage: z.ZodDefault<z.ZodNumber>;
        apiCalls: z.ZodDefault<z.ZodNumber>;
        projects: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        users: number;
        storage: number;
        apiCalls: number;
        projects: number;
    }, {
        users?: number | undefined;
        storage?: number | undefined;
        apiCalls?: number | undefined;
        projects?: number | undefined;
    }>>;
    active: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
    features: string[];
    metadata: Record<string, unknown>;
    limits: {
        users: number;
        storage: number;
        apiCalls: number;
        projects: number;
    };
    sortOrder: number;
    description?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    active?: boolean | undefined;
    features?: string[] | undefined;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    limits?: {
        users?: number | undefined;
        storage?: number | undefined;
        apiCalls?: number | undefined;
        projects?: number | undefined;
    } | undefined;
    sortOrder?: number | undefined;
}>;
export type Product = z.infer<typeof ProductSchema>;
export declare const SubscriptionSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    customerId: z.ZodString;
    priceId: z.ZodString;
    productId: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["active", "trialing", "past_due", "cancelled", "paused", "unpaid", "incomplete"]>>;
    quantity: z.ZodDefault<z.ZodNumber>;
    currentPeriodStart: z.ZodDate;
    currentPeriodEnd: z.ZodDate;
    cancelAtPeriodEnd: z.ZodDefault<z.ZodBoolean>;
    cancelledAt: z.ZodOptional<z.ZodDate>;
    trialStart: z.ZodOptional<z.ZodDate>;
    trialEnd: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: "active" | "cancelled" | "trialing" | "past_due" | "paused" | "unpaid" | "incomplete";
    metadata: Record<string, unknown>;
    tenantId: string;
    productId: string;
    customerId: string;
    priceId: string;
    quantity: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    cancelledAt?: Date | undefined;
    trialStart?: Date | undefined;
    trialEnd?: Date | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
    productId: string;
    customerId: string;
    priceId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    status?: "active" | "cancelled" | "trialing" | "past_due" | "paused" | "unpaid" | "incomplete" | undefined;
    metadata?: Record<string, unknown> | undefined;
    quantity?: number | undefined;
    cancelAtPeriodEnd?: boolean | undefined;
    cancelledAt?: Date | undefined;
    trialStart?: Date | undefined;
    trialEnd?: Date | undefined;
}>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export declare const InvoiceLineItemSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
    unitAmount: z.ZodNumber;
    amount: z.ZodNumber;
    priceId: z.ZodOptional<z.ZodString>;
    periodStart: z.ZodOptional<z.ZodDate>;
    periodEnd: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    amount: number;
    description: string;
    quantity: number;
    unitAmount: number;
    priceId?: string | undefined;
    periodStart?: Date | undefined;
    periodEnd?: Date | undefined;
}, {
    id: string;
    amount: number;
    description: string;
    unitAmount: number;
    priceId?: string | undefined;
    quantity?: number | undefined;
    periodStart?: Date | undefined;
    periodEnd?: Date | undefined;
}>;
export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;
export declare const InvoiceSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    subscriptionId: z.ZodOptional<z.ZodString>;
    number: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["draft", "open", "paid", "void", "uncollectible"]>>;
    currency: z.ZodDefault<z.ZodEnum<["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]>>;
    subtotal: z.ZodNumber;
    tax: z.ZodDefault<z.ZodNumber>;
    total: z.ZodNumber;
    amountPaid: z.ZodDefault<z.ZodNumber>;
    amountDue: z.ZodNumber;
    lines: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        quantity: z.ZodDefault<z.ZodNumber>;
        unitAmount: z.ZodNumber;
        amount: z.ZodNumber;
        priceId: z.ZodOptional<z.ZodString>;
        periodStart: z.ZodOptional<z.ZodDate>;
        periodEnd: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        amount: number;
        description: string;
        quantity: number;
        unitAmount: number;
        priceId?: string | undefined;
        periodStart?: Date | undefined;
        periodEnd?: Date | undefined;
    }, {
        id: string;
        amount: number;
        description: string;
        unitAmount: number;
        priceId?: string | undefined;
        quantity?: number | undefined;
        periodStart?: Date | undefined;
        periodEnd?: Date | undefined;
    }>, "many">>;
    dueDate: z.ZodOptional<z.ZodDate>;
    paidAt: z.ZodOptional<z.ZodDate>;
    hostedInvoiceUrl: z.ZodOptional<z.ZodString>;
    invoicePdf: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    number: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: "draft" | "open" | "paid" | "void" | "uncollectible";
    metadata: Record<string, unknown>;
    tenantId: string;
    currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";
    subtotal: number;
    tax: number;
    total: number;
    amountPaid: number;
    amountDue: number;
    lines: {
        id: string;
        amount: number;
        description: string;
        quantity: number;
        unitAmount: number;
        priceId?: string | undefined;
        periodStart?: Date | undefined;
        periodEnd?: Date | undefined;
    }[];
    subscriptionId?: string | undefined;
    dueDate?: Date | undefined;
    paidAt?: Date | undefined;
    hostedInvoiceUrl?: string | undefined;
    invoicePdf?: string | undefined;
}, {
    number: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
    subtotal: number;
    total: number;
    amountDue: number;
    status?: "draft" | "open" | "paid" | "void" | "uncollectible" | undefined;
    metadata?: Record<string, unknown> | undefined;
    currency?: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | undefined;
    subscriptionId?: string | undefined;
    tax?: number | undefined;
    amountPaid?: number | undefined;
    lines?: {
        id: string;
        amount: number;
        description: string;
        unitAmount: number;
        priceId?: string | undefined;
        quantity?: number | undefined;
        periodStart?: Date | undefined;
        periodEnd?: Date | undefined;
    }[] | undefined;
    dueDate?: Date | undefined;
    paidAt?: Date | undefined;
    hostedInvoiceUrl?: string | undefined;
    invoicePdf?: string | undefined;
}>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export declare const PaymentMethodSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    type: z.ZodEnum<["card", "bank_account", "paypal", "invoice"]>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    card: z.ZodOptional<z.ZodObject<{
        brand: z.ZodString;
        last4: z.ZodString;
        expMonth: z.ZodNumber;
        expYear: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    }, {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    }>>;
    billingDetails: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodObject<{
            line1: z.ZodOptional<z.ZodString>;
            line2: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            postalCode: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            line1?: string | undefined;
            line2?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            postalCode?: string | undefined;
            country?: string | undefined;
        }, {
            line1?: string | undefined;
            line2?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            postalCode?: string | undefined;
            country?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: {
            line1?: string | undefined;
            line2?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            postalCode?: string | undefined;
            country?: string | undefined;
        } | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: {
            line1?: string | undefined;
            line2?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            postalCode?: string | undefined;
            country?: string | undefined;
        } | undefined;
    }>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: "card" | "bank_account" | "paypal" | "invoice";
    tenantId: string;
    isDefault: boolean;
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    } | undefined;
    billingDetails?: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: {
            line1?: string | undefined;
            line2?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            postalCode?: string | undefined;
            country?: string | undefined;
        } | undefined;
    } | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: "card" | "bank_account" | "paypal" | "invoice";
    tenantId: string;
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    } | undefined;
    isDefault?: boolean | undefined;
    billingDetails?: {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        address?: {
            line1?: string | undefined;
            line2?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            postalCode?: string | undefined;
            country?: string | undefined;
        } | undefined;
    } | undefined;
}>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export declare const UsageRecordSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    subscriptionId: z.ZodString;
    metricName: z.ZodString;
    quantity: z.ZodNumber;
    timestamp: z.ZodDate;
    idempotencyKey: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    metadata: Record<string, unknown>;
    tenantId: string;
    quantity: number;
    subscriptionId: string;
    metricName: string;
    timestamp: Date;
    idempotencyKey?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    tenantId: string;
    quantity: number;
    subscriptionId: string;
    metricName: string;
    timestamp: Date;
    metadata?: Record<string, unknown> | undefined;
    idempotencyKey?: string | undefined;
}>;
export type UsageRecord = z.infer<typeof UsageRecordSchema>;
export declare const CouponSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    discountType: z.ZodEnum<["percentage", "fixed"]>;
    discountValue: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]>>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    redemptionCount: z.ZodDefault<z.ZodNumber>;
    validFrom: z.ZodOptional<z.ZodDate>;
    validUntil: z.ZodOptional<z.ZodDate>;
    applicableProducts: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    active: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    active: boolean;
    metadata: Record<string, unknown>;
    discountType: "percentage" | "fixed";
    discountValue: number;
    redemptionCount: number;
    applicableProducts: string[];
    currency?: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | undefined;
    maxRedemptions?: number | undefined;
    validFrom?: Date | undefined;
    validUntil?: Date | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    active?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    currency?: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | undefined;
    maxRedemptions?: number | undefined;
    redemptionCount?: number | undefined;
    validFrom?: Date | undefined;
    validUntil?: Date | undefined;
    applicableProducts?: string[] | undefined;
}>;
export type Coupon = z.infer<typeof CouponSchema>;
//# sourceMappingURL=billing.d.ts.map