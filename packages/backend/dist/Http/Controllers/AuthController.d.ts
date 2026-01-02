import { Request, Response } from 'express';
import { Controller } from './Controller';
export declare class AuthController extends Controller {
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=AuthController.d.ts.map