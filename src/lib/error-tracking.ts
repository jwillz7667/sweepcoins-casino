import { toast } from 'sonner';

interface ErrorConfig {
  silent?: boolean;
  context?: Record<string, unknown>;
}

interface ErrorMetadata {
  component?: string;
  action?: string;
  [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === 'development';

class ErrorTracker {
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) {
      return;
    }

    // Initialize error tracking service
    this.isInitialized = true;
  }

  private log(...args: unknown[]) {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  private logError(...args: unknown[]) {
    if (isDevelopment) {
      console.error(...args);
    }
  }

  captureError(error: Error | unknown, config?: ErrorConfig) {
    if (!this.isInitialized) {
      this.initialize();
    }

    this.logError('Error captured:', error);
    this.log('Error config:', config);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    }

    // Show user-friendly toast unless silent
    if (!config?.silent) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  }

  captureMessage(message: string, metadata?: ErrorMetadata) {
    if (!this.isInitialized) {
      this.initialize();
    }

    this.log('Message captured:', message);
    this.log('Message metadata:', metadata);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    }
  }

  setUser(userId: string) {
    if (!this.isInitialized) {
      this.initialize();
    }

    this.log('Setting user:', userId);

    // In production, set user in error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Set user in error tracking service
    }
  }

  clearUser() {
    if (!this.isInitialized) {
      this.initialize();
    }

    this.log('Clearing user');

    // In production, clear user in error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Clear user in error tracking service
    }
  }
}

export const errorTracking = new ErrorTracker(); 