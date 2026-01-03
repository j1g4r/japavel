import { Controller } from "./Controller";
import { prisma } from "../Models/Model";
import { passwordUtils, sessionManager, loginRateLimiter, } from "../security/auth";
import { z } from "zod";
import logger from "../utils/logger";
/**
 * Authentication Controller
 * Handles user authentication, registration, and session management
 */
export class AuthController extends Controller {
    /**
     * Input validation schemas
     */
    static LoginSchema = z.object({
        email: z.string().email("Invalid email address").max(255),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128),
    });
    static RegisterSchema = z.object({
        email: z.string().email("Invalid email address").max(255),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128)
            .regex(/[A-Z]/, "Password must contain an uppercase letter")
            .regex(/[a-z]/, "Password must contain a lowercase letter")
            .regex(/\d/, "Password must contain a number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
        name: z.string().min(1, "Name is required").max(255).optional(),
    });
    static RefreshTokenSchema = z.object({
        refreshToken: z.string().min(1, "Refresh token is required"),
    });
    /**
     * Sanitize user data for responses (remove sensitive fields)
     */
    static sanitizeUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Sanitize email for logging (mask most of it)
     */
    static maskEmail(email) {
        const [local, domain] = email.split("@");
        if (!domain)
            return "****@***";
        const maskedLocal = local.length > 2
            ? local[0] + "*".repeat(local.length - 2) + local[local.length - 1]
            : "*".repeat(local.length);
        return `${maskedLocal}@${domain}`;
    }
    /**
     * Get client IP address from request
     */
    static getClientIp(req) {
        return (req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.headers["x-real-ip"] ||
            req.socket.remoteAddress ||
            "unknown");
    }
    /**
     * User registration
     */
    static async register(req, res) {
        try {
            // Validate input
            const result = AuthController.RegisterSchema.safeParse(req.body);
            if (!result.success) {
                logger.warn("Registration validation failed", {
                    errors: result.error.errors,
                    ip: AuthController.getClientIp(req),
                });
                res.status(400).json({
                    error: "Validation error",
                    details: result.error.errors,
                });
                return;
            }
            const { email, password, name } = result.data;
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                logger.warn("Registration failed - user already exists", {
                    email: AuthController.maskEmail(email),
                    ip: AuthController.getClientIp(req),
                });
                // Generic error message to prevent enumeration
                res.status(400).json({
                    error: "An account with this email already exists",
                });
                return;
            }
            // Validate password strength
            const passwordValidation = passwordUtils.validate(password);
            if (!passwordValidation.valid) {
                logger.warn("Registration failed - weak password", {
                    email: AuthController.maskEmail(email),
                    ip: AuthController.getClientIp(req),
                    errors: passwordValidation.errors,
                });
                res.status(400).json({
                    error: "Password does not meet requirements",
                    details: passwordValidation.errors,
                });
                return;
            }
            // Hash password
            const passwordHash = await passwordUtils.hash(password);
            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    name,
                    emailVerified: false,
                    role: "user",
                },
            });
            // Create session
            const session = await sessionManager.create(user.id, {
                expiresIn: 3600 * 24, // 24 hours
                ip: AuthController.getClientIp(req),
                userAgent: req.headers["user-agent"],
                metadata: {
                    method: "registration",
                },
            });
            logger.info("User registered successfully", {
                userId: user.id,
                email: AuthController.maskEmail(email),
                ip: AuthController.getClientIp(req),
            });
            res.status(201).json({
                message: "Registration successful",
                token: session.token,
                refreshToken: session.refreshToken,
                user: AuthController.sanitizeUser(user),
            });
        }
        catch (error) {
            logger.error("Registration error", {
                error: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
                ip: AuthController.getClientIp(req),
            });
            res.status(500).json({
                error: "An error occurred during registration",
            });
        }
    }
    /**
     * User login
     */
    static async login(req, res) {
        try {
            // Validate input
            const result = AuthController.LoginSchema.safeParse(req.body);
            if (!result.success) {
                logger.warn("Login validation failed", {
                    errors: result.error.errors,
                    ip: AuthController.getClientIp(req),
                });
                res.status(400).json({
                    error: "Validation error",
                    details: result.error.errors,
                });
                return;
            }
            const { email, password } = result.data;
            // Check rate limit
            const rateCheck = loginRateLimiter.check(email);
            if (!rateCheck.allowed) {
                logger.warn("Login blocked - rate limit exceeded", {
                    email: AuthController.maskEmail(email),
                    ip: AuthController.getClientIp(req),
                    retryAfter: rateCheck.retryAfter,
                });
                res.status(429).json({
                    error: "Too many login attempts. Please try again later.",
                    retryAfter: rateCheck.retryAfter,
                });
                return;
            }
            // Find user
            const user = await prisma.user.findUnique({
                where: { email },
            });
            // Generic failure check (timing attack protection)
            if (!user || !user.passwordHash) {
                // Record failed attempt
                loginRateLimiter.recordFailure(email);
                // Use constant-time comparison to prevent timing attacks
                await passwordUtils.verify(password, "$argon2id$v=19$m=65536,t=3,p=4$dummy");
                logger.warn("Login failed - invalid credentials", {
                    email: AuthController.maskEmail(email),
                    ip: AuthController.getClientIp(req),
                });
                res.status(401).json({
                    error: "Invalid email or password",
                });
                return;
            }
            // Check if account is locked
            if (user.lockedUntil && user.lockedUntil > new Date()) {
                logger.warn("Login failed - account locked", {
                    userId: user.id,
                    email: AuthController.maskEmail(email),
                    ip: AuthController.getClientIp(req),
                });
                res.status(403).json({
                    error: "Account is temporarily locked. Please try again later.",
                });
                return;
            }
            // Verify password
            const valid = await passwordUtils.verify(password, user.passwordHash);
            if (!valid) {
                // Record failed attempt
                loginRateLimiter.recordFailure(email);
                // Update failed login attempts in database
                const failedAttempts = (user.failedLoginAttempts || 0) + 1;
                const updateData = { failedLoginAttempts: failedAttempts };
                // Lock account after too many failed attempts
                if (failedAttempts >= 5) {
                    updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
                    logger.warn("Account locked due to too many failed attempts", {
                        userId: user.id,
                        email: AuthController.maskEmail(email),
                        ip: AuthController.getClientIp(req),
                    });
                }
                await prisma.user.update({
                    where: { id: user.id },
                    data: updateData,
                });
                logger.warn("Login failed - invalid password", {
                    userId: user.id,
                    email: AuthController.maskEmail(email),
                    ip: AuthController.getClientIp(req),
                });
                res.status(401).json({
                    error: "Invalid email or password",
                });
                return;
            }
            // Reset failed login attempts on successful login
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockedUntil: null,
                    lastLoginAt: new Date(),
                },
            });
            // Clear rate limit on successful login
            loginRateLimiter.reset(email);
            // Create session
            const session = await sessionManager.create(user.id, {
                expiresIn: 3600 * 24, // 24 hours
                ip: AuthController.getClientIp(req),
                userAgent: req.headers["user-agent"],
                metadata: {
                    method: "login",
                },
            });
            // Check and revoke old sessions if too many (keep last 5)
            const userSessions = await sessionManager.getUserSessions(user.id);
            if (userSessions.length > 5) {
                const sessionsToRevoke = userSessions.slice(0, -5);
                for (const oldSession of sessionsToRevoke) {
                    await sessionManager.revoke(oldSession.id);
                }
                logger.info("Old sessions revoked", {
                    userId: user.id,
                    revokedCount: sessionsToRevoke.length,
                });
            }
            logger.info("User login successful", {
                userId: user.id,
                email: AuthController.maskEmail(email),
                ip: AuthController.getClientIp(req),
                sessionId: session.id.substring(0, 8), // Log partial session ID
            });
            res.json({
                message: "Login successful",
                token: session.token,
                refreshToken: session.refreshToken,
                user: AuthController.sanitizeUser(user),
            });
        }
        catch (error) {
            logger.error("Login error", {
                error: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
                ip: AuthController.getClientIp(req),
            });
            res.status(500).json({
                error: "An error occurred during login",
            });
        }
    }
    /**
     * Logout user
     */
    static async logout(req, res) {
        try {
            // Get session from middleware
            const session = req.session;
            if (session) {
                await sessionManager.revoke(session.id);
                logger.info("User logout successful", {
                    userId: session.userId,
                    sessionId: session.id.substring(0, 8),
                    ip: AuthController.getClientIp(req),
                });
            }
            res.json({
                message: "Logout successful",
            });
        }
        catch (error) {
            logger.error("Logout error", {
                error: error instanceof Error ? error.message : "Unknown error",
                ip: AuthController.getClientIp(req),
            });
            // Even if error occurs, return success to client
            res.json({
                message: "Logout successful",
            });
        }
    }
    /**
     * Refresh access token
     */
    static async refreshToken(req, res) {
        try {
            // Validate input
            const result = AuthController.RefreshTokenSchema.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({
                    error: "Validation error",
                    details: result.error.errors,
                });
                return;
            }
            const { refreshToken } = result.data;
            // Find session by refresh token
            const allSessions = await sessionManager.getUserSessions(req.user?.id);
            const session = allSessions.find((s) => s.refreshToken === refreshToken);
            if (!session || !session.refreshToken) {
                logger.warn("Token refresh failed - invalid refresh token", {
                    userId: req.user?.id,
                    ip: AuthController.getClientIp(req),
                });
                res.status(401).json({
                    error: "Invalid refresh token",
                });
                return;
            }
            // Check if session is expired
            if (new Date() > session.expiresAt) {
                await sessionManager.revoke(session.id);
                res.status(401).json({
                    error: "Refresh token expired",
                });
                return;
            }
            // Create new session
            await sessionManager.revoke(session.id);
            const newSession = await sessionManager.create(session.userId, {
                expiresIn: 3600 * 24, // 24 hours
                ip: AuthController.getClientIp(req),
                userAgent: req.headers["user-agent"],
                metadata: {
                    method: "refresh",
                },
            });
            logger.info("Token refresh successful", {
                userId: session.userId,
                oldSessionId: session.id.substring(0, 8),
                newSessionId: newSession.id.substring(0, 8),
                ip: AuthController.getClientIp(req),
            });
            res.json({
                token: newSession.token,
                refreshToken: newSession.refreshToken,
            });
        }
        catch (error) {
            logger.error("Token refresh error", {
                error: error instanceof Error ? error.message : "Unknown error",
                ip: AuthController.getClientIp(req),
            });
            res.status(500).json({
                error: "An error occurred while refreshing token",
            });
        }
    }
    /**
     * Get current user
     */
    static async me(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    error: "Not authenticated",
                });
                return;
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                res.status(404).json({
                    error: "User not found",
                });
                return;
            }
            res.json({
                user: AuthController.sanitizeUser(user),
            });
        }
        catch (error) {
            logger.error("Get user error", {
                error: error instanceof Error ? error.message : "Unknown error",
                userId: req.user?.id,
            });
            res.status(500).json({
                error: "An error occurred",
            });
        }
    }
    /**
     * Revoke all sessions (logout from all devices)
     */
    static async logoutAll(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    error: "Not authenticated",
                });
                return;
            }
            const revokedCount = await sessionManager.revokeAllForUser(userId);
            logger.info("All sessions revoked", {
                userId,
                revokedCount,
                ip: AuthController.getClientIp(req),
            });
            res.json({
                message: "Logged out from all devices",
                revokedCount,
            });
        }
        catch (error) {
            logger.error("Logout all error", {
                error: error instanceof Error ? error.message : "Unknown error",
                userId: req.user?.id,
                ip: AuthController.getClientIp(req),
            });
            res.status(500).json({
                error: "An error occurred",
            });
        }
    }
}
