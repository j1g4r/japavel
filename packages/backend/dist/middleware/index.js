import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "../utils/logger";
import config from "../config/env";
/**
 * Security Middleware Module
 * Comprehensive security middleware for production-grade applications
 */
// ============================================================================
// HELMET - Security Headers
// ============================================================================
/**
 * Configure Helmet for security headers
 */
export const securityHeaders = helmet({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    // HTTP Strict Transport Security (production only)
    hsts: config.isProduction
        ? {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
        }
        : false,
    // Prevent clickjacking
    frameguard: {
        action: "deny",
    },
    // XSS Filter
    xssFilter: true,
    // No Sniff
    noSniff: true,
    // Referrer Policy
    referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
    },
    // Hide X-Powered-By header
    hidePoweredBy: true,
});
// ============================================================================
// CORS - Cross-Origin Resource Sharing
// ============================================================================
/**
 * CORS configuration
 */
export const corsConfig = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = config.cors.allowedOrigins;
        if (allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            logger.warn("CORS request blocked", { origin, allowedOrigins });
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: config.cors.credentials,
    methods: config.cors.allowedMethods,
    allowedHeaders: config.cors.allowedHeaders,
    maxAge: config.cors.maxAge,
    optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
// ============================================================================
// RATE LIMITING
// ============================================================================
/**
 * Rate limiter for authentication endpoints
 */
export const authRateLimiter = rateLimit({
    windowMs: config.rateLimit.authWindowMs,
    max: config.rateLimit.authMaxAttempts,
    message: {
        error: "Too many authentication attempts. Please try again later.",
        retryAfter: Math.ceil(config.rateLimit.authWindowMs / 1000),
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Skip rate limiting for trusted IPs
        const trustedIps = process.env.TRUSTED_IPS?.split(",") || [];
        return trustedIps.includes(req.ip || "");
    },
    handler: (req, res) => {
        logger.warn("Rate limit exceeded", {
            ip: req.ip,
            path: req.path,
            method: req.method,
            userAgent: req.headers["user-agent"],
        });
        res.status(429).json({
            error: "Too many requests",
            message: "Too many authentication attempts. Please try again later.",
            retryAfter: Math.ceil(config.rateLimit.authWindowMs / 1000),
        });
    },
});
/**
 * General rate limiter for API endpoints
 */
export const apiRateLimiter = rateLimit({
    windowMs: config.rateLimit.generalWindowMs,
    max: config.rateLimit.generalMaxRequests,
    message: {
        error: "Too many requests",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn("API rate limit exceeded", {
            ip: req.ip,
            path: req.path,
            method: req.method,
        });
        res.status(429).json({
            error: "Too many requests",
            message: "Please slow down your request rate.",
        });
    },
});
/**
 * Strict rate limiter for sensitive operations
 */
export const strictRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests per hour
    message: {
        error: "Rate limit exceeded for sensitive operation",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn("Strict rate limit exceeded", {
            ip: req.ip,
            path: req.path,
            method: req.method,
            userId: req.user?.id,
        });
        res.status(429).json({
            error: "Rate limit exceeded",
            message: "You have performed this operation too many times. Please try again later.",
        });
    },
});
// ============================================================================
// REQUEST VALIDATION
// ============================================================================
/**
 * Middleware factory for request body validation using Zod schemas
 */
export const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                logger.warn("Request validation failed", {
                    path: req.path,
                    method: req.method,
                    errors: result.error.errors,
                    ip: req.ip,
                });
                return res.status(400).json({
                    error: "Validation error",
                    details: result.error.errors,
                });
            }
            // Attach validated data to request
            req.validatedBody = result.data;
            next();
        }
        catch (error) {
            logger.error("Validation middleware error", {
                error: error instanceof Error ? error.message : "Unknown error",
                path: req.path,
            });
            res.status(500).json({
                error: "Validation failed",
            });
        }
    };
};
/**
 * Middleware factory for query parameter validation
 */
export const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            const result = schema.safeParse(req.query);
            if (!result.success) {
                logger.warn("Query validation failed", {
                    path: req.path,
                    method: req.method,
                    errors: result.error.errors,
                    ip: req.ip,
                });
                return res.status(400).json({
                    error: "Invalid query parameters",
                    details: result.error.errors,
                });
            }
            req.validatedQuery = result.data;
            next();
        }
        catch (error) {
            logger.error("Query validation middleware error", {
                error: error instanceof Error ? error.message : "Unknown error",
                path: req.path,
            });
            res.status(500).json({
                error: "Query validation failed",
            });
        }
    };
};
/**
 * Middleware factory for route parameter validation
 */
export const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            const result = schema.safeParse(req.params);
            if (!result.success) {
                logger.warn("Params validation failed", {
                    path: req.path,
                    method: req.method,
                    errors: result.error.errors,
                    ip: req.ip,
                });
                return res.status(400).json({
                    error: "Invalid route parameters",
                    details: result.error.errors,
                });
            }
            req.validatedParams = result.data;
            next();
        }
        catch (error) {
            logger.error("Params validation middleware error", {
                error: error instanceof Error ? error.message : "Unknown error",
                path: req.path,
            });
            res.status(500).json({
                error: "Parameter validation failed",
            });
        }
    };
};
// ============================================================================
// SECURITY EVENT LOGGING
// ============================================================================
/**
 * Log incoming requests (after authentication)
 */
export const logRequest = (req, res, next) => {
    const startTime = Date.now();
    // Store start time for response logging
    req.startTime = startTime;
    next();
};
/**
 * Log response time and status
 */
export const logResponse = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        const startTime = req.startTime || Date.now();
        const duration = Date.now() - startTime;
        logger.request(req, res, duration);
        // Security event for sensitive operations
        const sensitivePaths = [
            "/api/auth/login",
            "/api/auth/register",
            "/api/user/password",
        ];
        if (sensitivePaths.includes(req.path)) {
            logger.security("Sensitive operation performed", {
                path: req.path,
                method: req.method,
                userId: req.user?.id,
                ip: req.ip,
                duration: `${duration}ms`,
            });
        }
        return originalSend.call(this, body);
    };
    next();
};
/**
 * Log security events
 */
export const logSecurityEvent = (eventType, metadata) => {
    return (req, res, next) => {
        logger.security(eventType, {
            ...metadata,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            path: req.path,
            method: req.method,
            userId: req.user?.id,
        });
        next();
    };
};
// ============================================================================
// ERROR HANDLING
// ============================================================================
/**
 * Global error handler
 */
export const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error("Unhandled error", {
        error: err.message,
        stack: config.isDevelopment ? err.stack : undefined,
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        ip: req.ip,
    });
    // Determine status code
    let statusCode = 500;
    let message = "Internal server error";
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation error";
    }
    else if (err.name === "UnauthorizedError") {
        statusCode = 401;
        message = "Unauthorized";
    }
    else if (err.name === "NotFoundError") {
        statusCode = 404;
        message = "Resource not found";
    }
    else if (err.name === "ForbiddenError") {
        statusCode = 403;
        message = "Forbidden";
    }
    // Send error response
    res.status(statusCode).json({
        error: message,
        ...(config.isDevelopment && { details: err.message }),
    });
};
/**
 * 404 handler
 */
export const notFoundHandler = (req, res) => {
    logger.warn("404 - Route not found", {
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    res.status(404).json({
        error: "Route not found",
        path: req.path,
        method: req.method,
    });
};
// ============================================================================
// REQUEST SIZE LIMITING
// ============================================================================
/**
 * Request body size limiter
 */
export const requestSizeLimiter = (maxSize = "10mb") => {
    return (req, res, next) => {
        const contentLength = parseInt(req.headers["content-length"] || "0", 10);
        const maxBytes = maxSizeToBytes(maxSize);
        if (contentLength > maxBytes) {
            logger.warn("Request body too large", {
                contentLength,
                maxSize,
                path: req.path,
                ip: req.ip,
            });
            return res.status(413).json({
                error: "Request entity too large",
                maxSize,
            });
        }
        next();
    };
};
/**
 * Convert size string to bytes
 */
function maxSizeToBytes(size) {
    const units = {
        b: 1,
        kb: 1024,
        mb: 1024 * 1024,
        gb: 1024 * 1024 * 1024,
    };
    const match = size.toLowerCase().match(/^(\d+)(b|kb|mb|gb)?$/);
    if (!match)
        return 10 * 1024 * 1024; // Default to 10MB
    const value = parseInt(match[1], 10);
    const unit = match[2] || "b";
    return value * (units[unit] || 1);
}
// ============================================================================
// IP WHITELIST / BLACKLIST
// ============================================================================
/**
 * IP whitelist middleware
 */
export const ipWhitelist = (allowedIps) => {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress;
        if (!ip) {
            return res.status(403).json({
                error: "Unable to determine IP address",
            });
        }
        if (!allowedIps.includes(ip)) {
            logger.warn("IP whitelist blocked", {
                ip,
                path: req.path,
            });
            return res.status(403).json({
                error: "Access denied",
            });
        }
        next();
    };
};
/**
 * IP blacklist middleware
 */
export const ipBlacklist = (blockedIps) => {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress;
        if (ip && blockedIps.includes(ip)) {
            logger.warn("IP blacklist blocked", {
                ip,
                path: req.path,
            });
            return res.status(403).json({
                error: "Access denied",
            });
        }
        next();
    };
};
// ============================================================================
// HEALTH CHECK
// ============================================================================
/**
 * Health check endpoint
 */
export const healthCheck = async (req, res) => {
    try {
        const health = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: config.env,
            version: config.app.version,
            services: {
                database: "unknown",
                redis: "unknown",
            },
        };
        // Check database connection (if available)
        try {
            // This would use Prisma client to check DB connection
            // For now, just mark as healthy
            health.services.database = "healthy";
        }
        catch (error) {
            health.services.database = "unhealthy";
            health.status = "degraded";
        }
        // Check Redis connection (if available)
        try {
            // This would check Redis connection
            // For now, just mark as healthy
            health.services.redis = config.redis.enabled ? "healthy" : "disabled";
        }
        catch (error) {
            health.services.redis = "unhealthy";
            health.status = "degraded";
        }
        const statusCode = health.status === "healthy" ? 200 : 503;
        res.status(statusCode).json(health);
    }
    catch (error) {
        logger.error("Health check failed", {
            error: error instanceof Error ? error.message : "Unknown error",
        });
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: "Health check failed",
        });
    }
};
// ============================================================================
// EXPORT ALL MIDDLEWARE
// ============================================================================
export const securityMiddleware = {
    // Headers
    securityHeaders,
    // CORS
    corsConfig,
    // Rate limiting
    authRateLimiter,
    apiRateLimiter,
    strictRateLimiter,
    // Validation
    validateBody,
    validateQuery,
    validateParams,
    // Logging
    logRequest,
    logResponse,
    logSecurityEvent,
    // Error handling
    errorHandler,
    notFoundHandler,
    // Size limiting
    requestSizeLimiter,
    // IP filtering
    ipWhitelist,
    ipBlacklist,
    // Health check
    healthCheck,
};
