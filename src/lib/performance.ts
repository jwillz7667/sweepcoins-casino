// Web Performance API Types
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
}

interface LargestContentfulPaint extends PerformanceEntry {
  element: Element | null;
  renderTime: number;
  loadTime: number;
  size: number;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  duration: number;
  cancelable: boolean;
  target: Node | null;
}

interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
}

interface PerformanceTrace {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags?: Record<string, string>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private traces: Map<string, PerformanceTrace>;
  private metrics: PerformanceMetric[];
  private initialized: boolean;

  private constructor() {
    this.traces = new Map();
    this.metrics = [];
    this.initialized = false;
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public initialize() {
    if (this.initialized) {
      console.warn('PerformanceMonitor already initialized');
      return;
    }

    // Initialize performance monitoring service (e.g., New Relic, DataDog)
    // Example:
    // if (process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING_KEY) {
    //   NewRelic.initialize({
    //     apiKey: process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING_KEY,
    //   });
    // }

    // Set up performance observer
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry) => {
          this.recordMetric(entry.name, entry.startTime);
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Observe layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Type assertion for LayoutShift
          const layoutShift = entry as LayoutShift;
          if (!layoutShift.hadRecentInput) {
            this.recordMetric('cumulative-layout-shift', layoutShift.value);
          }
        });
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as LargestContentfulPaint;
        this.recordMetric('largest-contentful-paint', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Type assertion for FirstInputDelay
          const firstInput = entry as PerformanceEventTiming;
          this.recordMetric(
            'first-input-delay',
            firstInput.processingStart - firstInput.startTime
          );
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }

    this.initialized = true;
  }

  public startTrace(name: string, tags?: Record<string, string>): string {
    const id = crypto.randomUUID();
    this.traces.set(id, {
      id,
      name,
      startTime: performance.now(),
      tags,
    });
    return id;
  }

  public endTrace(id: string) {
    const trace = this.traces.get(id);
    if (!trace) {
      console.warn(`No trace found with id: ${id}`);
      return;
    }

    trace.endTime = performance.now();
    trace.duration = trace.endTime - trace.startTime;

    // Send trace data to monitoring service
    // Example:
    // if (this.initialized) {
    //   NewRelic.recordCustomEvent('Trace', {
    //     name: trace.name,
    //     duration: trace.duration,
    //     ...trace.tags,
    //   });
    // }

    this.traces.delete(id);
    return trace;
  }

  public recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      tags,
    };

    this.metrics.push(metric);

    // Send metric to monitoring service
    // Example:
    // if (this.initialized) {
    //   NewRelic.recordMetric(name, value, tags);
    // }

    return metric;
  }

  public async measureAsyncOperation<T>(
    name: string,
    operation: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const traceId = this.startTrace(name, tags);
    
    try {
      const result = await operation();
      return result;
    } finally {
      this.endTrace(traceId);
    }
  }

  public measureSyncOperation<T>(
    name: string,
    operation: () => T,
    tags?: Record<string, string>
  ): T {
    const traceId = this.startTrace(name, tags);
    
    try {
      const result = operation();
      return result;
    } finally {
      this.endTrace(traceId);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public clearMetrics() {
    this.metrics = [];
  }

  public getActiveTraces(): PerformanceTrace[] {
    return Array.from(this.traces.values());
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance(); 