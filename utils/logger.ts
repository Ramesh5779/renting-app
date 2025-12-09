/**
 * Logger utility for development and production environments
 * Logs are only output in development mode (__DEV__ = true)
 * In production, logging is disabled for performance and security
 */

import { Platform, ToastAndroid } from 'react-native';

const isDevelopment = __DEV__;

// Store logs for debug console
const MAX_LOGS = 500;
const logStore: { level: string; message: string; timestamp: string; data?: any }[] = [];

function addToLogStore(level: string, message: string, data?: any) {
    const entry = {
        level,
        message: typeof message === 'string' ? message : JSON.stringify(message),
        timestamp: new Date().toISOString(),
        data,
    };
    logStore.push(entry);
    if (logStore.length > MAX_LOGS) {
        logStore.shift();
    }
}

function showErrorToast(message: string) {
    if (Platform.OS === 'android' && isDevelopment) {
        ToastAndroid.show(`🔥 ${message}`, ToastAndroid.LONG);
    }
}

export const logger = {
    /**
     * Get all stored logs
     */
    logs: logStore,

    /**
     * Clear all stored logs
     */
    clearLogs: () => {
        logStore.length = 0;
    },

    /**
     * Log general information (development only)
     */
    log: (message: string, data?: any) => {
        addToLogStore('log', message, data);
        if (isDevelopment) {
            console.log(message, data ?? '');
        }
    },

    /**
     * Log warnings (development only)
     */
    warn: (message: string, data?: any) => {
        addToLogStore('warn', message, data);
        if (isDevelopment) {
            console.warn(message, data ?? '');
        }
    },

    /**
     * Log errors (development only, production sends to Sentry)
     */
    error: (message: string, data?: any) => {
        addToLogStore('error', message, data);
        showErrorToast(typeof message === 'string' ? message.slice(0, 50) : 'Error occurred');

        if (isDevelopment) {
            console.error(message, data ?? '');
        } else {
            // In production, send to Sentry if available
            // @ts-ignore
            if (typeof Sentry !== 'undefined') {
                const error = data instanceof Error ? data : new Error(message);
                // @ts-ignore
                Sentry.captureException(error);
            }
        }
    },

    /**
     * Log informational messages (development only)
     */
    info: (message: string, data?: any) => {
        addToLogStore('info', message, data);
        if (isDevelopment) {
            console.info(message, data ?? '');
        }
    },

    /**
     * Log debug information (development only)
     */
    debug: (message: string, data?: any) => {
        addToLogStore('debug', message, data);
        if (isDevelopment) {
            console.debug(message, data ?? '');
        }
    },
};

