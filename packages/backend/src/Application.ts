import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import apiRouter from "./routes/api";
import {
  securityHeaders,
  corsConfig,
  authRateLimiter,
  apiRateLimiter,
  logRequest,
  logResponse,
  errorHandler,
  notFoundHandler,
  healthCheck,
} from "./middleware";
import logger from "./Support/logger";
import config from "./config/env";
import { getSessionManager } from "./security/auth";

/**
 * Application Class
 * Production-ready Express application with comprehensive security
 */
export class Application {
  public express: Express;
  public prisma: PrismaClient;
  public redis: Redis | null;
  private server: any;
  private isShuttingDown: boolean = false;

  constructor() {
    this.express = express();
    this.prisma = new PrismaClient();
    this.redis =
      config.redis.enabled && config.redis.url
        ? new Redis(config.redis.url)
        : null;

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
    this.configureGracefulShutdown();
  }

  /**
   * Configure all middleware
   */
  private configureMiddleware(): void {
    // Trust proxy (for accurate IP addresses behind load balancers)
    this.express.set("trust proxy", config.server.trustProxy);

    // Security headers (Helmet)
    this.express.use(securityHeaders);

    // CORS configuration
    this.express.use(cors(corsConfig));

    // Request logging
    this.express.use(logRequest);
    this.express.use(logResponse);

    // Body parsing with size limits
    this.express.use(
      express.json({
        limit: "10mb",
        verify: (req: Request, res: Response, buf: Buffer) => {
          // Verify signature from webhooks if needed
          // req.rawBody = buf;
        },
      }),
    );
    this.express.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Rate limiting
    this.express.use(apiRateLimiter);

    // Request ID middleware
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      req.id =
        (req.headers["x-request-id"] as string) || this.generateRequestId();
      res.setHeader("X-Request-ID", req.id);
      next();
    });

    // Compression
    if (config.isProduction) {
      const compression = require("compression");
      this.express.use(compression());
    }

    // Security event logging
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      logger.debug("Incoming request", {
        requestId: req.id,
        method: req.method,
        path: req.path,
        ip: req.ip,
      });
      next();
    });
  }

  /**
   * Configure routes
   */
  private configureRoutes(): void {
    // Health check endpoint (before auth middleware)
    this.express.get("/health", healthCheck);

    // Readiness check for Kubernetes
    this.express.get("/ready", async (req: Request, res: Response) => {
      try {
        // Check database connection
        await this.prisma.$queryRaw`SELECT 1`;

        // Check Redis connection (if enabled)
        if (this.redis) {
          await this.redis.ping();
        }

        res.status(200).json({
          status: "ready",
          timestamp: new Date().toISOString(),
          services: {
            database: "ready",
            redis: config.redis.enabled ? "ready" : "disabled",
          },
        });
      } catch (error) {
        logger.error("Readiness check failed", { error });
        res.status(503).json({
          status: "not ready",
          timestamp: new Date().toISOString(),
          error: "Services not ready",
        });
      }
    });

    // Liveness check for Kubernetes
    this.express.get("/live", (req: Request, res: Response) => {
      res.status(200).json({
        status: "alive",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.express.use("/api", apiRouter);

    // 404 handler (must be last)
    this.express.use(notFoundHandler);
  }

  /**
   * Configure error handling
   */
  private configureErrorHandling(): void {
    // Global error handler (must be last)
    this.express.use(errorHandler);

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      logger.error("Unhandled Rejection", {
        reason: reason?.message || reason,
        stack: reason?.stack,
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack,
      });
      this.gracefulShutdown(1);
    });
  }

  /**
   * Configure graceful shutdown
   */
  private configureGracefulShutdown(): void {
    const shutdownSignals = ["SIGTERM", "SIGINT"];

    shutdownSignals.forEach((signal) => {
      process.on(signal, () => {
        logger.info(`Received ${signal}, starting graceful shutdown`);
        this.gracefulShutdown(0);
      });
    });
  }

  /**
   * Graceful shutdown handler
   */
  private async gracefulShutdown(exitCode: number): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn("Shutdown already in progress");
      return;
    }

    this.isShuttingDown = true;
    logger.info("Graceful shutdown started");

    try {
      // Stop accepting new connections
      if (this.server) {
        this.server.close(() => {
          logger.info("HTTP server closed");
        });
      }

      // Close database connections
      logger.info("Closing database connections...");
      await this.prisma.$disconnect();
      logger.info("Database connections closed");

      // Close Redis connections
      if (this.redis) {
        logger.info("Closing Redis connections...");
        this.redis.quit();
        logger.info("Redis connections closed");
      }

      // Close session manager connections
      const sessionManager = getSessionManager();
      if ((sessionManager as any).disconnect) {
        await (sessionManager as any).disconnect();
      }

      logger.info("Graceful shutdown completed");
      process.exit(exitCode);
    } catch (error) {
      logger.error("Error during graceful shutdown", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      process.exit(1);
    }
  }

  /**
   * Boot the application
   */
  public async boot(): Promise<void> {
    try {
      logger.info("Booting application...", {
        environment: config.env,
        version: config.app.version,
      });

      // Test database connection
      logger.info("Initializing database connection...");
      await this.prisma.$connect();
      logger.info("Database connection established");

      // Test Redis connection (if enabled)
      if (this.redis) {
        logger.info("Initializing Redis connection...");
        await this.redis.ping();
        logger.info("Redis connection established");

        // Handle Redis errors
        this.redis.on("error", (error) => {
          logger.error("Redis error", { error });
        });
      }

      // Initialize session manager
      if (config.redis.enabled && config.redis.url) {
        getSessionManager(); // Initialize with Redis
        logger.info("Session manager initialized with Redis");
      }

      logger.info("Application booted successfully");
    } catch (error) {
      logger.error("Failed to boot application", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  /**
   * Start the server
   */
  public start(port?: number): void {
    const serverPort = port || config.server.port;
    const serverHost = config.server.host;

    this.server = this.express.listen(serverPort, serverHost, () => {
      logger.info(`🚀 Server started successfully`, {
        port: serverPort,
        host: serverHost,
        environment: config.env,
        version: config.app.version,
        pid: process.pid,
      });

      if (config.isDevelopment) {
        logger.info(`📖 Development server: http://localhost:${serverPort}`);
        logger.info(`🏥 Health check: http://localhost:${serverPort}/health`);
        logger.info(`🔧 Ready check: http://localhost:${serverPort}/ready`);
        logger.info(`💓 Live check: http://localhost:${serverPort}/live`);
      }
    });

    // Handle server errors
    this.server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${serverPort} is already in use`, { error });
        process.exit(1);
      } else {
        logger.error("Server error", { error });
      }
    });

    // Handle server timeout
    this.server.timeout = 300000; // 5 minutes
    this.server.keepAliveTimeout = 60000; // 1 minute
  }

  /**
   * Get Express app instance
   */
  public getApp(): Express {
    return this.express;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
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
 * Export singleton instance
 */
let applicationInstance: Application | null = null;

/**
 * Get or create application instance
 */
export const getApplication = (): Application => {
  if (!applicationInstance) {
    applicationInstance = new Application();
  }
  return applicationInstance;
};

/**
 * Create new application instance
 */
export const createApplication = (): Application => {
  return new Application();
};

export default Application;
