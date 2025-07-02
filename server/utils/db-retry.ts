/**
 * Utility for retrying database operations with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  onRetry: (error, attempt) => {
    console.warn(`Database operation retry attempt ${attempt}:`, error.message);
  }
};

export async function withDbRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      const isRetryable = 
        error instanceof Error && (
          error.message.includes('timeout') ||
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('Connection terminated') ||
          error.message.includes('Database not initialized')
        );
      
      if (!isRetryable || attempt === opts.maxRetries) {
        throw error;
      }
      
      opts.onRetry(lastError, attempt);
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelay);
    }
  }
  
  throw lastError || new Error('Database operation failed after retries');
}

/**
 * Wrapper for database queries that adds automatic retry logic
 */
export function createDbQueryWrapper<T extends (...args: any[]) => Promise<any>>(
  queryFn: T,
  options?: RetryOptions
): T {
  return (async (...args: Parameters<T>) => {
    return withDbRetry(() => queryFn(...args), options);
  }) as T;
} 