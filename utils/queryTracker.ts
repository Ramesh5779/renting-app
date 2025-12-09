import { logger } from "@/utils/logger";

/**
 * Tracks query performance and warns about slow queries
 * @param label - A descriptive label for the query
 * @param fn - The async function that performs the query
 * @returns The result of the query function
 */
export async function trackQuery<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();

    try {
        const result = await fn();
        const duration = Date.now() - start;

        if (duration > 1200) {
            logger.warn(`🐢 SLOW QUERY: "${label}" took ${duration}ms`);
        } else if (duration > 500) {
            logger.log(`⚠️ MODERATE QUERY: "${label}" took ${duration}ms`);
        } else {
            logger.log(`⚡ QUERY OK: "${label}" took ${duration}ms`);
        }

        return result;
    } catch (error) {
        const duration = Date.now() - start;
        logger.error(`❌ QUERY FAILED: "${label}" after ${duration}ms`, error);
        throw error;
    }
}

/**
 * Supabase Watchdog - checks connection every 10 seconds
 */
let watchdogInterval: ReturnType<typeof setInterval> | null = null;

export function startSupabaseWatchdog(
    supabaseClient: any,
    onConnectionLost?: () => void,
    onConnectionRestored?: () => void
) {
    let wasConnected = true;

    watchdogInterval = setInterval(async () => {
        try {
            const start = Date.now();
            const { error } = await supabaseClient
                .from('room_listings')
                .select('id')
                .limit(1)
                .maybeSingle();

            const duration = Date.now() - start;

            if (error) {
                if (wasConnected) {
                    logger.error(`🔌 SUPABASE CONNECTION LOST`, error);
                    wasConnected = false;
                    onConnectionLost?.();
                }
            } else {
                if (!wasConnected) {
                    logger.log(`✅ SUPABASE CONNECTION RESTORED (ping: ${duration}ms)`);
                    wasConnected = true;
                    onConnectionRestored?.();
                } else if (duration > 2000) {
                    logger.warn(`⚠️ SUPABASE SLOW PING: ${duration}ms`);
                }
            }
        } catch (err) {
            if (wasConnected) {
                logger.error(`🔌 SUPABASE WATCHDOG ERROR`, err);
                wasConnected = false;
                onConnectionLost?.();
            }
        }
    }, 10000);

    logger.log("🐕 Supabase Watchdog started (checking every 10s)");
}

export function stopSupabaseWatchdog() {
    if (watchdogInterval) {
        clearInterval(watchdogInterval);
        watchdogInterval = null;
        logger.log("🐕 Supabase Watchdog stopped");
    }
}
