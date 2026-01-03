import { z } from 'zod';
/**
 * Compliance Helpers
 * Utilities for GDPR, SOC2, HIPAA, and other compliance requirements
 */
export declare const DataClassificationSchema: z.ZodEnum<["public", "internal", "confidential", "restricted", "pii", "phi", "financial"]>;
export type DataClassification = z.infer<typeof DataClassificationSchema>;
export declare const RetentionPolicySchema: z.ZodObject<{
    classification: z.ZodEnum<["public", "internal", "confidential", "restricted", "pii", "phi", "financial"]>;
    retentionDays: z.ZodNumber;
    deleteAfterRetention: z.ZodDefault<z.ZodBoolean>;
    archiveBeforeDelete: z.ZodDefault<z.ZodBoolean>;
    legalHoldExempt: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    classification: "public" | "internal" | "confidential" | "restricted" | "pii" | "phi" | "financial";
    retentionDays: number;
    deleteAfterRetention: boolean;
    archiveBeforeDelete: boolean;
    legalHoldExempt: boolean;
}, {
    classification: "public" | "internal" | "confidential" | "restricted" | "pii" | "phi" | "financial";
    retentionDays: number;
    deleteAfterRetention?: boolean | undefined;
    archiveBeforeDelete?: boolean | undefined;
    legalHoldExempt?: boolean | undefined;
}>;
export type RetentionPolicy = z.infer<typeof RetentionPolicySchema>;
export declare const ConsentRecordSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    tenantId: z.ZodOptional<z.ZodString>;
    purpose: z.ZodString;
    version: z.ZodString;
    granted: z.ZodBoolean;
    grantedAt: z.ZodOptional<z.ZodDate>;
    revokedAt: z.ZodOptional<z.ZodDate>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    source: z.ZodString;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    metadata: Record<string, unknown>;
    version: string;
    source: string;
    purpose: string;
    granted: boolean;
    tenantId?: string | undefined;
    expiresAt?: Date | undefined;
    userAgent?: string | undefined;
    revokedAt?: Date | undefined;
    grantedAt?: Date | undefined;
    ipAddress?: string | undefined;
}, {
    id: string;
    userId: string;
    version: string;
    source: string;
    purpose: string;
    granted: boolean;
    tenantId?: string | undefined;
    expiresAt?: Date | undefined;
    userAgent?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    revokedAt?: Date | undefined;
    grantedAt?: Date | undefined;
    ipAddress?: string | undefined;
}>;
export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;
export declare const DSRTypeSchema: z.ZodEnum<["access", "rectification", "erasure", "portability", "restriction", "objection"]>;
export type DSRType = z.infer<typeof DSRTypeSchema>;
export declare const DSRStatusSchema: z.ZodEnum<["pending", "in_progress", "completed", "rejected", "cancelled"]>;
export type DSRStatus = z.infer<typeof DSRStatusSchema>;
export declare const DataSubjectRequestSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    tenantId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["access", "rectification", "erasure", "portability", "restriction", "objection"]>;
    status: z.ZodDefault<z.ZodEnum<["pending", "in_progress", "completed", "rejected", "cancelled"]>>;
    description: z.ZodOptional<z.ZodString>;
    verificationMethod: z.ZodString;
    verifiedAt: z.ZodOptional<z.ZodDate>;
    deadline: z.ZodDate;
    completedAt: z.ZodOptional<z.ZodDate>;
    response: z.ZodOptional<z.ZodString>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    assignedTo: z.ZodOptional<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    createdAt: Date;
    type: "access" | "rectification" | "erasure" | "portability" | "restriction" | "objection";
    status: "pending" | "cancelled" | "completed" | "in_progress" | "rejected";
    metadata: Record<string, unknown>;
    updatedAt: Date;
    verificationMethod: string;
    deadline: Date;
    attachments: string[];
    tenantId?: string | undefined;
    description?: string | undefined;
    completedAt?: Date | undefined;
    verifiedAt?: Date | undefined;
    response?: string | undefined;
    assignedTo?: string | undefined;
}, {
    id: string;
    userId: string;
    createdAt: Date;
    type: "access" | "rectification" | "erasure" | "portability" | "restriction" | "objection";
    updatedAt: Date;
    verificationMethod: string;
    deadline: Date;
    tenantId?: string | undefined;
    status?: "pending" | "cancelled" | "completed" | "in_progress" | "rejected" | undefined;
    metadata?: Record<string, unknown> | undefined;
    description?: string | undefined;
    completedAt?: Date | undefined;
    verifiedAt?: Date | undefined;
    response?: string | undefined;
    attachments?: string[] | undefined;
    assignedTo?: string | undefined;
}>;
export type DataSubjectRequest = z.infer<typeof DataSubjectRequestSchema>;
export declare const ComplianceFrameworkSchema: z.ZodEnum<["gdpr", "ccpa", "hipaa", "soc2", "pci_dss", "iso27001"]>;
export type ComplianceFramework = z.infer<typeof ComplianceFrameworkSchema>;
/**
 * GDPR Compliance Service
 */
export declare class GDPRComplianceService {
    private consents;
    private dsrs;
    /**
     * Record consent
     */
    recordConsent(consent: Omit<ConsentRecord, 'id'>): Promise<ConsentRecord>;
    /**
     * Check if user has valid consent
     */
    hasValidConsent(userId: string, purpose: string): boolean;
    /**
     * Get all consents for a user
     */
    getUserConsents(userId: string): ConsentRecord[];
    /**
     * Revoke consent
     */
    revokeConsent(userId: string, purpose: string): Promise<boolean>;
    /**
     * Create data subject request
     */
    createDSR(request: Omit<DataSubjectRequest, 'id' | 'createdAt' | 'updatedAt' | 'deadline'>): Promise<DataSubjectRequest>;
    /**
     * Get DSR by ID
     */
    getDSR(id: string): DataSubjectRequest | undefined;
    /**
     * Update DSR status
     */
    updateDSRStatus(id: string, status: DSRStatus, response?: string): Promise<DataSubjectRequest | null>;
    /**
     * Get pending DSRs approaching deadline
     */
    getPendingDSRs(daysUntilDeadline?: number): DataSubjectRequest[];
    /**
     * Export user data (for data portability)
     */
    exportUserData(userId: string, dataCollectors: Array<{
        name: string;
        collect: (userId: string) => Promise<Record<string, unknown>>;
    }>): Promise<Record<string, unknown>>;
    /**
     * Delete user data (right to erasure)
     */
    deleteUserData(userId: string, dataDeleters: Array<{
        name: string;
        delete: (userId: string) => Promise<void>;
    }>): Promise<{
        success: boolean;
        errors: string[];
    }>;
}
/**
 * Data Classification Service
 */
export declare class DataClassificationService {
    private classifications;
    private retentionPolicies;
    /**
     * Set classification for a field/table
     */
    setClassification(identifier: string, classification: DataClassification): void;
    /**
     * Get classification for a field/table
     */
    getClassification(identifier: string): DataClassification;
    /**
     * Set retention policy for a classification
     */
    setRetentionPolicy(policy: RetentionPolicy): void;
    /**
     * Get retention policy for a classification
     */
    getRetentionPolicy(classification: DataClassification): RetentionPolicy | undefined;
    /**
     * Check if data access is allowed based on classification
     */
    isAccessAllowed(identifier: string, userClearance: DataClassification[]): boolean;
}
/**
 * Compliance Checklist
 */
export interface ComplianceCheck {
    id: string;
    framework: ComplianceFramework;
    requirement: string;
    description: string;
    status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
    evidence?: string;
    lastChecked?: Date;
    nextReview?: Date;
    owner?: string;
}
export declare class ComplianceChecklistService {
    private checks;
    /**
     * Add compliance check
     */
    addCheck(check: ComplianceCheck): void;
    /**
     * Update check status
     */
    updateCheckStatus(id: string, status: ComplianceCheck['status'], evidence?: string): ComplianceCheck | undefined;
    /**
     * Get compliance summary by framework
     */
    getSummary(framework: ComplianceFramework): {
        total: number;
        compliant: number;
        nonCompliant: number;
        partial: number;
        notApplicable: number;
        compliancePercentage: number;
    };
    /**
     * Get checks needing review
     */
    getChecksNeedingReview(): ComplianceCheck[];
}
export declare const gdprCompliance: GDPRComplianceService;
export declare const dataClassification: DataClassificationService;
export declare const complianceChecklist: ComplianceChecklistService;
//# sourceMappingURL=compliance.d.ts.map