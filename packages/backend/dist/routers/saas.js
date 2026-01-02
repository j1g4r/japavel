import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { usageMetering, commonMetrics } from '../saas/usage-metering';
import { auditLogger } from '../saas/audit-log';
// Input schemas
const GetUsageInput = z.object({
    tenantId: z.string(),
    metric: z.string(),
    period: z.enum(['minute', 'hour', 'day', 'week', 'month', 'year', 'all_time']).default('month'),
});
const GetHistoryInput = z.object({
    tenantId: z.string(),
    metric: z.string(),
    limit: z.number().optional(),
});
export const saasRouter = router({
    // Usage Metering
    getMetrics: protectedProcedure
        .query(() => {
        // Return predefined metrics + any registered ones
        return commonMetrics;
    }),
    getUsageSummary: protectedProcedure
        .input(GetUsageInput)
        .query(({ input }) => {
        return usageMetering.getUsageSummary(input.tenantId, input.metric, input.period);
    }),
    getAllUsageSummaries: protectedProcedure
        .input(z.object({ tenantId: z.string() }))
        .query(({ input }) => {
        return usageMetering.getAllUsageSummaries(input.tenantId);
    }),
    getUsageHistory: protectedProcedure
        .input(GetHistoryInput)
        .query(({ input }) => {
        return usageMetering.getHistory(input.tenantId, input.metric, { limit: input.limit });
    }),
    // Audit Logs
    getAuditLogs: protectedProcedure
        .input(z.object({
        tenantId: z.string(),
        limit: z.number().default(50),
    }))
        .query(async ({ input }) => {
        const logs = await auditLogger.getRecentEvents(input.tenantId, input.limit);
        return {
            items: logs,
            total: logs.length // Mock total since getRecentEvents returns array
        };
    }),
});
