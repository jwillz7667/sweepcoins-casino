import { createContext, useContext } from 'react';

interface SecurityContextType {
  checkRateLimit: (key: string) => boolean;
  validateCSRFToken: (token: string) => boolean;
  validateSession: () => boolean;
  verifyWalletSignature: (address: string, signature: string, message: string) => Promise<boolean>;
  validateWalletConnection: (address: string) => Promise<boolean>;
  verifyTransactionSignature: (transaction: any, signature: string) => Promise<boolean>;
}

export const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}; 