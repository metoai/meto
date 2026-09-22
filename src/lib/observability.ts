/**
 * Measures the latency of an asynchronous operation and logs it.
 * This satisfies the observability requirement for the fast path.
 */
export async function measureLatency<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await operation();
    const durationMs = performance.now() - start;
    console.log(`[METRICS] ${operationName} completed in ${durationMs.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const durationMs = performance.now() - start;
    console.error(`[METRICS] ${operationName} failed after ${durationMs.toFixed(2)}ms`, error);
    throw error;
  }
}
