import { z } from 'zod';
import { EventEmitter } from 'events';
/**
 * Queue System Interface
 * Provides a unified queue interface for background job processing
 */
// Job status
export const JobStatusSchema = z.enum([
    'pending',
    'running',
    'completed',
    'failed',
    'retrying',
    'cancelled',
]);
// Job priority
export const JobPrioritySchema = z.enum(['low', 'normal', 'high', 'critical']);
// Job schema
export const JobSchema = z.object({
    id: z.string().uuid(),
    queue: z.string(),
    name: z.string(),
    data: z.record(z.unknown()),
    status: JobStatusSchema.default('pending'),
    priority: JobPrioritySchema.default('normal'),
    attempts: z.number().int().min(0).default(0),
    maxAttempts: z.number().int().min(1).default(3),
    backoff: z.number().int().min(0).default(1000),
    timeout: z.number().int().min(0).default(30000),
    delay: z.number().int().min(0).default(0),
    result: z.unknown().optional(),
    error: z.string().optional(),
    progress: z.number().min(0).max(100).default(0),
    createdAt: z.date(),
    startedAt: z.date().optional(),
    completedAt: z.date().optional(),
    scheduledFor: z.date().optional(),
    tenantId: z.string().uuid().optional(),
});
/**
 * In-memory queue implementation (for development/testing)
 */
export class MemoryQueue {
    name;
    jobs = new Map();
    handlers = [];
    events = new EventEmitter();
    processing = false;
    paused = false;
    constructor(name) {
        this.name = name;
    }
    async add(name, data, options = {}) {
        const job = {
            id: crypto.randomUUID(),
            queue: this.name,
            name,
            data: data,
            status: 'pending',
            priority: options.priority || 'normal',
            attempts: 0,
            maxAttempts: options.attempts || 3,
            backoff: options.backoff || 1000,
            timeout: options.timeout || 30000,
            delay: options.delay || 0,
            progress: 0,
            createdAt: new Date(),
            scheduledFor: options.scheduledFor,
            tenantId: options.tenantId,
        };
        this.jobs.set(job.id, job);
        this.events.emit('job:added', job);
        // Start processing if not already
        this.processNext();
        return job;
    }
    async addBulk(jobs) {
        return Promise.all(jobs.map(j => this.add(j.name, j.data, j.options)));
    }
    async getJob(jobId) {
        return this.jobs.get(jobId) || null;
    }
    async getJobs(status, limit = 100) {
        let jobs = Array.from(this.jobs.values());
        if (status) {
            jobs = jobs.filter(j => j.status === status);
        }
        return jobs.slice(0, limit);
    }
    async removeJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job)
            return false;
        if (job.status === 'running') {
            return false; // Can't remove running jobs
        }
        return this.jobs.delete(jobId);
    }
    process(handler) {
        this.handlers.push(handler);
        this.processNext();
    }
    async pause() {
        this.paused = true;
    }
    async resume() {
        this.paused = false;
        this.processNext();
    }
    on(event, listener) {
        this.events.on(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    async clean(grace, status) {
        const now = Date.now();
        let removed = 0;
        for (const [id, job] of this.jobs) {
            if (status && job.status !== status)
                continue;
            const completedAt = job.completedAt?.getTime() || 0;
            if (now - completedAt > grace) {
                this.jobs.delete(id);
                removed++;
            }
        }
        return removed;
    }
    async drain() {
        // Wait for all jobs to complete
        while (this.processing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    async close() {
        this.paused = true;
        this.handlers = [];
        this.events.removeAllListeners();
    }
    async processNext() {
        if (this.processing || this.paused || this.handlers.length === 0) {
            return;
        }
        // Find next pending job
        const priorityOrder = ['critical', 'high', 'normal', 'low'];
        let nextJob;
        for (const priority of priorityOrder) {
            for (const job of this.jobs.values()) {
                if (job.status !== 'pending')
                    continue;
                if (job.priority !== priority)
                    continue;
                // Check delay
                if (job.delay > 0) {
                    const delayUntil = job.createdAt.getTime() + job.delay;
                    if (Date.now() < delayUntil)
                        continue;
                }
                // Check scheduled time
                if (job.scheduledFor && Date.now() < job.scheduledFor.getTime()) {
                    continue;
                }
                nextJob = job;
                break;
            }
            if (nextJob)
                break;
        }
        if (!nextJob)
            return;
        this.processing = true;
        const job = nextJob;
        try {
            job.status = 'running';
            job.startedAt = new Date();
            job.attempts++;
            this.events.emit('job:started', job);
            // Run handler with timeout
            const handler = this.handlers[0];
            const result = await Promise.race([
                handler(job),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Job timeout')), job.timeout)),
            ]);
            job.status = 'completed';
            job.completedAt = new Date();
            job.result = result;
            job.progress = 100;
            this.events.emit('job:completed', job, result);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            if (job.attempts < job.maxAttempts) {
                job.status = 'retrying';
                job.error = err.message;
                this.events.emit('job:retrying', job, err);
                // Schedule retry with backoff
                const backoffDelay = job.backoff * Math.pow(2, job.attempts - 1);
                setTimeout(() => {
                    job.status = 'pending';
                    this.processNext();
                }, backoffDelay);
            }
            else {
                job.status = 'failed';
                job.completedAt = new Date();
                job.error = err.message;
                this.events.emit('job:failed', job, err);
            }
        }
        finally {
            this.processing = false;
            // Process next job
            setImmediate(() => this.processNext());
        }
    }
}
/**
 * Queue manager for multiple queues
 */
export class QueueManager {
    queues = new Map();
    /**
     * Get or create a queue
     */
    getQueue(name) {
        let queue = this.queues.get(name);
        if (!queue) {
            queue = new MemoryQueue(name);
            this.queues.set(name, queue);
        }
        return queue;
    }
    /**
     * List all queues
     */
    listQueues() {
        return Array.from(this.queues.keys());
    }
    /**
     * Close all queues
     */
    async closeAll() {
        for (const queue of this.queues.values()) {
            await queue.close();
        }
        this.queues.clear();
    }
}
/**
 * Create queue manager
 */
export const createQueueManager = () => {
    return new QueueManager();
};
/**
 * Global queue manager instance
 */
export const queueManager = createQueueManager();
