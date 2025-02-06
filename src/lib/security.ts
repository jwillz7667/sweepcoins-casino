import axios from 'axios';
import { toast } from 'sonner';

// Types
interface RateLimitConfig {
  windowMs: number;
  max: number;
}

interface CSRFConfig {
  cookieName: string;
  headerName: string;
}

// Configuration
const rateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

const csrfConfig: CSRFConfig = {
  cookieName: 'csrf-token',
  headerName: 'X-CSRF-Token'
};

// CSRF Token generation
const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

// Setup axios interceptors for security
export const setupSecurityInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Add CSRF token to headers
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${csrfConfig.cookieName}=`))
        ?.split('=')[1];

      if (csrfToken) {
        config.headers[csrfConfig.headerName] = csrfToken;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Handle rate limit headers if present
      const remainingRequests = response.headers['x-ratelimit-remaining'];
      if (remainingRequests && parseInt(remainingRequests) < 10) {
        toast.warning('API rate limit approaching, please slow down requests');
      }

      return response;
    },
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 429: // Too Many Requests
            toast.error('Rate limit exceeded. Please try again later.');
            break;
          case 403: // Forbidden (CSRF token invalid)
            toast.error('Security validation failed. Please refresh the page.');
            break;
          default:
            // Handle other errors
            break;
        }
      }
      return Promise.reject(error);
    }
  );
};

// Initialize security measures
export const initializeSecurity = () => {
  // Set up CSRF token if not present
  if (!document.cookie.includes(csrfConfig.cookieName)) {
    const newToken = generateCSRFToken();
    document.cookie = `${csrfConfig.cookieName}=${newToken}; path=/; secure; samesite=strict`;
  }

  // Set up axios interceptors
  setupSecurityInterceptors();
};

// Utility function to check if request should be rate limited
export const shouldRateLimit = async (endpoint: string): Promise<boolean> => {
  try {
    const key = `rate-limit:${endpoint}`;
    const now = Date.now();
    
    // In a real implementation, this would use Redis or another storage solution
    // This is a simplified example using localStorage
    const stored = localStorage.getItem(key);
    const requests = stored ? JSON.parse(stored) : { count: 0, timestamp: now };
    
    if (now - requests.timestamp > rateLimitConfig.windowMs) {
      // Reset if window has passed
      requests.count = 1;
      requests.timestamp = now;
    } else if (requests.count >= rateLimitConfig.max) {
      return true; // Should rate limit
    } else {
      requests.count++;
    }
    
    localStorage.setItem(key, JSON.stringify(requests));
    return false;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return false; // Fail open if there's an error checking
  }
};

// Export configurations for use in other parts of the application
export const securityConfig = {
  csrf: csrfConfig,
  rateLimit: rateLimitConfig
}; 