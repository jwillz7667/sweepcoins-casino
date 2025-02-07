import { createContext, useContext } from 'react';

export interface SecurityContextType {
  checkRateLimit: (endpoint: string) => Promise<boolean>;
}

export const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
} 