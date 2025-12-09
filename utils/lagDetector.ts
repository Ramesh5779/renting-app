import { logger } from "@/utils/logger";

/**
 * JS Thread Lag Detector
 * Detects when the JavaScript thread is blocked for more than 100ms
 */

let lastTime = Date.now();
let lagDetectorInterval: ReturnType<typeof setInterval> | null = null;
let totalLags = 0;
let maxLag = 0;

export function startLagDetector(thresholdMs: number = 100) {
    if (lagDetectorInterval) {
        console.warn("Lag detector already running");
        return;
    }

    lastTime = Date.now();
    totalLags = 0;
    maxLag = 0;

    lagDetectorInterval = setInterval(() => {
        const now = Date.now();
        const diff = now - lastTime;

        if (diff > thresholdMs) {
            totalLags++;
            if (diff > maxLag) maxLag = diff;

            logger.warn(`🧊 JS THREAD LAG: ${diff}ms (total lags: ${totalLags}, max: ${maxLag}ms)`);
        }

        lastTime = now;
    }, 50); // Check every 50ms

    logger.log(`🔍 Lag detector started (threshold: ${thresholdMs}ms)`);
}

export function stopLagDetector() {
    if (lagDetectorInterval) {
        clearInterval(lagDetectorInterval);
        lagDetectorInterval = null;
        logger.log(`🔍 Lag detector stopped (total lags: ${totalLags}, max: ${maxLag}ms)`);
    }
}

export function getLagStats() {
    return { totalLags, maxLag };
}

/**
 * Deep Freeze Monitor
 * Detects complete JS thread freezes (stalls > 500ms)
 */
let freezeTimeout: ReturnType<typeof setTimeout> | null = null;
let freezeCheckInterval: ReturnType<typeof setInterval> | null = null;

export function startFreezeMonitor(freezeThresholdMs: number = 500) {
    const resetTimeout = () => {
        if (freezeTimeout) clearTimeout(freezeTimeout);
        freezeTimeout = setTimeout(() => {
            logger.error(`🥶 DEEP FREEZE DETECTED: JS thread stalled for >${freezeThresholdMs}ms`);
        }, freezeThresholdMs);
    };

    freezeCheckInterval = setInterval(resetTimeout, 100);
    resetTimeout();

    logger.log(`❄️ Freeze monitor started (threshold: ${freezeThresholdMs}ms)`);
}

export function stopFreezeMonitor() {
    if (freezeCheckInterval) clearInterval(freezeCheckInterval);
    if (freezeTimeout) clearTimeout(freezeTimeout);
    freezeCheckInterval = null;
    freezeTimeout = null;
    logger.log("❄️ Freeze monitor stopped");
}
