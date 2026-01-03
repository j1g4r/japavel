import { z } from 'zod';
/**
 * Queue System Interface
 * Provides a unified queue interface for background job processing
 */
export declare const JobStatusSchema: z.ZodEnum<["pending", "running", "completed", "failed", "retrying", "cancelled"]>;
export type JobStatus = z.infer<typeof JobStatusSchema>;
export declare const JobPrioritySchema: z.ZodEnum<["low", "normal", "high", "critical"]>;
export type JobPriority = z.infer<typeof JobPrioritySchema>;
export declare const JobSchema: z.ZodObject<{
    id: z.ZodString;
    queue: z.ZodString;
    name: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    status: z.ZodDefault<z.ZodEnum<["pending", "running", "completed", "failed", "retrying", "cancelled"]>>;
    priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high", "critical"]>>;
    attempts: z.ZodDefault<z.ZodNumber>;
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    backoff: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
    delay: z.ZodDefault<z.ZodNumber>;
    result: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
    progress: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDate;
    startedAt: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    scheduledFor: z.ZodOptional<z.ZodDate>;
    tenantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    status: "pending" | "cancelled" | "running" | "completed" | "failed" | "retrying";
    name: string;
    data: Record<string, unknown>;
    queue: string;
    priority: "normal" | "critical" | "low" | "high";
    attempts: number;
    maxAttempts: number;
    backoff: number;
    timeout: number;
    delay: number;
    progress: number;
    tenantId?: string | undefined;
    error?: string | undefined;
    result?: unknown;
    startedAt?: Date | undefined;
    completedAt?: Date | undefined;
    scheduledFor?: Date | undefined;
}, {
    id: string;
    createdAt: Date;
    name: string;
    data: Record<string, unknown>;
    queue: string;
    tenantId?: string | undefined;
    status?: "pending" | "cancelled" | "running" | "completed" | "failed" | "retrying" | undefined;
    error?: string | undefined;
    result?: unknown;
    priority?: "normal" | "critical" | "low" | "high" | undefined;
    attempts?: number | undefined;
    maxAttempts?: number | undefined;
    backoff?: number | undefined;
    timeout?: number | undefined;
    delay?: number | undefined;
    progress?: number | undefined;
    startedAt?: Date | undefined;
    completedAt?: Date | undefined;
    scheduledFor?: Date | undefined;
}>;
export type Job = z.infer<typeof JobSchema>;
export interface JobOptions {
    priority?: JobPriority;
    delay?: number;
    attempts?: number;
    backoff?: number;
    timeout?: number;
    tenantId?: string;
    scheduledFor?: Date;
}
export type JobHandler<T = unknown, R = unknown> = (job: Job & {
    data: T;
}) => Promise<R>;
export interface QueueEvents {
    'job:added': (job: Job) => void;
    'job:started': (job: Job) => void;
    'job:progress': (job: Job, progress: number) => void;
    'job:completed': (job: Job, result: unknown) => void;
    'job:failed': (job: Job, error: Error) => void;
    'job:retrying': (job: Job, error: Error) => void;
    'job:cancelled': (job: Job) => void;
}
/**
 * Queue interface
 */
export interface Queue<T = unknown> {
    name: string;
    add(name: string, data: T, options?: JobOptions): Promise<Job>;
    addBulk(jobs: Array<{
        name: string;
        data: T;
        options?: JobOptions;
    }>): Promise<Job[]>;
    getJob(jobId: string): Promise<Job | null>;
    getJobs(status?: JobStatus, limit?: number): Promise<Job[]>;
    removeJob(jobId: string): Promise<boolean>;
    process(handler: JobHandler<T>): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    on<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void;
    off<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void;
    clean(grace: number, status?: JobStatus): Promise<number>;
    drain(): Promise<void>;
    close(): Promise<void>;
}
/**
 * In-memory queue implementation (for development/testing)
 */
export declare class MemoryQueue<T = unknown> implements Queue<T> {
    readonly name: string;
    private jobs;
    private handlers;
    private events;
    private processing;
    private paused;
    constructor(name: string);
    add(name: string, data: T, options?: JobOptions): Promise<Job>;
    addBulk(jobs: Array<{
        name: string;
        data: T;
        options?: JobOptions;
    }>): Promise<Job[]>;
    getJob(jobId: string): Promise<Job | null>;
    getJobs(status?: JobStatus, limit?: number): Promise<Job[]>;
    removeJob(jobId: string): Promise<boolean>;
    process(handler: JobHandler<T>): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    on<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void;
    off<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void;
    clean(grace: number, status?: JobStatus): Promise<number>;
    drain(): Promise<void>;
    close(): Promise<void>;
    private processNext;
}
/**
 * Queue manager for multiple queues
 */
export declare class QueueManager {
    private queues;
    /**
     * Get or create a queue
     */
    getQueue<T = unknown>(name: string): Queue<T>;
    /**
     * List all queues
     */
    listQueues(): string[];
    /**
     * Close all queues
     */
    closeAll(): Promise<void>;
}
export interface EmailJobData {
    to: string | string[];
    subject: string;
    body: string;
    template?: string;
    templateData?: Record<string, unknown>;
}
export interface WebhookJobData {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    retryOn?: number[];
}
export interface NotificationJobData {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    channels?: ('email' | 'push' | 'in-app')[];
}
/**
 * Create queue manager
 */
export declare const createQueueManager: () => QueueManager;
/**
 * Global queue manager instance
 */
export declare const queueManager: QueueManager;
//# sourceMappingURL=queue.d.ts.map