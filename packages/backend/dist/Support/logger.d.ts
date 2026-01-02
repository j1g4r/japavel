import winston from "winston";
/**
 * Convenience methods with security logging
 */
declare const _default: {
    /**
     * Debug level logging
     */
    debug: (message: string, meta?: Record<string, unknown>) => void;
    /**
     * Info level logging
     */
    info: (message: string, meta?: Record<string, unknown>) => void;
    /**
     * Warning level logging
     */
    warn: (message: string, meta?: Record<string, unknown>) => void;
    /**
     * Error level logging
     */
    error: (message: string, meta?: Record<string, unknown>) => void;
    /**
     * Security event logging (goes to security.log)
     */
    security: (event: string, meta?: Record<string, unknown>) => void;
    /**
     * Authentication event logging
     */
    auth: (event: string, meta?: Record<string, unknown>) => void;
    /**
     * Authorization event logging
     */
    authorization: (event: string, meta?: Record<string, unknown>) => void;
    /**
     * Data access event logging
     */
    data: (event: string, meta?: Record<string, unknown>) => void;
    /**
     * Performance metric logging
     */
    performance: (metric: string, value: number, unit?: string, meta?: Record<string, unknown>) => void;
    /**
     * Request logging middleware helper
     */
    request: (req: any, res: any, duration: number) => void;
    /**
     * Create a child logger with additional context
     */
    child: (defaultMeta: Record<string, unknown>) => winston.Logger;
    /**
     * Get underlying winston logger
     */
    getLogger: () => winston.Logger;
};
export default _default;
//# sourceMappingURL=logger.d.ts.map