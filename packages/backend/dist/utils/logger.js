import winston from "winston";
import path from "path";
/**
 * Secure Logging Module
 * Provides structured, environment-aware logging with sensitive data masking
 */
/**
 * Sensitive field patterns to mask in logs
 */
const SENSITIVE_PATTERNS = [
    /password/i,
    /token/i,
    /secret/i,
    /api[_-]?key/i,
    /authorization/i,
    /session/i,
    /cookie/i,
    /bearer/i,
    /pin/i,
    /ssn/i,
    /credit[_-]?card/i,
    /cvv/i,
];
/**
 * Mask sensitive data in objects
 */
function maskSensitiveData(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    // Handle strings (email masking)
    if (typeof obj === "string") {
        if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(obj))) {
            return "***REDACTED***";
        }
        // Mask email addresses
        if (obj.includes("@")) {
            const [local, domain] = obj.split("@");
            if (domain) {
                const maskedLocal = local.length > 2
                    ? `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}`
                    : "*".repeat(local.length);
                return `${maskedLocal}@${domain}`;
            }
        }
        // Mask IP addresses
        const ipMatch = obj.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
        if (ipMatch) {
            return `${ipMatch[1]}.${ipMatch[2]}.***.***`;
        }
        return obj;
    }
    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(maskSensitiveData);
    }
    // Handle objects
    if (typeof obj === "object") {
        const masked = {};
        for (const [key, value] of Object.entries(obj)) {
            if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(key))) {
                masked[key] = "***REDACTED***";
            }
            else {
                masked[key] = maskSensitiveData(value);
            }
        }
        return masked;
    }
    return obj;
}
/**
 * Log formats
 */
/**
 * Log formats
 */
const logFormat = winston.format.combine(winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
}), winston.format.errors({ stack: true }), winston.format.splat(), winston.format.printf((info) => {
    const maskedInfo = maskSensitiveData(info);
    // Format the log entry
    const { timestamp, level, message, ...meta } = maskedInfo;
    let logLine = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
        logLine += ` ${JSON.stringify(meta)}`;
    }
    return logLine;
}));
/**
 * JSON format for file logging
 */
const jsonFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.splat(), winston.format.printf((info) => {
    const maskedInfo = maskSensitiveData(info);
    return JSON.stringify(maskedInfo);
}));
/**
 * Create logger instance
 */
const createLogger = () => {
    const env = process.env.NODE_ENV || "development";
    const logLevel = process.env.LOG_LEVEL || (env === "production" ? "info" : "debug");
    const transports = [];
    // Console transport (colored in development)
    if (env !== "production") {
        transports.push(new winston.transports.Console({
            level: logLevel,
            format: winston.format.combine(winston.format.colorize(), logFormat),
        }));
    }
    else {
        transports.push(new winston.transports.Console({
            level: logLevel,
            format: logFormat,
        }));
    }
    // File transports for production and staging
    if (env === "production" || env === "staging") {
        const logDir = process.env.LOG_DIR || path.join(process.cwd(), "logs");
        // Error log file
        transports.push(new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
            format: jsonFormat,
            maxsize: 10485760, // 10MB
            maxFiles: 5,
            tailable: true,
        }));
        // Combined log file
        transports.push(new winston.transports.File({
            filename: path.join(logDir, "combined.log"),
            level: logLevel,
            format: jsonFormat,
            maxsize: 52428800, // 50MB
            maxFiles: 10,
            tailable: true,
        }));
        // Security-specific log file
        transports.push(new winston.transports.File({
            filename: path.join(logDir, "security.log"),
            level: "info",
            format: jsonFormat,
            maxsize: 10485760, // 10MB
            maxFiles: 5,
            tailable: true,
        }));
    }
    return winston.createLogger({
        level: logLevel,
        defaultMeta: {
            service: "japavel-backend",
            environment: env,
        },
        transports,
        // Don't exit on error
        exitOnError: false,
    });
};
/**
 * Logger instance
 */
const logger = createLogger();
/**
 * Convenience methods with security logging
 */
export default {
    /**
     * Debug level logging
     */
    debug: (message, meta) => {
        logger.debug(message, meta);
    },
    /**
     * Info level logging
     */
    info: (message, meta) => {
        logger.info(message, meta);
    },
    /**
     * Warning level logging
     */
    warn: (message, meta) => {
        logger.warn(message, meta);
    },
    /**
     * Error level logging
     */
    error: (message, meta) => {
        logger.error(message, meta);
    },
    /**
     * Security event logging (goes to security.log)
     */
    security: (event, meta) => {
        logger.info(`[SECURITY] ${event}`, {
            ...meta,
            category: "security",
            eventType: event,
        });
    },
    /**
     * Authentication event logging
     */
    auth: (event, meta) => {
        logger.info(`[AUTH] ${event}`, {
            ...meta,
            category: "authentication",
            eventType: event,
        });
    },
    /**
     * Authorization event logging
     */
    authorization: (event, meta) => {
        logger.info(`[AUTHORIZATION] ${event}`, {
            ...meta,
            category: "authorization",
            eventType: event,
        });
    },
    /**
     * Data access event logging
     */
    data: (event, meta) => {
        logger.info(`[DATA] ${event}`, {
            ...meta,
            category: "data",
            eventType: event,
        });
    },
    /**
     * Performance metric logging
     */
    performance: (metric, value, unit = "ms", meta) => {
        logger.info(`[PERFORMANCE] ${metric}: ${value}${unit}`, {
            ...meta,
            category: "performance",
            metric,
            value,
            unit,
        });
    },
    /**
     * Request logging middleware helper
     */
    request: (req, res, duration) => {
        logger.info(`[REQUEST] ${req.method} ${req.path}`, {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?.id,
            ip: req.ip || req.connection.remoteAddress,
        });
    },
    /**
     * Create a child logger with additional context
     */
    child: (defaultMeta) => {
        return logger.child(defaultMeta);
    },
    /**
     * Get underlying winston logger
     */
    getLogger: () => {
        return logger;
    },
};
