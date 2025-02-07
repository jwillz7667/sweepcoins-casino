import { useEffect, type ReactNode } from 'react';
import { initializeSecurity, shouldRateLimit } from '@/lib/security';
import { SecurityContext } from './security-context';

export function SecurityProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize security measures when the provider mounts
    initializeSecurity();
  }, []);

  const checkRateLimit = async (endpoint: string) => {
    return shouldRateLimit(endpoint);
  };

  return (
    <SecurityContext.Provider value={{ checkRateLimit }}>
      {children}
    </SecurityContext.Provider>
  );
}

export default SecurityProvider; 