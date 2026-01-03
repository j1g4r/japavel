import { Request, Response } from 'express';

export abstract class Controller {
  protected validate(req: Request, rules: Record<string, string>): void {
    // Basic validation stub - would integrate Zod or similar here
    console.log('Validating request...', rules);
  }

  protected json(res: Response, data: any, status = 200) {
    return res.status(status).json(data);
  }
}
