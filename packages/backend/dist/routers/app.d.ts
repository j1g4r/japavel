export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    health: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: object;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _ctx_out: object;
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
        _meta: object;
    }, string>;
    user: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: object;
            _input_in: {
                id: string;
                email: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                role?: "admin" | "user" | "guest" | undefined;
            };
            _input_out: {
                id: string;
                email: string;
                name: string;
                role: "admin" | "user" | "guest";
                createdAt: Date;
                updatedAt: Date;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: string;
            status: string;
        }>;
    }>;
    saas: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        getMetrics: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    role: string;
                };
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            type: "count" | "sum" | "gauge" | "unique";
            name: string;
            displayName: string;
            periods: ("minute" | "hour" | "day" | "week" | "month" | "year" | "all_time")[];
            aggregation: "max" | "sum" | "last";
            description?: string | undefined;
            unit?: string | undefined;
        }[]>;
        getUsageSummary: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    role: string;
                };
            };
            _input_in: {
                tenantId: string;
                metric: string;
                period?: "minute" | "hour" | "day" | "week" | "month" | "year" | "all_time" | undefined;
            };
            _input_out: {
                tenantId: string;
                metric: string;
                period: "minute" | "hour" | "day" | "week" | "month" | "year" | "all_time";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../saas").UsageSummary>;
        getAllUsageSummaries: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    role: string;
                };
            };
            _input_in: {
                tenantId: string;
            };
            _input_out: {
                tenantId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../saas").UsageSummary[]>;
        getUsageHistory: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    role: string;
                };
            };
            _input_in: {
                tenantId: string;
                metric: string;
                limit?: number | undefined;
            };
            _input_out: {
                tenantId: string;
                metric: string;
                limit?: number | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../saas").UsageRecord[]>;
        getAuditLogs: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: object;
                meta: object;
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {
                user: {
                    id: string;
                    role: string;
                };
            };
            _input_in: {
                tenantId: string;
                limit?: number | undefined;
            };
            _input_out: {
                tenantId: string;
                limit: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            items: {
                timestamp: Date;
                id: string;
                metadata: Record<string, unknown>;
                action: string;
                description: string;
                actor: {
                    type: "user" | "system" | "service" | "anonymous";
                    email?: string | undefined;
                    name?: string | undefined;
                    ip?: string | undefined;
                    id?: string | undefined;
                    userAgent?: string | undefined;
                };
                category: "security" | "data" | "access" | "admin" | "billing" | "auth" | "integration" | "system";
                severity: "info" | "error" | "warning" | "critical";
                outcome: "pending" | "success" | "failure" | "partial";
                tags: string[];
                tenantId?: string | undefined;
                resource?: {
                    type: string;
                    id: string;
                    name?: string | undefined;
                } | undefined;
                changes?: {
                    before?: Record<string, unknown> | undefined;
                    after?: Record<string, unknown> | undefined;
                    fields?: string[] | undefined;
                } | undefined;
                context?: {
                    sessionId?: string | undefined;
                    requestId?: string | undefined;
                    correlationId?: string | undefined;
                    source?: string | undefined;
                    location?: {
                        country?: string | undefined;
                        region?: string | undefined;
                        city?: string | undefined;
                    } | undefined;
                } | undefined;
            }[];
            total: number;
        }>;
    }>;
}>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=app.d.ts.map