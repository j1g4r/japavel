import { Request, Response } from 'express';
import { Controller } from './Controller';

export class DemoController extends Controller {
    static async index(req: Request, res: Response) {
        return res.json({ message: 'DemoController index' });
    }
}
