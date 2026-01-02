import { Request, Response, NextFunction } from "express";
import { z } from "zod";
/**
 * Security Middleware Module
 * Comprehensive security middleware for production-grade applications
 */
/**
 * Configure Helmet for security headers
 */
export declare const securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
/**
 * CORS configuration
 */
export declare const corsConfig: {
    origin: (origin: string | undefined, callback: any) => any;
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    maxAge: number;
    optionsSuccessStatus: number;
};
/**
 * Rate limiter for authentication endpoints
 */
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * General rate limiter for API endpoints
 */
export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for sensitive operations
 */
export declare const strictRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Middleware factory for request body validation using Zod schemas
 */
export declare const validateBody: <T extends z.ZodTypeAny>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Middleware factory for query parameter validation
 */
export declare const validateQuery: <T extends z.ZodTypeAny>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Middleware factory for route parameter validation
 */
export declare const validateParams: <T extends z.ZodTypeAny>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Log incoming requests (after authentication)
 */
export declare const logRequest: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Log response time and status
 */
export declare const logResponse: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Log security events
 */
export declare const logSecurityEvent: (eventType: string, metadata?: Record<string, unknown>) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Global error handler
 */
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
/**
 * 404 handler
 */
export declare const notFoundHandler: (req: Request, res: Response) => void;
/**
 * Request body size limiter
 */
export declare const requestSizeLimiter: (maxSize?: string) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * IP whitelist middleware
 */
export declare const ipWhitelist: (allowedIps: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * IP blacklist middleware
 */
export declare const ipBlacklist: (blockedIps: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Health check endpoint
 */
export declare const healthCheck: (req: Request, res: Response) => Promise<void>;
export declare const securityMiddleware: {
    securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
    corsConfig: {
        origin: (origin: string | undefined, callback: any) => any;
        credentials: boolean;
        methods: string[];
        allowedHeaders: string[];
        maxAge: number;
        optionsSuccessStatus: number;
    };
    authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
    apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
    strictRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
    validateBody: <T extends z.ZodTypeAny>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateQuery: <T extends z.ZodTypeAny>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateParams: <T extends z.ZodTypeAny>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    logRequest: (req: Request, res: Response, next: NextFunction) => void;
    logResponse: (req: Request, res: Response, next: NextFunction) => void;
    logSecurityEvent: (eventType: string, metadata?: Record<string, unknown>) => (req: Request, res: Response, next: NextFunction) => void;
    errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
    notFoundHandler: (req: Request, res: Response) => void;
    requestSizeLimiter: (maxSize?: string) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    ipWhitelist: (allowedIps: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    ipBlacklist: (blockedIps: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    healthCheck: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=index.d.ts.map