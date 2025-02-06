import { useState, useCallback } from 'react';
import { errorTracking } from '@/lib/error-tracking';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  errorMetadata?: Record<string, unknown>;
}

type AsyncFunction<T> = (...args: unknown[]) => Promise<T>;

export function useAsync<T>(
  asyncFunction: AsyncFunction<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      try {
        setState((prevState) => ({
          ...prevState,
          isLoading: true,
          error: null,
        }));

        const data = await asyncFunction(...args);

        setState({
          data,
          isLoading: false,
          error: null,
        });

        options.onSuccess?.(data);
        return { success: true as const, data };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        errorTracking.captureError(error, {
          action: asyncFunction.name,
          ...options.errorMetadata,
        });

        setState({
          data: null,
          isLoading: false,
          error,
        });

        options.onError?.(error);
        return { success: false as const, error };
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    execute,
    reset,
    ...state,
  };
}

export function useAsyncCallback<T>(
  asyncFunction: AsyncFunction<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: unknown[]) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await asyncFunction(...args);
        options.onSuccess?.(result);
        return { success: true as const, data: result };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        errorTracking.captureError(error, {
          action: asyncFunction.name,
          ...options.errorMetadata,
        });

        setError(error);
        options.onError?.(error);
        return { success: false as const, error };
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    execute,
    reset,
    isLoading,
    error,
  };
}

export function withErrorBoundary<T extends AsyncFunction<unknown>>(
  asyncFunction: T,
  metadata?: Record<string, unknown>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await asyncFunction(...args);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      errorTracking.captureError(error, metadata);
      throw error;
    }
  }) as T;
} 