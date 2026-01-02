import { Route } from '../Support/Route';
import { AuthController } from '../Http/Controllers/AuthController';
Route.group('/api', () => {
    Route.post('/login', AuthController.login);
    Route.post('/register', AuthController.register);
});
