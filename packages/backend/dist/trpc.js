import { initTRPC } from '@trpc/server';
const t = initTRPC.create();
const isAuthed = t.middleware(({ next, ctx }) => {
    // Mock auth check - in real app check ctx.user
    return next({
        ctx: {
            user: { id: 'mock-user-id', role: 'admin' },
        },
    });
});
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const middleware = t.middleware;
