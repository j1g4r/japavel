import { z } from "zod";
/**
 * Environment Configuration Module
 * Validates and provides type-safe access to environment variables
 * Fails fast on invalid configuration to prevent runtime errors
 */
/**
 * Node environment types
 */
const NodeEnvSchema = z.enum(["development", "production", "test"]);
/**
 * Database configuration schema
 */
const DatabaseConfigSchema = z
    .object({
    url: z.string().url("DATABASE_URL must be a valid URL"),
    poolMax: z.coerce.number().int().positive().default(10),
    poolMin: z.coerce.number().int().nonnegative().default(2),
    connectionTimeout: z.coerce.number().int().positive().default(10000), // 10 seconds
})
    .refine((config) => {
    const url = config.url;
    // Validate database type based on URL
    const isPostgres = url.includes("postgresql://");
    const isMySQL = url.includes("mysql://");
    const isSQLite = url.includes("file:");
    return isPostgres || isMySQL || isSQLite;
}, {
    message: "DATABASE_URL must be a PostgreSQL, MySQL, or SQLite connection string",
});
/**
 * Redis configuration schema
 */
const RedisConfigSchema = z
    .object({
    url: z.string().url("REDIS_URL must be a valid URL").optional(),
    maxRetries: z.coerce.number().int().positive().default(3),
    retryDelay: z.coerce.number().int().positive().default(50),
    enabled: z.coerce.boolean().default(true),
})
    .refine((config) => {
    // If Redis is enabled, URL is required in production
    if (process.env.NODE_ENV === "production" && config.enabled && !config.url) {
        return false;
    }
    return true;
}, {
    message: "REDIS_URL is required in production when Redis is enabled",
});
/**
 * Security configuration schema
 */
const SecurityConfigSchema = z.object({
    encryptionKey: z
        .string()
        .min(32, "ENCRYPTION_KEY must be at least 32 characters")
        .max(64, "ENCRYPTION_KEY must be at most 64 characters")
        .regex(/^[a-zA-Z0-9+/=]+$/, "ENCRYPTION_KEY must contain only valid base64 characters"),
    encryptionSalt: z.string().min(16, "ENCRYPTION_SALT must be at least 16 characters").optional(),
    jwtSecret: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    sessionExpiration: z.coerce.number().int().positive().default(86400), // 24 hours
    maxSessionsPerUser: z.coerce.number().int().positive().default(5),
    bcryptRounds: z.coerce.number().int().min(4).max(12).default(12),
});
/**
 * Rate limiting configuration schema
 */
const RateLimitConfigSchema = z.object({
    authWindowMs: z.coerce.number().int().positive().default(900000), // 15 minutes
    authMaxAttempts: z.coerce.number().int().positive().default(5),
    generalWindowMs: z.coerce.number().int().positive().default(60000), // 1 minute
    generalMaxRequests: z.coerce.number().int().positive().default(100),
    lockoutDuration: z.coerce.number().int().positive().default(1800000), // 30 minutes
});
/**
 * CORS configuration schema
 */
const CorsConfigSchema = z.object({
    allowedOrigins: z.string().transform((val) => {
        if (val === "*")
            return ["*"];
        return val.split(",").map((origin) => origin.trim());
    }),
    credentials: z.coerce.boolean().default(true),
    allowedMethods: z
        .string()
        .transform((val) => val.split(",").map((method) => method.trim().toUpperCase()))
        .default("GET,POST,PUT,DELETE,PATCH"),
    allowedHeaders: z
        .string()
        .transform((val) => val.split(",").map((header) => header.trim()))
        .default("Content-Type,Authorization"),
    maxAge: z.coerce.number().int().nonnegative().default(86400), // 24 hours
});
/**
 * Server configuration schema
 */
const ServerConfigSchema = z.object({
    port: z.coerce.number().int().positive().default(3000),
    host: z.string().default("0.0.0.0"),
    trustProxy: z.coerce.boolean().default(true),
});
/**
 * Logging configuration schema
 */
const LoggingConfigSchema = z.object({
    level: z.enum(["error", "warn", "info", "debug"]).default("info"),
    dir: z.string().default("./logs"),
    console: z.coerce.boolean().default(true),
    file: z.coerce.boolean().default(true),
    maxFiles: z.coerce.number().int().positive().default(10),
    maxSize: z.string().default("50m"),
});
/**
 * MCP server configuration schema
 */
const MCPServerConfigSchema = z.object({
    enabled: z.coerce.boolean().default(false),
    port: z.coerce.number().int().positive().default(3001),
    allowedOrigins: z
        .string()
        .transform((val) => val.split(",").map((origin) => origin.trim()))
        .default("*"),
});
/**
 * Complete environment configuration schema
 */
const EnvSchema = z
    .object({
    NODE_ENV: NodeEnvSchema,
    APP_NAME: z.string().default("japavel-backend"),
    APP_VERSION: z.string().default("0.0.1"),
    // Database
    DATABASE_URL: z.string().url(),
    PRISMA_SCHEMA_PATH: z.string().default("./src/prisma/schema.prisma"),
    // Redis
    REDIS_URL: z.string().url().optional(),
    // Security
    ENCRYPTION_KEY: z.string().min(32),
    ENCRYPTION_SALT: z.string().min(16).optional(),
    JWT_SECRET: z.string().min(32),
    // Server
    PORT: z.coerce.number().int().positive().default(3000),
    HOST: z.string().default("0.0.0.0"),
    // CORS
    ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    RATE_LIMIT_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
    // Logging
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
    LOG_DIR: z.string().default("./logs"),
    // MCP Server
    MCP_ENABLED: z.coerce.boolean().default(false),
    MCP_PORT: z.coerce.number().int().positive().default(3001),
})
    .transform((env) => ({
    env: env.NODE_ENV,
    app: {
        name: env.APP_NAME,
        version: env.APP_VERSION,
    },
    database: DatabaseConfigSchema.parse({
        url: env.DATABASE_URL,
        poolMax: process.env.DATABASE_POOL_MAX,
        poolMin: process.env.DATABASE_POOL_MIN,
        connectionTimeout: process.env.DATABASE_CONNECTION_TIMEOUT,
    }),
    redis: RedisConfigSchema.parse({
        url: env.REDIS_URL,
        maxRetries: process.env.REDIS_MAX_RETRIES,
        retryDelay: process.env.REDIS_RETRY_DELAY,
        enabled: process.env.REDIS_ENABLED !== "false",
    }),
    security: SecurityConfigSchema.parse({
        encryptionKey: env.ENCRYPTION_KEY,
        encryptionSalt: env.ENCRYPTION_SALT,
        jwtSecret: env.JWT_SECRET,
        sessionExpiration: process.env.SESSION_EXPIRATION,
        maxSessionsPerUser: process.env.MAX_SESSIONS_PER_USER,
        bcryptRounds: process.env.BCRYPT_ROUNDS,
    }),
    rateLimit: RateLimitConfigSchema.parse({
        authWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
        authMaxAttempts: process.env.RATE_LIMIT_MAX_ATTEMPTS,
        generalWindowMs: process.env.RATE_LIMIT_GENERAL_WINDOW_MS,
        generalMaxRequests: process.env.RATE_LIMIT_GENERAL_MAX_REQUESTS,
        lockoutDuration: process.env.RATE_LIMIT_LOCKOUT_DURATION,
    }),
    cors: CorsConfigSchema.parse({
        allowedOrigins: env.ALLOWED_ORIGINS,
        credentials: process.env.CORS_CREDENTIALS,
        allowedMethods: process.env.CORS_ALLOWED_METHODS,
        allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
        maxAge: process.env.CORS_MAX_AGE,
    }),
    server: ServerConfigSchema.parse({
        port: env.PORT,
        host: env.HOST,
        trustProxy: process.env.TRUST_PROXY,
    }),
    logging: LoggingConfigSchema.parse({
        level: env.LOG_LEVEL,
        dir: env.LOG_DIR,
        console: process.env.LOG_CONSOLE,
        file: process.env.LOG_FILE,
        maxFiles: process.env.LOG_MAX_FILES,
        maxSize: process.env.LOG_MAX_SIZE,
    }),
    mcp: MCPServerConfigSchema.parse({
        enabled: env.MCP_ENABLED,
        port: env.MCP_PORT,
        allowedOrigins: process.env.MCP_ALLOWED_ORIGINS,
    }),
}));
/**
 * Validate and parse environment variables
 */
function validateEnv() {
    try {
        const config = EnvSchema.parse(process.env);
        // Log configuration (safely)
        console.log(`[CONFIG] Environment: ${config.env}`);
        console.log(`[CONFIG] App: ${config.app.name} v${config.app.version}`);
        console.log(`[CONFIG] Database: ${config.database.url.split("@")[1] ?? "unknown"}`);
        console.log(`[CONFIG] Redis: ${config.redis.enabled ? (config.redis.url ? "enabled" : "disabled") : "disabled"}`);
        console.log(`[CONFIG] Server: ${config.server.host}:${config.server.port}`);
        console.log(`[CONFIG] Security: ${config.security.encryptionKey ? "✓ Configured" : "✗ Missing"}`);
        return config;
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            console.error("❌ Environment Configuration Error:");
            console.error("");
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join(".")}: ${err.message}`);
            });
            console.error("");
            console.error("Please check your .env file and ensure all required environment variables are set correctly.");
            console.error("See .env.example for the required variables.");
        }
        else {
            console.error("❌ Unexpected error validating environment:", error);
        }
        process.exit(1);
    }
}
/**
 * Configured environment variables
 */
const config = validateEnv();
/**
 * Exported configuration object
 */
export default {
    env: config.env,
    app: config.app,
    database: config.database,
    redis: config.redis,
    security: config.security,
    rateLimit: config.rateLimit,
    cors: config.cors,
    server: config.server,
    logging: config.logging,
    mcp: config.mcp,
    /**
     * Check if running in development
     */
    isDevelopment: config.env === "development",
    /**
     * Check if running in production
     */
    isProduction: config.env === "production",
    /**
     * Check if running in test mode
     */
    isTest: config.env === "test",
    /**
     * Get all config as plain object (for debugging)
     */
    getAll: () => ({
        ...config,
        security: {
            ...config.security,
            encryptionKey: "***REDACTED***",
            encryptionSalt: config.security.encryptionSalt ? "***REDACTED***" : undefined,
            jwtSecret: "***REDACTED***",
        },
    }),
};
