import { toast } from 'sonner';

interface ErrorMetadata {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private initialized: boolean = false;
  private environment: string;

  private constructor() {
    // Simple environment check based on URL
    this.environment = window.location.hostname === 'localhost' ? 'development' : 'production';
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  public initialize(config: { dsn?: string; environment?: string }) {
    if (this.initialized) {
      console.warn('ErrorTrackingService already initialized');
      return;
    }

    // Initialize your error tracking service (e.g., Sentry) here
    // Example:
    // if (config.dsn) {
    //   Sentry.init({
    //     dsn: config.dsn,
    //     environment: config.environment || this.environment,
    //   });
    // }

    this.initialized = true;
  }

  public captureError(error: Error | unknown, metadata?: ErrorMetadata) {
    const errorObject = error instanceof Error ? error : new Error(String(error));
    
    // Log to console in development
    if (this.environment === 'development') {
      console.error('Error captured:', {
        error: errorObject,
        metadata,
        stack: errorObject.stack,
      });
    }

    // Send to error tracking service
    // Example:
    // if (this.initialized) {
    //   Sentry.withScope((scope) => {
    //     if (metadata) {
    //       Object.entries(metadata).forEach(([key, value]) => {
    //         scope.setExtra(key, value);
    //       });
    //     }
    //     Sentry.captureException(errorObject);
    //   });
    // }

    // Show user-friendly toast message
    const userMessage = this.getUserFriendlyMessage(errorObject);
    toast.error(userMessage);

    return errorObject;
  }

  public captureMessage(message: string, metadata?: ErrorMetadata) {
    // Log to console in development
    if (this.environment === 'development') {
      console.log('Message captured:', {
        message,
        metadata,
      });
    }

    // Send to error tracking service
    // Example:
    // if (this.initialized) {
    //   Sentry.withScope((scope) => {
    //     if (metadata) {
    //       Object.entries(metadata).forEach(([key, value]) => {
    //         scope.setExtra(key, value);
    //       });
    //     }
    //     Sentry.captureMessage(message);
    //   });
    // }
  }

  private getUserFriendlyMessage(error: Error): string {
    // Add custom error mapping here
    const errorMessages: Record<string, string> = {
      'Failed to fetch': 'Network error. Please check your internet connection.',
      'Transaction failed': 'Transaction failed. Please try again.',
      'User rejected': 'Transaction was cancelled.',
      'Insufficient funds': 'Insufficient funds in your wallet.',
    };

    // Check if the error message matches any known errors
    for (const [errorPattern, friendlyMessage] of Object.entries(errorMessages)) {
      if (error.message.includes(errorPattern)) {
        return friendlyMessage;
      }
    }

    // Default message for unknown errors
    return this.environment === 'development' 
      ? `Error: ${error.message}`
      : 'An unexpected error occurred. Please try again.';
  }

  public setUser(id: string, email?: string, username?: string) {
    // Set user context for error tracking
    // Example:
    // if (this.initialized) {
    //   Sentry.setUser({
    //     id,
    //     email,
    //     username,
    //   });
    // }
  }

  public clearUser() {
    // Clear user context
    // Example:
    // if (this.initialized) {
    //   Sentry.setUser(null);
    // }
  }
}

export const errorTracking = ErrorTrackingService.getInstance(); 