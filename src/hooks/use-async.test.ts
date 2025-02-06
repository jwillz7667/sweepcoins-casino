import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync, useAsyncCallback } from './use-async';
import { errorTracking } from '@/lib/error-tracking';

vi.mock('@/lib/error-tracking', () => ({
  errorTracking: {
    captureError: vi.fn((error) => error),
  },
}));

describe('useAsync', () => {
  it('handles successful async operations', async () => {
    const mockData = { id: 1, name: 'test' };
    const mockFn = vi.fn().mockResolvedValue(mockData);
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useAsync(mockFn, { onSuccess })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    const executePromise = act(async () => {
      const res = await result.current.execute();
      expect(res).toEqual({ success: true, data: mockData });
    });

    expect(result.current.isLoading).toBe(true);

    await executePromise;

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockData);
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it('handles async errors', async () => {
    const error = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useAsync(mockFn, { onError })
    );

    const executePromise = act(async () => {
      const res = await result.current.execute();
      expect(res).toEqual({ success: false, error });
    });

    await executePromise;

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeNull();
    expect(onError).toHaveBeenCalledWith(error);
    expect(errorTracking.captureError).toHaveBeenCalledWith(error, expect.any(Object));
  });

  it('resets state correctly', async () => {
    const mockData = { id: 1, name: 'test' };
    const mockFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useAsyncCallback', () => {
  it('handles successful async operations', async () => {
    const mockData = { id: 1, name: 'test' };
    const mockFn = vi.fn().mockResolvedValue(mockData);
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useAsyncCallback(mockFn, { onSuccess })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    const executePromise = act(async () => {
      const res = await result.current.execute();
      expect(res).toEqual(mockData);
    });

    expect(result.current.isLoading).toBe(true);

    await executePromise;

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it('handles async errors', async () => {
    const error = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useAsyncCallback(mockFn, { onError })
    );

    const executePromise = act(async () => {
      const res = await result.current.execute();
      expect(res).toEqual({ success: false, error });
    });

    await executePromise;

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(error);
    expect(onError).toHaveBeenCalledWith(error);
    expect(errorTracking.captureError).toHaveBeenCalledWith(error, expect.any(Object));
  });

  it('resets state correctly', async () => {
    const error = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useAsyncCallback(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toEqual(error);

    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('preserves error metadata', async () => {
    const error = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(error);
    const errorMetadata = { component: 'TestComponent', action: 'testAction' };

    const { result } = renderHook(() =>
      useAsyncCallback(mockFn, { errorMetadata })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(errorTracking.captureError).toHaveBeenCalledWith(
      error,
      expect.objectContaining(errorMetadata)
    );
  });

  it('handles multiple executions correctly', async () => {
    const mockFn = vi.fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockRejectedValueOnce(new Error('Test error'))
      .mockResolvedValueOnce({ id: 2 });

    const { result } = renderHook(() => useAsyncCallback(mockFn));

    // First execution - success
    await act(async () => {
      const res = await result.current.execute();
      expect(res).toEqual({ id: 1 });
    });

    expect(result.current.error).toBeNull();

    // Second execution - error
    await act(async () => {
      const res = await result.current.execute();
      expect(res).toEqual({ success: false, error: expect.any(Error) });
    });

    expect(result.current.error).toBeTruthy();

    // Third execution - success
    await act(async () => {
      const res = await result.current.execute();
      expect(res).toEqual({ id: 2 });
    });

    expect(result.current.error).toBeNull();
  });
}); 