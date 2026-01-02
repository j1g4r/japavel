import crypto from 'crypto';
import { z } from 'zod';
/**
 * Data Encryption Utilities
 * Secure encryption for sensitive data at rest and in transit
 */
// Encryption algorithm options
export const EncryptionAlgorithmSchema = z.enum([
    'aes-256-gcm',
    'aes-256-cbc',
    'aes-128-gcm',
]);
const defaultConfig = {
    algorithm: 'aes-256-gcm',
    keyDerivationIterations: 100000,
    saltLength: 16,
    ivLength: 12,
    tagLength: 16,
};
/**
 * Encryption Service
 */
export class EncryptionService {
    masterKey;
    config;
    constructor(masterKey, config) {
        this.config = { ...defaultConfig, ...config };
        if (typeof masterKey === 'string') {
            // Derive key from passphrase
            this.masterKey = crypto.scryptSync(masterKey, 'japavel-encryption-salt', 32, { N: 16384, r: 8, p: 1 });
        }
        else {
            if (masterKey.length !== 32) {
                throw new Error('Master key must be 32 bytes for AES-256');
            }
            this.masterKey = masterKey;
        }
    }
    /**
     * Encrypt data
     */
    encrypt(plaintext) {
        const iv = crypto.randomBytes(this.config.ivLength);
        const plaintextBuffer = typeof plaintext === 'string'
            ? Buffer.from(plaintext, 'utf8')
            : plaintext;
        if (this.config.algorithm.includes('gcm')) {
            const cipher = crypto.createCipheriv(this.config.algorithm, this.masterKey, iv, { authTagLength: this.config.tagLength });
            const ciphertext = Buffer.concat([
                cipher.update(plaintextBuffer),
                cipher.final(),
            ]);
            const tag = cipher.getAuthTag();
            return {
                ciphertext: ciphertext.toString('base64'),
                iv: iv.toString('base64'),
                tag: tag.toString('base64'),
                algorithm: this.config.algorithm,
                version: 1,
            };
        }
        else {
            // CBC mode
            const cipher = crypto.createCipheriv(this.config.algorithm, this.masterKey, iv);
            const ciphertext = Buffer.concat([
                cipher.update(plaintextBuffer),
                cipher.final(),
            ]);
            return {
                ciphertext: ciphertext.toString('base64'),
                iv: iv.toString('base64'),
                algorithm: this.config.algorithm,
                version: 1,
            };
        }
    }
    /**
     * Decrypt data
     */
    decrypt(encrypted) {
        const iv = Buffer.from(encrypted.iv, 'base64');
        const ciphertext = Buffer.from(encrypted.ciphertext, 'base64');
        if (encrypted.algorithm.includes('gcm')) {
            if (!encrypted.tag) {
                throw new Error('Auth tag required for GCM mode');
            }
            const tag = Buffer.from(encrypted.tag, 'base64');
            const decipher = crypto.createDecipheriv(encrypted.algorithm, this.masterKey, iv, { authTagLength: this.config.tagLength });
            decipher.setAuthTag(tag);
            return Buffer.concat([
                decipher.update(ciphertext),
                decipher.final(),
            ]);
        }
        else {
            const decipher = crypto.createDecipheriv(encrypted.algorithm, this.masterKey, iv);
            return Buffer.concat([
                decipher.update(ciphertext),
                decipher.final(),
            ]);
        }
    }
    /**
     * Decrypt to string
     */
    decryptToString(encrypted) {
        return this.decrypt(encrypted).toString('utf8');
    }
    /**
     * Encrypt with password (derives key from password)
     */
    encryptWithPassword(plaintext, password) {
        const salt = crypto.randomBytes(this.config.saltLength);
        const key = crypto.scryptSync(password, salt, 32, { N: this.config.keyDerivationIterations });
        const iv = crypto.randomBytes(this.config.ivLength);
        const cipher = crypto.createCipheriv(this.config.algorithm, key, iv, { authTagLength: this.config.tagLength });
        const ciphertext = Buffer.concat([
            cipher.update(Buffer.from(plaintext, 'utf8')),
            cipher.final(),
        ]);
        const tag = cipher.getAuthTag();
        return {
            ciphertext: ciphertext.toString('base64'),
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
            salt: salt.toString('base64'),
            algorithm: this.config.algorithm,
            version: 1,
        };
    }
    /**
     * Decrypt with password
     */
    decryptWithPassword(encrypted, password) {
        if (!encrypted.salt) {
            throw new Error('Salt required for password decryption');
        }
        const salt = Buffer.from(encrypted.salt, 'base64');
        const key = crypto.scryptSync(password, salt, 32, { N: this.config.keyDerivationIterations });
        const iv = Buffer.from(encrypted.iv, 'base64');
        const ciphertext = Buffer.from(encrypted.ciphertext, 'base64');
        const tag = Buffer.from(encrypted.tag, 'base64');
        const decipher = crypto.createDecipheriv(encrypted.algorithm, key, iv, { authTagLength: this.config.tagLength });
        decipher.setAuthTag(tag);
        const plaintext = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final(),
        ]);
        return plaintext.toString('utf8');
    }
    /**
     * Generate a new encryption key
     */
    static generateKey() {
        return crypto.randomBytes(32).toString('base64');
    }
    /**
     * Hash sensitive data (one-way)
     */
    static hash(data, salt) {
        const actualSalt = salt || crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(data, actualSalt, 64).toString('hex');
        return `${actualSalt}:${hash}`;
    }
    /**
     * Verify hashed data
     */
    static verifyHash(data, storedHash) {
        const [salt, hash] = storedHash.split(':');
        const newHash = crypto.scryptSync(data, salt, 64).toString('hex');
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(newHash));
    }
    /**
     * Generate HMAC for data integrity
     */
    hmac(data) {
        const hmac = crypto.createHmac('sha256', this.masterKey);
        hmac.update(data);
        return hmac.digest('base64');
    }
    /**
     * Verify HMAC
     */
    verifyHmac(data, expectedHmac) {
        const actualHmac = this.hmac(data);
        return crypto.timingSafeEqual(Buffer.from(actualHmac), Buffer.from(expectedHmac));
    }
}
/**
 * Field-level encryption decorator
 * Automatically encrypts/decrypts specific fields
 */
export class FieldEncryption {
    encryption;
    fields;
    constructor(encryption, fields) {
        this.encryption = encryption;
        this.fields = new Set(fields);
    }
    /**
     * Encrypt specified fields in an object
     */
    encryptFields(data) {
        const result = { ...data };
        for (const field of this.fields) {
            if (field in result && result[field] !== null && result[field] !== undefined) {
                const value = String(result[field]);
                result[field] = this.encryption.encrypt(value);
            }
        }
        return result;
    }
    /**
     * Decrypt specified fields in an object
     */
    decryptFields(data) {
        const result = { ...data };
        for (const field of this.fields) {
            if (field in result && result[field] !== null && result[field] !== undefined) {
                const encrypted = result[field];
                if (encrypted.ciphertext && encrypted.iv) {
                    result[field] = this.encryption.decryptToString(encrypted);
                }
            }
        }
        return result;
    }
}
/**
 * Data masking utilities
 */
export const dataMasking = {
    /**
     * Mask email address
     */
    email(email) {
        const [local, domain] = email.split('@');
        if (!domain)
            return email;
        const maskedLocal = local.length > 2
            ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
            : '*'.repeat(local.length);
        return `${maskedLocal}@${domain}`;
    },
    /**
     * Mask phone number
     */
    phone(phone) {
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 4)
            return '*'.repeat(phone.length);
        return digits.slice(0, 3) + '*'.repeat(digits.length - 6) + digits.slice(-3);
    },
    /**
     * Mask credit card number
     */
    creditCard(number) {
        const digits = number.replace(/\D/g, '');
        if (digits.length < 4)
            return '*'.repeat(number.length);
        return '*'.repeat(digits.length - 4) + digits.slice(-4);
    },
    /**
     * Mask SSN
     */
    ssn(ssn) {
        const digits = ssn.replace(/\D/g, '');
        if (digits.length !== 9)
            return '*'.repeat(ssn.length);
        return '***-**-' + digits.slice(-4);
    },
    /**
     * Mask generic string (show first and last n characters)
     */
    string(str, showFirst = 2, showLast = 2) {
        if (str.length <= showFirst + showLast) {
            return '*'.repeat(str.length);
        }
        return (str.slice(0, showFirst) +
            '*'.repeat(str.length - showFirst - showLast) +
            str.slice(-showLast));
    },
    /**
     * Mask IP address
     */
    ip(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4)
            return ip;
        return `${parts[0]}.${parts[1]}.***.***`;
    },
};
/**
 * Create encryption service with environment key
 */
export const createEncryptionService = (masterKey, config) => {
    const key = masterKey || process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key required. Set ENCRYPTION_KEY environment variable.');
    }
    return new EncryptionService(key, config);
};
