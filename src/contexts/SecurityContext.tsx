import { createContext, useContext, useEffect, ReactNode } from 'react';
import { initializeSecurity, shouldRateLimit } from '@/lib/security';

interface SecurityContextType {
  checkRateLimit: (endpoint: string) => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

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

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
} 