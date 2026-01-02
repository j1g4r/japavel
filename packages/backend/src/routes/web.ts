import { Route } from '../Support/Route';
import { Request, Response } from 'express';

Route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Japavel Framework' });
});

Route.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});
