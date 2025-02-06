import React, { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/lib/performance';

interface UsePerformanceOptions {
  componentName: string;
  tags?: Record<string, string>;
}

export function usePerformance({ componentName, tags }: UsePerformanceOptions) {
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const traceIdRef = useRef<string | null>(null);

  // Track component mount and unmount
  useEffect(() => {
    mountTimeRef.current = performance.now();
    renderCountRef.current = 0;
    
    traceIdRef.current = performanceMonitor.startTrace(`${componentName}_lifecycle`, {
      ...tags,
      event: 'mount',
    });

    return () => {
      if (traceIdRef.current) {
        const trace = performanceMonitor.endTrace(traceIdRef.current);
        if (trace) {
          performanceMonitor.recordMetric(`${componentName}_mount_duration`, trace.duration || 0, {
            ...tags,
            renderCount: String(renderCountRef.current),
          });
        }
      }
    };
  }, [componentName, tags]);

  // Track render count
  useEffect(() => {
    renderCountRef.current += 1;
    performanceMonitor.recordMetric(`${componentName}_render_count`, renderCountRef.current, tags);
  });

  const measureOperation = useCallback(
    async <T,>(
      operationName: string,
      operation: () => Promise<T>,
      operationTags?: Record<string, string>
    ): Promise<T> => {
      return performanceMonitor.measureAsyncOperation(
        `${componentName}_${operationName}`,
        operation,
        {
          ...tags,
          ...operationTags,
        }
      );
    },
    [componentName, tags]
  );

  const measureSync = useCallback(
    <T,>(
      operationName: string,
      operation: () => T,
      operationTags?: Record<string, string>
    ): T => {
      return performanceMonitor.measureSyncOperation(
        `${componentName}_${operationName}`,
        operation,
        {
          ...tags,
          ...operationTags,
        }
      );
    },
    [componentName, tags]
  );

  const recordInteraction = useCallback(
    (interactionName: string, duration?: number, interactionTags?: Record<string, string>) => {
      performanceMonitor.recordMetric(
        `${componentName}_interaction_${interactionName}`,
        duration || 0,
        {
          ...tags,
          ...interactionTags,
        }
      );
    },
    [componentName, tags]
  );

  const startInteraction = useCallback(
    (interactionName: string, interactionTags?: Record<string, string>): string => {
      return performanceMonitor.startTrace(
        `${componentName}_interaction_${interactionName}`,
        {
          ...tags,
          ...interactionTags,
          type: 'interaction',
        }
      );
    },
    [componentName, tags]
  );

  const endInteraction = useCallback(
    (traceId: string) => {
      const trace = performanceMonitor.endTrace(traceId);
      if (trace) {
        performanceMonitor.recordMetric(
          `${trace.name}_duration`,
          trace.duration || 0,
          trace.tags
        );
      }
      return trace;
    },
    []
  );

  return {
    measureOperation,
    measureSync,
    recordInteraction,
    startInteraction,
    endInteraction,
    renderCount: renderCountRef.current,
  };
}

export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  options: UsePerformanceOptions
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    usePerformance(options);
    return <Component {...props} />;
  };
  
  // Preserve the display name for debugging
  WrappedComponent.displayName = `WithPerformanceTracking(${
    Component.displayName || Component.name || 'Component'
  })`;
  
  return WrappedComponent;
} 