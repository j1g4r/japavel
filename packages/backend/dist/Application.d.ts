import { Express } from "express";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
/**
 * Application Class
 * Production-ready Express application with comprehensive security
 */
export declare class Application {
    express: Express;
    prisma: PrismaClient;
    redis: Redis | null;
    private server;
    private isShuttingDown;
    constructor();
    /**
     * Configure all middleware
     */
    private configureMiddleware;
    /**
     * Configure routes
     */
    private configureRoutes;
    /**
     * Configure error handling
     */
    private configureErrorHandling;
    /**
     * Configure graceful shutdown
     */
    private configureGracefulShutdown;
    /**
     * Graceful shutdown handler
     */
    private gracefulShutdown;
    /**
     * Boot the application
     */
    boot(): Promise<void>;
    /**
     * Start the server
     */
    start(port?: number): void;
    /**
     * Get Express app instance
     */
    getApp(): Express;
    /**
     * Generate unique request ID
     */
    private generateRequestId;
}
/**
 * Type augmentation for Express Request
 */
declare global {
    namespace Express {
        interface Request {
            id?: string;
            user?: {
                id: string;
                [key: string]: any;
            };
            session?: {
                id: string;
                [key: string]: any;
            };
        }
    }
}
/**
 * Get or create application instance
 */
export declare const getApplication: () => Application;
/**
 * Create new application instance
 */
export declare const createApplication: () => Application;
export default Application;
//# sourceMappingURL=Application.d.ts.map