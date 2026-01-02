import { router, publicProcedure } from '../trpc';
import { UserSchema } from '@japavel/contracts';
import { saasRouter } from './saas';

export const appRouter = router({
  health: publicProcedure.query(() => 'ok'),
  user: router({
    create: publicProcedure
      .input(UserSchema)
      .mutation(({ input }) => {
        // Mock DB call
        return { id: input.id, status: 'created' };
      }),
  }),
  saas: saasRouter,
});

export type AppRouter = typeof appRouter;
