import { Router, Request, Response, NextFunction } from 'express';

export class Route {
  private static router: Router = Router();

  static get(path: string, handler: (req: Request, res: Response, next: NextFunction) => void) {
    this.router.get(path, handler);
    return this;
  }

  static post(path: string, handler: (req: Request, res: Response, next: NextFunction) => void) {
    this.router.post(path, handler);
    return this;
  }

  static put(path: string, handler: (req: Request, res: Response, next: NextFunction) => void) {
    this.router.put(path, handler);
    return this;
  }

  static delete(path: string, handler: (req: Request, res: Response, next: NextFunction) => void) {
    this.router.delete(path, handler);
    return this;
  }

  static group(prefix: string, callback: () => void) {
    // Basic grouping logic - strictly simplified for now
    // In a full implementation, we'd handle prefix stacking
    const oldRouter = this.router;
    const newRouter = Router();
    this.router.use(prefix, newRouter);
    this.router = newRouter;
    callback();
    this.router = oldRouter;
  }

  static getRouter() {
    return this.router;
  }
}
