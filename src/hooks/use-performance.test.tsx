import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePerformance } from './use-performance';
import { performanceMonitor } from '@/lib/performance';

vi.mock('@/lib/performance', () => ({
  performanceMonitor: {
    startTrace: vi.fn(() => 'test-trace-id'),
    endTrace: vi.fn(() => ({
      id: 'test-trace-id',
      name: 'test-trace',
      duration: 100,
      tags: {},
    })),
    recordMetric: vi.fn(),
    measureAsyncOperation: vi.fn((name, operation) => operation()),
    measureSyncOperation: vi.fn((name, operation) => operation()),
  },
}));

describe('usePerformance', () => {
  const componentName = 'TestComponent';
  const tags = { testTag: 'value' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes component lifecycle tracking', () => {
    renderHook(() => usePerformance({ componentName, tags }));

    expect(performanceMonitor.startTrace).toHaveBeenCalledWith(
      `${componentName}_lifecycle`,
      expect.objectContaining({
        ...tags,
        event: 'mount',
      })
    );
  });

  it('tracks component unmount', () => {
    const { unmount } = renderHook(() => usePerformance({ componentName, tags }));

    unmount();

    expect(performanceMonitor.endTrace).toHaveBeenCalledWith('test-trace-id');
    expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
      `${componentName}_mount_duration`,
      100,
      expect.objectContaining({
        ...tags,
        renderCount: '1',
      })
    );
  });

  it('tracks render count', () => {
    const { rerender } = renderHook(() => usePerformance({ componentName, tags }));

    rerender();
    rerender();

    expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
      `${componentName}_render_count`,
      2,
      tags
    );
  });

  it('measures async operations', async () => {
    const { result } = renderHook(() => usePerformance({ componentName, tags }));
    const mockOperation = vi.fn().mockResolvedValue('test-result');

    const res = await result.current.measureOperation(
      'test-operation',
      mockOperation,
      { additionalTag: 'value' }
    );

    expect(performanceMonitor.measureAsyncOperation).toHaveBeenCalledWith(
      `${componentName}_test-operation`,
      mockOperation,
      expect.objectContaining({
        ...tags,
        additionalTag: 'value',
      })
    );
    expect(res).toBe('test-result');
  });

  it('measures sync operations', () => {
    const { result } = renderHook(() => usePerformance({ componentName, tags }));
    const mockOperation = vi.fn().mockReturnValue('test-result');

    const res = result.current.measureSync(
      'test-operation',
      mockOperation,
      { additionalTag: 'value' }
    );

    expect(performanceMonitor.measureSyncOperation).toHaveBeenCalledWith(
      `${componentName}_test-operation`,
      mockOperation,
      expect.objectContaining({
        ...tags,
        additionalTag: 'value',
      })
    );
    expect(res).toBe('test-result');
  });

  it('records interactions', () => {
    const { result } = renderHook(() => usePerformance({ componentName, tags }));

    result.current.recordInteraction(
      'test-interaction',
      100,
      { additionalTag: 'value' }
    );

    expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
      `${componentName}_interaction_test-interaction`,
      100,
      expect.objectContaining({
        ...tags,
        additionalTag: 'value',
      })
    );
  });

  it('starts and ends interactions', () => {
    const { result } = renderHook(() => usePerformance({ componentName, tags }));

    const traceId = result.current.startInteraction(
      'test-interaction',
      { additionalTag: 'value' }
    );

    expect(performanceMonitor.startTrace).toHaveBeenCalledWith(
      `${componentName}_interaction_test-interaction`,
      expect.objectContaining({
        ...tags,
        additionalTag: 'value',
        type: 'interaction',
      })
    );

    const trace = result.current.endInteraction(traceId);

    expect(performanceMonitor.endTrace).toHaveBeenCalledWith(traceId);
    expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
      'test-trace_duration',
      100,
      expect.any(Object)
    );
    expect(trace).toBeTruthy();
  });

  it('provides current render count', () => {
    const { result, rerender } = renderHook(() => usePerformance({ componentName }));

    expect(result.current.renderCount).toBe(1);

    rerender();
    expect(result.current.renderCount).toBe(2);

    rerender();
    expect(result.current.renderCount).toBe(3);
  });

  it('handles missing tags gracefully', () => {
    const { result } = renderHook(() => usePerformance({ componentName }));

    result.current.recordInteraction('test-interaction');

    expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
      `${componentName}_interaction_test-interaction`,
      0,
      expect.any(Object)
    );
  });

  it('preserves component name in all operations', () => {
    const { result } = renderHook(() => usePerformance({ componentName }));

    result.current.measureSync('op1', () => {});
    result.current.startInteraction('op2');
    result.current.recordInteraction('op3');

    const calls = vi.mocked(performanceMonitor).startTrace.mock.calls;
    calls.forEach(([name]) => {
      expect(name).toContain(componentName);
    });
  });
}); 