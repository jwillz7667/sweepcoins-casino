import axios, { AxiosRequestConfig } from 'axios';
import { useSecurity } from '@/contexts/SecurityContext';
import { toast } from 'sonner';

interface UseApiOptions extends AxiosRequestConfig {
  skipRateLimit?: boolean;
}

export function useApi() {
  const { checkRateLimit } = useSecurity();

  const makeRequest = async <T>(
    endpoint: string,
    options: UseApiOptions = {}
  ): Promise<T> => {
    const { skipRateLimit = false, ...axiosOptions } = options;

    try {
      // Check rate limit unless explicitly skipped
      if (!skipRateLimit) {
        const isRateLimited = await checkRateLimit(endpoint);
        if (isRateLimited) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }

      // Make the API request
      const response = await axios(endpoint, {
        ...axiosOptions,
        headers: {
          ...axiosOptions.headers,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
          case 429:
            toast.error('Too many requests. Please try again later.');
            break;
          case 403:
            toast.error('Access denied. Please check your permissions.');
            break;
          case 401:
            toast.error('Authentication required. Please log in.');
            break;
          default:
            toast.error(`Request failed: ${message}`);
        }
      } else {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      }

      throw error;
    }
  };

  return {
    get: <T>(endpoint: string, options?: UseApiOptions) => 
      makeRequest<T>(endpoint, { method: 'GET', ...options }),
    
    post: <T>(endpoint: string, data?: unknown, options?: UseApiOptions) =>
      makeRequest<T>(endpoint, { method: 'POST', data, ...options }),
    
    put: <T>(endpoint: string, data?: unknown, options?: UseApiOptions) =>
      makeRequest<T>(endpoint, { method: 'PUT', data, ...options }),
    
    delete: <T>(endpoint: string, options?: UseApiOptions) =>
      makeRequest<T>(endpoint, { method: 'DELETE', ...options }),
    
    patch: <T>(endpoint: string, data?: unknown, options?: UseApiOptions) =>
      makeRequest<T>(endpoint, { method: 'PATCH', data, ...options }),
  };
} 