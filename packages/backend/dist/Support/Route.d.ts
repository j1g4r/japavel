import { Router, Request, Response, NextFunction } from 'express';
export declare class Route {
    private static router;
    static get(path: string, handler: (req: Request, res: Response, next: NextFunction) => void): typeof Route;
    static post(path: string, handler: (req: Request, res: Response, next: NextFunction) => void): typeof Route;
    static put(path: string, handler: (req: Request, res: Response, next: NextFunction) => void): typeof Route;
    static delete(path: string, handler: (req: Request, res: Response, next: NextFunction) => void): typeof Route;
    static group(prefix: string, callback: () => void): void;
    static getRouter(): Router;
}
//# sourceMappingURL=Route.d.ts.map