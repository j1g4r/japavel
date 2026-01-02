import { Request, Response } from 'express';
import { Controller } from './Controller';
import { prisma } from '../../Models/Model'; // Access the static instance directly or via Model

export class AuthController extends Controller {
  static async login(req: Request, res: Response) {
    // Mock login for now - would check DB and return token
    const { email, password } = req.body;
    console.log('Login attempt', email);
    
    // Check user in DB
    // const user = await prisma.user.findUnique({ where: { email } });
    
    return res.json({ token: 'mock-jwt-token', user: { name: 'User', email } });
  }

  static async register(req: Request, res: Response) {
    return res.json({ message: 'Register endpoint' });
  }
}
