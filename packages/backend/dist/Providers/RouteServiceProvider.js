import { Route } from '../Support/Route';
import '../routes/web';
import '../routes/api'; // Load API routes
export class RouteServiceProvider {
    static boot(app) {
        app.express.use(Route.getRouter());
    }
}
