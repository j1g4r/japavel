import { Request, Response } from 'express';
export declare abstract class Controller {
    protected validate(req: Request, rules: Record<string, string>): void;
    protected json(res: Response, data: any, status?: number): Response<any, Record<string, any>>;
}
//# sourceMappingURL=Controller.d.ts.map