import { createTRPCReact, type CreateTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../backend/src/routers/app';

export const trpc: CreateTRPCReact<AppRouter, any, any> = createTRPCReact<AppRouter>();
