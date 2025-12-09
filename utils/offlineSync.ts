import { logger } from "@/utils/logger";

/**
 * Offline Sync Queue
 * Stores operations that need to be synced when back online
 */

export interface OfflineJob {
    id: string;
    type: 'create' | 'update' | 'delete';
    table: string;
    data: any;
    timestamp: number;
    retryCount: number;
}

const offlineQueue: OfflineJob[] = [];
const MAX_RETRIES = 3;

export function addOfflineJob(job: Omit<OfflineJob, 'id' | 'timestamp' | 'retryCount'>) {
    const newJob: OfflineJob = {
        ...job,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
    };

    offlineQueue.push(newJob);
    logger.warn(`📦 QUEUED OFFLINE JOB: ${job.type} on ${job.table}`, { id: newJob.id });

    return newJob.id;
}

export function getOfflineQueue(): OfflineJob[] {
    return [...offlineQueue];
}

export function getQueueLength(): number {
    return offlineQueue.length;
}

export function removeJob(jobId: string): boolean {
    const index = offlineQueue.findIndex(j => j.id === jobId);
    if (index !== -1) {
        offlineQueue.splice(index, 1);
        logger.log(`✅ REMOVED JOB: ${jobId}`);
        return true;
    }
    return false;
}

export function incrementRetry(jobId: string): boolean {
    const job = offlineQueue.find(j => j.id === jobId);
    if (job) {
        job.retryCount++;
        if (job.retryCount >= MAX_RETRIES) {
            logger.error(`❌ JOB FAILED PERMANENTLY: ${jobId} after ${MAX_RETRIES} retries`);
            removeJob(jobId);
            return false;
        }
        return true;
    }
    return false;
}

export function clearQueue() {
    const count = offlineQueue.length;
    offlineQueue.length = 0;
    logger.log(`🗑️ CLEARED ${count} offline jobs`);
}

/**
 * Process offline queue when back online
 */
export async function processOfflineQueue(
    processor: (job: OfflineJob) => Promise<boolean>
): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    const jobs = [...offlineQueue];

    for (const job of jobs) {
        try {
            const result = await processor(job);
            if (result) {
                removeJob(job.id);
                success++;
                logger.log(`✅ SYNCED: ${job.type} on ${job.table}`);
            } else {
                if (!incrementRetry(job.id)) {
                    failed++;
                }
            }
        } catch (error) {
            logger.error(`❌ SYNC ERROR: ${job.id}`, error);
            if (!incrementRetry(job.id)) {
                failed++;
            }
        }
    }

    logger.log(`📊 SYNC COMPLETE: ${success} success, ${failed} failed, ${offlineQueue.length} remaining`);

    return { success, failed };
}

/**
 * Debug inspector for offline queue
 */
export function inspectQueue(): void {
    logger.log("📦 OFFLINE QUEUE INSPECTION", {
        totalJobs: offlineQueue.length,
        jobs: offlineQueue.map(j => ({
            id: j.id,
            type: j.type,
            table: j.table,
            age: `${Math.round((Date.now() - j.timestamp) / 1000)}s`,
            retries: j.retryCount,
        })),
    });
}
