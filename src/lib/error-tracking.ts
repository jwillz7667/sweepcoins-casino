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

class ErrorTracker {
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) {
      return;
    }

    // Initialize error tracking service
    this.isInitialized = true;
  }

  captureError(error: Error | unknown, metadata?: ErrorMetadata) {
    if (!this.isInitialized) {
      this.initialize();
    }

    console.error('Error captured:', error);
    console.log('Error metadata:', metadata);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    }

    // Show user-friendly toast unless silent
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  }

  captureMessage(message: string, metadata?: ErrorMetadata) {
    if (!this.isInitialized) {
      this.initialize();
    }

    console.log('Message captured:', message);
    console.log('Message metadata:', metadata);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    }
  }

  setUser(userId: string) {
    if (!this.isInitialized) {
      this.initialize();
    }

    console.log('Setting user:', userId);

    // In production, set user in error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Set user in error tracking service
    }
  }

  clearUser() {
    if (!this.isInitialized) {
      this.initialize();
    }

    console.log('Clearing user');

    // In production, clear user in error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Clear user in error tracking service
    }
  }
}

export const errorTracking = new ErrorTracker(); 