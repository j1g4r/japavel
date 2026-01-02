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

export type JobStatus = z.infer<typeof JobStatusSchema>;

// Job priority
export const JobPrioritySchema = z.enum(['low', 'normal', 'high', 'critical']);

export type JobPriority = z.infer<typeof JobPrioritySchema>;

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

export type Job = z.infer<typeof JobSchema>;

// Job options
export interface JobOptions {
  priority?: JobPriority;
  delay?: number;
  attempts?: number;
  backoff?: number;
  timeout?: number;
  tenantId?: string;
  scheduledFor?: Date;
}

// Job handler
export type JobHandler<T = unknown, R = unknown> = (
  job: Job & { data: T }
) => Promise<R>;

// Queue events
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

  // Job operations
  add(name: string, data: T, options?: JobOptions): Promise<Job>;
  addBulk(jobs: Array<{ name: string; data: T; options?: JobOptions }>): Promise<Job[]>;
  getJob(jobId: string): Promise<Job | null>;
  getJobs(status?: JobStatus, limit?: number): Promise<Job[]>;
  removeJob(jobId: string): Promise<boolean>;

  // Processing
  process(handler: JobHandler<T>): void;
  pause(): Promise<void>;
  resume(): Promise<void>;

  // Events
  on<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void;
  off<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void;

  // Cleanup
  clean(grace: number, status?: JobStatus): Promise<number>;
  drain(): Promise<void>;
  close(): Promise<void>;
}

/**
 * In-memory queue implementation (for development/testing)
 */
export class MemoryQueue<T = unknown> implements Queue<T> {
  readonly name: string;
  private jobs = new Map<string, Job>();
  private handlers: JobHandler<T>[] = [];
  private events = new EventEmitter();
  private processing = false;
  private paused = false;

  constructor(name: string) {
    this.name = name;
  }

  async add(name: string, data: T, options: JobOptions = {}): Promise<Job> {
    const job: Job = {
      id: crypto.randomUUID(),
      queue: this.name,
      name,
      data: data as Record<string, unknown>,
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

  async addBulk(
    jobs: Array<{ name: string; data: T; options?: JobOptions }>
  ): Promise<Job[]> {
    return Promise.all(jobs.map(j => this.add(j.name, j.data, j.options)));
  }

  async getJob(jobId: string): Promise<Job | null> {
    return this.jobs.get(jobId) || null;
  }

  async getJobs(status?: JobStatus, limit = 100): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());

    if (status) {
      jobs = jobs.filter(j => j.status === status);
    }

    return jobs.slice(0, limit);
  }

  async removeJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (job.status === 'running') {
      return false; // Can't remove running jobs
    }

    return this.jobs.delete(jobId);
  }

  process(handler: JobHandler<T>): void {
    this.handlers.push(handler);
    this.processNext();
  }

  async pause(): Promise<void> {
    this.paused = true;
  }

  async resume(): Promise<void> {
    this.paused = false;
    this.processNext();
  }

  on<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void {
    this.events.on(event, listener as (...args: unknown[]) => void);
  }

  off<K extends keyof QueueEvents>(event: K, listener: QueueEvents[K]): void {
    this.events.off(event, listener as (...args: unknown[]) => void);
  }

  async clean(grace: number, status?: JobStatus): Promise<number> {
    const now = Date.now();
    let removed = 0;

    for (const [id, job] of this.jobs) {
      if (status && job.status !== status) continue;

      const completedAt = job.completedAt?.getTime() || 0;
      if (now - completedAt > grace) {
        this.jobs.delete(id);
        removed++;
      }
    }

    return removed;
  }

  async drain(): Promise<void> {
    // Wait for all jobs to complete
    while (this.processing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async close(): Promise<void> {
    this.paused = true;
    this.handlers = [];
    this.events.removeAllListeners();
  }

  private async processNext(): Promise<void> {
    if (this.processing || this.paused || this.handlers.length === 0) {
      return;
    }

    // Find next pending job
    const priorityOrder: JobPriority[] = ['critical', 'high', 'normal', 'low'];
    let nextJob: Job | undefined;

    for (const priority of priorityOrder) {
      for (const job of this.jobs.values()) {
        if (job.status !== 'pending') continue;
        if (job.priority !== priority) continue;

        // Check delay
        if (job.delay > 0) {
          const delayUntil = job.createdAt.getTime() + job.delay;
          if (Date.now() < delayUntil) continue;
        }

        // Check scheduled time
        if (job.scheduledFor && Date.now() < job.scheduledFor.getTime()) {
          continue;
        }

        nextJob = job;
        break;
      }

      if (nextJob) break;
    }

    if (!nextJob) return;

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
        handler(job as Job & { data: T }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Job timeout')), job.timeout)
        ),
      ]);

      job.status = 'completed';
      job.completedAt = new Date();
      job.result = result;
      job.progress = 100;
      this.events.emit('job:completed', job, result);
    } catch (error) {
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
      } else {
        job.status = 'failed';
        job.completedAt = new Date();
        job.error = err.message;
        this.events.emit('job:failed', job, err);
      }
    } finally {
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
  private queues = new Map<string, Queue>();

  /**
   * Get or create a queue
   */
  getQueue<T = unknown>(name: string): Queue<T> {
    let queue = this.queues.get(name);
    if (!queue) {
      queue = new MemoryQueue<T>(name);
      this.queues.set(name, queue);
    }
    return queue as Queue<T>;
  }

  /**
   * List all queues
   */
  listQueues(): string[] {
    return Array.from(this.queues.keys());
  }

  /**
   * Close all queues
   */
  async closeAll(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    this.queues.clear();
  }
}

// Default job types
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
export const createQueueManager = (): QueueManager => {
  return new QueueManager();
};

/**
 * Global queue manager instance
 */
export const queueManager = createQueueManager();
