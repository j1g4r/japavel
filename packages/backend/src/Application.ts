import express, { Express } from 'express';
import cors from 'cors';
import { RouteServiceProvider } from './Providers/RouteServiceProvider';

export class Application {
  public express: Express;

  constructor() {
    this.express = express();
    this.configureMiddleware();
  }

  private configureMiddleware() {
    this.express.use(cors());
    this.express.use(express.json());
  }

  public boot() {
    RouteServiceProvider.boot(this);
  }

  public start(port: number = 3000) {
    this.express.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}
