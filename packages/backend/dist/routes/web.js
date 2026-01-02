import { Route } from '../Support/Route';
Route.get('/', (req, res) => {
    res.json({ message: 'Welcome to Japavel Framework' });
});
Route.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
