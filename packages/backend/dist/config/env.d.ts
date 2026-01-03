import { z } from "zod";
/**
 * Environment Configuration Module
 * Validates and provides type-safe access to environment variables
 * Fails fast on invalid configuration to prevent runtime errors
 */
/**
 * Node environment types
 */
declare const NodeEnvSchema: z.ZodEnum<["development", "production", "test"]>;
/**
 * Configured environment variables
 */
declare const config: {
    env: "development" | "production" | "test";
    app: {
        name: string;
        version: string;
    };
    database: {
        url: string;
        poolMax: number;
        poolMin: number;
        connectionTimeout: number;
    };
    redis: {
        maxRetries: number;
        retryDelay: number;
        enabled: boolean;
        url?: string | undefined;
    };
    security: {
        encryptionKey: string;
        jwtSecret: string;
        sessionExpiration: number;
        maxSessionsPerUser: number;
        bcryptRounds: number;
        encryptionSalt?: string | undefined;
    };
    rateLimit: {
        authWindowMs: number;
        authMaxAttempts: number;
        generalWindowMs: number;
        generalMaxRequests: number;
        lockoutDuration: number;
    };
    cors: {
        allowedOrigins: string[];
        credentials: boolean;
        allowedMethods: string[];
        allowedHeaders: string[];
        maxAge: number;
    };
    server: {
        port: number;
        host: string;
        trustProxy: boolean;
    };
    logging: {
        level: "error" | "info" | "debug" | "warn";
        maxFiles: number;
        dir: string;
        console: boolean;
        file: boolean;
        maxSize: string;
    };
    mcp: {
        port: number;
        enabled: boolean;
        allowedOrigins: string[];
    };
};
/**
 * Exported configuration object
 */
declare const _default: {
    env: "development" | "production" | "test";
    app: {
        name: string;
        version: string;
    };
    database: {
        url: string;
        poolMax: number;
        poolMin: number;
        connectionTimeout: number;
    };
    redis: {
        maxRetries: number;
        retryDelay: number;
        enabled: boolean;
        url?: string | undefined;
    };
    security: {
        encryptionKey: string;
        jwtSecret: string;
        sessionExpiration: number;
        maxSessionsPerUser: number;
        bcryptRounds: number;
        encryptionSalt?: string | undefined;
    };
    rateLimit: {
        authWindowMs: number;
        authMaxAttempts: number;
        generalWindowMs: number;
        generalMaxRequests: number;
        lockoutDuration: number;
    };
    cors: {
        allowedOrigins: string[];
        credentials: boolean;
        allowedMethods: string[];
        allowedHeaders: string[];
        maxAge: number;
    };
    server: {
        port: number;
        host: string;
        trustProxy: boolean;
    };
    logging: {
        level: "error" | "info" | "debug" | "warn";
        maxFiles: number;
        dir: string;
        console: boolean;
        file: boolean;
        maxSize: string;
    };
    mcp: {
        port: number;
        enabled: boolean;
        allowedOrigins: string[];
    };
    /**
     * Check if running in development
     */
    isDevelopment: boolean;
    /**
     * Check if running in production
     */
    isProduction: boolean;
    /**
     * Check if running in test mode
     */
    isTest: boolean;
    /**
     * Get all config as plain object (for debugging)
     */
    getAll: () => {
        security: {
            encryptionKey: string;
            encryptionSalt: string | undefined;
            jwtSecret: string;
            sessionExpiration: number;
            maxSessionsPerUser: number;
            bcryptRounds: number;
        };
        env: "development" | "production" | "test";
        app: {
            name: string;
            version: string;
        };
        database: {
            url: string;
            poolMax: number;
            poolMin: number;
            connectionTimeout: number;
        };
        redis: {
            maxRetries: number;
            retryDelay: number;
            enabled: boolean;
            url?: string | undefined;
        };
        rateLimit: {
            authWindowMs: number;
            authMaxAttempts: number;
            generalWindowMs: number;
            generalMaxRequests: number;
            lockoutDuration: number;
        };
        cors: {
            allowedOrigins: string[];
            credentials: boolean;
            allowedMethods: string[];
            allowedHeaders: string[];
            maxAge: number;
        };
        server: {
            port: number;
            host: string;
            trustProxy: boolean;
        };
        logging: {
            level: "error" | "info" | "debug" | "warn";
            maxFiles: number;
            dir: string;
            console: boolean;
            file: boolean;
            maxSize: string;
        };
        mcp: {
            port: number;
            enabled: boolean;
            allowedOrigins: string[];
        };
    };
};
export default _default;
/**
 * Type exports
 */
export type EnvConfig = typeof config;
export type NodeEnv = z.infer<typeof NodeEnvSchema>;
//# sourceMappingURL=env.d.ts.map