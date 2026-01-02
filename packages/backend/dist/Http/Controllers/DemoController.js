import { Controller } from './Controller';
export class DemoController extends Controller {
    static async index(req, res) {
        return res.json({ message: 'DemoController index' });
    }
}
