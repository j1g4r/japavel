/**
 * API Routes Configuration
 * Secure routing with proper middleware and error handling
 */
declare const router: import("express-serve-static-core").Router;
export default router;
export declare const apiRouter: import("express-serve-static-core").Router;
/**
 * Route groups for organization
 */
export declare const Route: {
    /**
     * Create a route group with a prefix
     */
    group: (prefix: string, callback: () => void) => void;
};
/**
 * HTTP method helpers
 */
export declare const httpMethods: {
    get: (path: string, handler: (...args: any[]) => any) => import("express-serve-static-core").Router;
    post: (path: string, handler: (...args: any[]) => any) => import("express-serve-static-core").Router;
    put: (path: string, handler: (...args: any[]) => any) => import("express-serve-static-core").Router;
    patch: (path: string, handler: (...args: any[]) => any) => import("express-serve-static-core").Router;
    delete: (path: string, handler: (...args: any[]) => any) => import("express-serve-static-core").Router;
};
//# sourceMappingURL=api.d.ts.map