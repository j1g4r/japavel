import { Application } from './Application';

const app = new Application();
app.boot();
app.start(3000);

export type AppRouter = any; // Placeholder until we fully migrate tRPC if keeping it
