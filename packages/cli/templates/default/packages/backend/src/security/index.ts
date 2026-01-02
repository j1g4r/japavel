// Authentication exports
export {
  passwordUtils,
  tokenUtils,
  SessionManager,
  sessionManager,
  authMiddleware,
  createAuthContext,
  requireAuth,
  loginRateLimiter,
  TokenTypeSchema,
  SessionSchema,
  ApiKeySchema,
  AuthUserSchema,
} from './auth';

export type {
  TokenType,
  Session,
  ApiKey,
  AuthUser,
} from './auth';

// Authorization exports
export {
  RBACManager,
  ABACManager,
  AuthorizationManager,
  authz,
  requirePermission,
  AuthorizationError,
  defaultRoles,
  PermissionSchema,
  RoleSchema,
  PolicySchema,
  PermissionActionSchema,
} from './authorization';

export type {
  Permission,
  PermissionAction,
  Role,
  Policy,
  AuthorizationContext,
  AuthorizationResult,
} from './authorization';

// Encryption exports
export {
  EncryptionService,
  FieldEncryption,
  dataMasking,
  createEncryptionService,
  EncryptionAlgorithmSchema,
} from './encryption';

export type {
  EncryptionAlgorithm,
  EncryptionConfig,
  EncryptedData,
} from './encryption';

// Compliance exports
export {
  GDPRComplianceService,
  DataClassificationService,
  ComplianceChecklistService,
  gdprCompliance,
  dataClassification,
  complianceChecklist,
  DataClassificationSchema,
  DSRTypeSchema,
  DSRStatusSchema,
  ConsentRecordSchema,
  DataSubjectRequestSchema,
  RetentionPolicySchema,
  ComplianceFrameworkSchema,
} from './compliance';

export type {
  DataClassification,
  DSRType,
  DSRStatus,
  ConsentRecord,
  DataSubjectRequest,
  RetentionPolicy,
  ComplianceFramework,
  ComplianceCheck,
} from './compliance';
