import { Controller } from './Controller';
export class AuthController extends Controller {
    static async login(req, res) {
        // Mock login for now - would check DB and return token
        const { email, password } = req.body;
        console.log('Login attempt', email);
        // Check user in DB
        // const user = await prisma.user.findUnique({ where: { email } });
        return res.json({ token: 'mock-jwt-token', user: { name: 'User', email } });
    }
    static async register(req, res) {
        return res.json({ message: 'Register endpoint' });
    }
}
