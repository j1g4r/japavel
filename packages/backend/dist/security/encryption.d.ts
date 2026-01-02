import { z } from 'zod';
/**
 * Data Encryption Utilities
 * Secure encryption for sensitive data at rest and in transit
 */
export declare const EncryptionAlgorithmSchema: z.ZodEnum<["aes-256-gcm", "aes-256-cbc", "aes-128-gcm"]>;
export type EncryptionAlgorithm = z.infer<typeof EncryptionAlgorithmSchema>;
export interface EncryptionConfig {
    algorithm: EncryptionAlgorithm;
    keyDerivationIterations: number;
    saltLength: number;
    ivLength: number;
    tagLength: number;
}
export interface EncryptedData {
    ciphertext: string;
    iv: string;
    tag?: string;
    salt?: string;
    algorithm: EncryptionAlgorithm;
    version: number;
}
/**
 * Encryption Service
 */
export declare class EncryptionService {
    private masterKey;
    private config;
    constructor(masterKey: string | Buffer, config?: Partial<EncryptionConfig>);
    /**
     * Encrypt data
     */
    encrypt(plaintext: string | Buffer): EncryptedData;
    /**
     * Decrypt data
     */
    decrypt(encrypted: EncryptedData): Buffer;
    /**
     * Decrypt to string
     */
    decryptToString(encrypted: EncryptedData): string;
    /**
     * Encrypt with password (derives key from password)
     */
    encryptWithPassword(plaintext: string, password: string): EncryptedData;
    /**
     * Decrypt with password
     */
    decryptWithPassword(encrypted: EncryptedData, password: string): string;
    /**
     * Generate a new encryption key
     */
    static generateKey(): string;
    /**
     * Hash sensitive data (one-way)
     */
    static hash(data: string, salt?: string): string;
    /**
     * Verify hashed data
     */
    static verifyHash(data: string, storedHash: string): boolean;
    /**
     * Generate HMAC for data integrity
     */
    hmac(data: string | Buffer): string;
    /**
     * Verify HMAC
     */
    verifyHmac(data: string | Buffer, expectedHmac: string): boolean;
}
/**
 * Field-level encryption decorator
 * Automatically encrypts/decrypts specific fields
 */
export declare class FieldEncryption {
    private encryption;
    private fields;
    constructor(encryption: EncryptionService, fields: string[]);
    /**
     * Encrypt specified fields in an object
     */
    encryptFields<T extends Record<string, unknown>>(data: T): T;
    /**
     * Decrypt specified fields in an object
     */
    decryptFields<T extends Record<string, unknown>>(data: T): T;
}
/**
 * Data masking utilities
 */
export declare const dataMasking: {
    /**
     * Mask email address
     */
    email(email: string): string;
    /**
     * Mask phone number
     */
    phone(phone: string): string;
    /**
     * Mask credit card number
     */
    creditCard(number: string): string;
    /**
     * Mask SSN
     */
    ssn(ssn: string): string;
    /**
     * Mask generic string (show first and last n characters)
     */
    string(str: string, showFirst?: number, showLast?: number): string;
    /**
     * Mask IP address
     */
    ip(ip: string): string;
};
/**
 * Create encryption service with environment key
 */
export declare const createEncryptionService: (masterKey?: string, config?: Partial<EncryptionConfig>) => EncryptionService;
//# sourceMappingURL=encryption.d.ts.map