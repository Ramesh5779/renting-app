/**
 * Timeout utility to prevent indefinite hanging of async operations
 */

/**
 * Wraps a promise with a timeout
 * @param promise - The promise to wrap (or PromiseLike such as Supabase query builders)
 * @param ms - Timeout in milliseconds
 * @param errorMessage - Custom error message for timeout
 * @returns Promise that rejects if timeout is reached
 */
export async function withTimeout<T>(
    promise: PromiseLike<T>,
    ms: number,
    errorMessage = 'Operation timed out'
): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), ms)
    );

    return Promise.race([promise, timeout]);
}

/**
 * Wraps a promise with a timeout and AbortController for cancellable requests
 * @param promiseFn - Function that accepts AbortSignal and returns a promise
 * @param ms - Timeout in milliseconds
 * @returns Promise that rejects if timeout is reached and aborts the operation
 */
export async function withAbortTimeout<T>(
    promiseFn: (signal: AbortSignal) => Promise<T>,
    ms: number
): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);

    try {
        return await promiseFn(controller.signal);
    } finally {
        clearTimeout(timeout);
    }
}
