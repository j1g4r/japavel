import { Router } from 'express';
export class Route {
    static router = Router();
    static get(path, handler) {
        this.router.get(path, handler);
        return this;
    }
    static post(path, handler) {
        this.router.post(path, handler);
        return this;
    }
    static put(path, handler) {
        this.router.put(path, handler);
        return this;
    }
    static delete(path, handler) {
        this.router.delete(path, handler);
        return this;
    }
    static group(prefix, callback) {
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
