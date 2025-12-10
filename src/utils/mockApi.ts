/**
 * Mock API utilities to simulate network requests with delay.
 * This helps demonstrate loading states in the template.
 */

const DEFAULT_DELAY_MS = 1000;

/**
 * Simulates a network request with configurable delay.
 * Returns the provided data after the delay.
 */
export async function mockFetch<T>(data: T, delayMs: number = DEFAULT_DELAY_MS): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delayMs);
    });
}
