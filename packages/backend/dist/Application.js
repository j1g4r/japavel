import express from 'express';
import cors from 'cors';
import { RouteServiceProvider } from './Providers/RouteServiceProvider';
export class Application {
    express;
    constructor() {
        this.express = express();
        this.configureMiddleware();
    }
    configureMiddleware() {
        this.express.use(cors());
        this.express.use(express.json());
    }
    boot() {
        RouteServiceProvider.boot(this);
    }
    start(port = 3000) {
        this.express.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}
