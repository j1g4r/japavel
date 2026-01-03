import { Request, Response } from "express";
import { Controller } from "./Controller";
/**
 * Authentication Controller
 * Handles user authentication, registration, and session management
 */
export declare class AuthController extends Controller {
    /**
     * Input validation schemas
     */
    private static readonly LoginSchema;
    private static readonly RegisterSchema;
    private static readonly RefreshTokenSchema;
    /**
     * Sanitize user data for responses (remove sensitive fields)
     */
    private static sanitizeUser;
    /**
     * Sanitize email for logging (mask most of it)
     */
    private static maskEmail;
    /**
     * Get client IP address from request
     */
    private static getClientIp;
    /**
     * User registration
     */
    static register(req: Request, res: Response): Promise<void>;
    /**
     * User login
     */
    static login(req: Request, res: Response): Promise<void>;
    /**
     * Logout user
     */
    static logout(req: Request, res: Response): Promise<void>;
    /**
     * Refresh access token
     */
    static refreshToken(req: Request, res: Response): Promise<void>;
    /**
     * Get current user
     */
    static me(req: Request, res: Response): Promise<void>;
    /**
     * Revoke all sessions (logout from all devices)
     */
    static logoutAll(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map