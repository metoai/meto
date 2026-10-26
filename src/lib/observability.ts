export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  correlationId?: string;
  userId?: string;
  durationMs?: number;
  operation?: string;
  [key: string]: unknown;
}

/**
 * Generates an opaque, traceable request correlation ID.
 * Works seamlessly in Node.js, Vercel Edge Runtime, and browser environments.
 */
export function generateCorrelationId(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return `req_${globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  }
  return `req_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/**
 * Structured JSON logger for production observability.
 */
export const logger = {
  log(level: LogLevel, message: string, context?: LogContext) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };

    if (level === "error") {
      console.error(JSON.stringify(payload));
    } else if (level === "warn") {
      console.warn(JSON.stringify(payload));
    } else {
      console.log(JSON.stringify(payload));
    }
  },

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  },

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  },

  error(message: string, context?: LogContext) {
    this.log("error", message, context);
  },

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", message, context);
    }
  },
};

/**
 * Measures the latency of an asynchronous operation and logs structured metrics.
 */
export async function measureLatency<T>(
  operationName: string,
  operation: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = performance.now();
  const correlationId = context?.correlationId ?? generateCorrelationId();

  try {
    const result = await operation();
    const durationMs = Number((performance.now() - start).toFixed(2));
    logger.info(`${operationName} completed`, {
      ...context,
      correlationId,
      operation: operationName,
      durationMs,
    });
    return result;
  } catch (error) {
    const durationMs = Number((performance.now() - start).toFixed(2));
    logger.error(`${operationName} failed`, {
      ...context,
      correlationId,
      operation: operationName,
      durationMs,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
