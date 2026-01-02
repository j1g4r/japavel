import { z } from 'zod';
import { auditLogger } from '../saas/audit-log';

/**
 * Compliance Helpers
 * Utilities for GDPR, SOC2, HIPAA, and other compliance requirements
 */

// Data classification levels
export const DataClassificationSchema = z.enum([
  'public',
  'internal',
  'confidential',
  'restricted',
  'pii',       // Personally Identifiable Information
  'phi',       // Protected Health Information
  'financial', // Financial data
]);

export type DataClassification = z.infer<typeof DataClassificationSchema>;

// Data retention policy
export const RetentionPolicySchema = z.object({
  classification: DataClassificationSchema,
  retentionDays: z.number().int().min(1),
  deleteAfterRetention: z.boolean().default(true),
  archiveBeforeDelete: z.boolean().default(false),
  legalHoldExempt: z.boolean().default(false),
});

export type RetentionPolicy = z.infer<typeof RetentionPolicySchema>;

// Consent record
export const ConsentRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  purpose: z.string(),
  version: z.string(),
  granted: z.boolean(),
  grantedAt: z.date().optional(),
  revokedAt: z.date().optional(),
  expiresAt: z.date().optional(),
  source: z.string(), // How consent was obtained
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
});

export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

// Data subject request types (GDPR)
export const DSRTypeSchema = z.enum([
  'access',      // Right to access
  'rectification', // Right to rectification
  'erasure',     // Right to erasure (right to be forgotten)
  'portability', // Right to data portability
  'restriction', // Right to restrict processing
  'objection',   // Right to object
]);

export type DSRType = z.infer<typeof DSRTypeSchema>;

// Data subject request status
export const DSRStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'rejected',
  'cancelled',
]);

export type DSRStatus = z.infer<typeof DSRStatusSchema>;

// Data subject request
export const DataSubjectRequestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  type: DSRTypeSchema,
  status: DSRStatusSchema.default('pending'),
  description: z.string().optional(),
  verificationMethod: z.string(),
  verifiedAt: z.date().optional(),
  deadline: z.date(), // Must respond within 30 days under GDPR
  completedAt: z.date().optional(),
  response: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  assignedTo: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DataSubjectRequest = z.infer<typeof DataSubjectRequestSchema>;

// Compliance framework
export const ComplianceFrameworkSchema = z.enum([
  'gdpr',
  'ccpa',
  'hipaa',
  'soc2',
  'pci_dss',
  'iso27001',
]);

export type ComplianceFramework = z.infer<typeof ComplianceFrameworkSchema>;

/**
 * GDPR Compliance Service
 */
export class GDPRComplianceService {
  private consents: ConsentRecord[] = [];
  private dsrs: DataSubjectRequest[] = [];

  /**
   * Record consent
   */
  async recordConsent(consent: Omit<ConsentRecord, 'id'>): Promise<ConsentRecord> {
    const record: ConsentRecord = {
      ...consent,
      id: crypto.randomUUID(),
    };

    this.consents.push(record);

    await auditLogger.log({
      category: 'data',
      action: 'consent.recorded',
      description: `Consent ${consent.granted ? 'granted' : 'revoked'} for ${consent.purpose}`,
      outcome: 'success',
      severity: 'info',
      actor: { type: 'user', id: consent.userId },
      tenantId: consent.tenantId,
      resource: { type: 'consent', id: record.id },
      metadata: { purpose: consent.purpose, granted: consent.granted },
    });

    return record;
  }

  /**
   * Check if user has valid consent
   */
  hasValidConsent(userId: string, purpose: string): boolean {
    const consent = this.consents
      .filter(c => c.userId === userId && c.purpose === purpose)
      .sort((a, b) => (b.grantedAt?.getTime() || 0) - (a.grantedAt?.getTime() || 0))[0];

    if (!consent || !consent.granted) return false;
    if (consent.revokedAt) return false;
    if (consent.expiresAt && new Date() > consent.expiresAt) return false;

    return true;
  }

  /**
   * Get all consents for a user
   */
  getUserConsents(userId: string): ConsentRecord[] {
    return this.consents.filter(c => c.userId === userId);
  }

  /**
   * Revoke consent
   */
  async revokeConsent(userId: string, purpose: string): Promise<boolean> {
    const consent = this.consents.find(
      c => c.userId === userId && c.purpose === purpose && c.granted && !c.revokedAt
    );

    if (!consent) return false;

    consent.revokedAt = new Date();
    consent.granted = false;

    await auditLogger.log({
      category: 'data',
      action: 'consent.revoked',
      description: `Consent revoked for ${purpose}`,
      outcome: 'success',
      severity: 'info',
      actor: { type: 'user', id: userId },
      resource: { type: 'consent', id: consent.id },
    });

    return true;
  }

  /**
   * Create data subject request
   */
  async createDSR(
    request: Omit<DataSubjectRequest, 'id' | 'createdAt' | 'updatedAt' | 'deadline'>
  ): Promise<DataSubjectRequest> {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30); // 30-day deadline

    const dsr: DataSubjectRequest = {
      ...request,
      id: crypto.randomUUID(),
      deadline,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.dsrs.push(dsr);

    await auditLogger.log({
      category: 'data',
      action: `dsr.${request.type}.created`,
      description: `Data subject request created: ${request.type}`,
      outcome: 'success',
      severity: 'info',
      actor: { type: 'user', id: request.userId },
      tenantId: request.tenantId,
      resource: { type: 'dsr', id: dsr.id },
    });

    return dsr;
  }

  /**
   * Get DSR by ID
   */
  getDSR(id: string): DataSubjectRequest | undefined {
    return this.dsrs.find(d => d.id === id);
  }

  /**
   * Update DSR status
   */
  async updateDSRStatus(
    id: string,
    status: DSRStatus,
    response?: string
  ): Promise<DataSubjectRequest | null> {
    const dsr = this.dsrs.find(d => d.id === id);
    if (!dsr) return null;

    dsr.status = status;
    dsr.updatedAt = new Date();

    if (response) {
      dsr.response = response;
    }

    if (status === 'completed') {
      dsr.completedAt = new Date();
    }

    await auditLogger.log({
      category: 'data',
      action: `dsr.status.updated`,
      description: `DSR ${id} status updated to ${status}`,
      outcome: 'success',
      severity: 'info',
      actor: { type: 'system' },
      resource: { type: 'dsr', id },
      changes: { after: { status } },
    });

    return dsr;
  }

  /**
   * Get pending DSRs approaching deadline
   */
  getPendingDSRs(daysUntilDeadline = 7): DataSubjectRequest[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysUntilDeadline);

    return this.dsrs.filter(
      d => d.status === 'pending' && d.deadline <= cutoff
    );
  }

  /**
   * Export user data (for data portability)
   */
  async exportUserData(
    userId: string,
    dataCollectors: Array<{
      name: string;
      collect: (userId: string) => Promise<Record<string, unknown>>;
    }>
  ): Promise<Record<string, unknown>> {
    const exportData: Record<string, unknown> = {
      exportDate: new Date().toISOString(),
      userId,
    };

    for (const collector of dataCollectors) {
      try {
        exportData[collector.name] = await collector.collect(userId);
      } catch (error) {
        exportData[collector.name] = { error: 'Failed to collect data' };
      }
    }

    await auditLogger.log({
      category: 'data',
      action: 'data.exported',
      description: `User data exported for user ${userId}`,
      outcome: 'success',
      severity: 'info',
      actor: { type: 'user', id: userId },
      resource: { type: 'user', id: userId },
    });

    return exportData;
  }

  /**
   * Delete user data (right to erasure)
   */
  async deleteUserData(
    userId: string,
    dataDeleters: Array<{
      name: string;
      delete: (userId: string) => Promise<void>;
    }>
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const deleter of dataDeleters) {
      try {
        await deleter.delete(userId);
      } catch (error) {
        errors.push(`${deleter.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    await auditLogger.log({
      category: 'data',
      action: 'data.deleted',
      description: `User data deleted for user ${userId}`,
      outcome: errors.length === 0 ? 'success' : 'partial',
      severity: errors.length === 0 ? 'info' : 'warning',
      actor: { type: 'system' },
      resource: { type: 'user', id: userId },
      metadata: { errors },
    });

    return { success: errors.length === 0, errors };
  }
}

/**
 * Data Classification Service
 */
export class DataClassificationService {
  private classifications = new Map<string, DataClassification>();
  private retentionPolicies = new Map<DataClassification, RetentionPolicy>();

  /**
   * Set classification for a field/table
   */
  setClassification(identifier: string, classification: DataClassification): void {
    this.classifications.set(identifier, classification);
  }

  /**
   * Get classification for a field/table
   */
  getClassification(identifier: string): DataClassification {
    return this.classifications.get(identifier) || 'internal';
  }

  /**
   * Set retention policy for a classification
   */
  setRetentionPolicy(policy: RetentionPolicy): void {
    this.retentionPolicies.set(policy.classification, policy);
  }

  /**
   * Get retention policy for a classification
   */
  getRetentionPolicy(classification: DataClassification): RetentionPolicy | undefined {
    return this.retentionPolicies.get(classification);
  }

  /**
   * Check if data access is allowed based on classification
   */
  isAccessAllowed(
    identifier: string,
    userClearance: DataClassification[]
  ): boolean {
    const classification = this.getClassification(identifier);

    // Define clearance hierarchy
    const hierarchy: Record<DataClassification, number> = {
      public: 0,
      internal: 1,
      confidential: 2,
      pii: 3,
      financial: 3,
      phi: 4,
      restricted: 5,
    };

    const requiredLevel = hierarchy[classification];
    const userMaxLevel = Math.max(...userClearance.map(c => hierarchy[c]));

    return userMaxLevel >= requiredLevel;
  }
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

export class ComplianceChecklistService {
  private checks: ComplianceCheck[] = [];

  /**
   * Add compliance check
   */
  addCheck(check: ComplianceCheck): void {
    this.checks.push(check);
  }

  /**
   * Update check status
   */
  updateCheckStatus(
    id: string,
    status: ComplianceCheck['status'],
    evidence?: string
  ): ComplianceCheck | undefined {
    const check = this.checks.find(c => c.id === id);
    if (!check) return undefined;

    check.status = status;
    check.evidence = evidence;
    check.lastChecked = new Date();

    return check;
  }

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
  } {
    const frameworkChecks = this.checks.filter(c => c.framework === framework);

    const compliant = frameworkChecks.filter(c => c.status === 'compliant').length;
    const nonCompliant = frameworkChecks.filter(c => c.status === 'non_compliant').length;
    const partial = frameworkChecks.filter(c => c.status === 'partial').length;
    const notApplicable = frameworkChecks.filter(c => c.status === 'not_applicable').length;

    const applicable = frameworkChecks.length - notApplicable;
    const compliancePercentage = applicable > 0
      ? Math.round((compliant / applicable) * 100)
      : 100;

    return {
      total: frameworkChecks.length,
      compliant,
      nonCompliant,
      partial,
      notApplicable,
      compliancePercentage,
    };
  }

  /**
   * Get checks needing review
   */
  getChecksNeedingReview(): ComplianceCheck[] {
    const now = new Date();
    return this.checks.filter(
      c => c.nextReview && c.nextReview <= now
    );
  }
}

// Global instances
export const gdprCompliance = new GDPRComplianceService();
export const dataClassification = new DataClassificationService();
export const complianceChecklist = new ComplianceChecklistService();

// Default retention policies
const defaultRetentionPolicies: RetentionPolicy[] = [
  { classification: 'public', retentionDays: 365 * 10, deleteAfterRetention: false, archiveBeforeDelete: false, legalHoldExempt: false },
  { classification: 'internal', retentionDays: 365 * 7, deleteAfterRetention: true, archiveBeforeDelete: true, legalHoldExempt: false },
  { classification: 'confidential', retentionDays: 365 * 5, deleteAfterRetention: true, archiveBeforeDelete: true, legalHoldExempt: false },
  { classification: 'pii', retentionDays: 365 * 3, deleteAfterRetention: true, archiveBeforeDelete: false, legalHoldExempt: false },
  { classification: 'phi', retentionDays: 365 * 6, deleteAfterRetention: true, archiveBeforeDelete: true, legalHoldExempt: false },
  { classification: 'financial', retentionDays: 365 * 7, deleteAfterRetention: true, archiveBeforeDelete: true, legalHoldExempt: false },
  { classification: 'restricted', retentionDays: 365 * 1, deleteAfterRetention: true, archiveBeforeDelete: false, legalHoldExempt: false },
];

// Initialize default policies
for (const policy of defaultRetentionPolicies) {
  dataClassification.setRetentionPolicy(policy);
}
