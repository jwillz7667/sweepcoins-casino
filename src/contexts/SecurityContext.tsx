import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import {
  initializeSecurity,
  checkRateLimit,
  validateCSRFToken,
  validateSession,
  verifyWalletSignature,
  validateWalletConnection,
  verifyTransactionSignature,
  clearSession
} from '@/lib/security';
import { SecurityContext } from './security-context';
import { useNavigate } from 'react-router-dom';

export function SecurityProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize security measures when the provider mounts
    initializeSecurity();

    // Set up interval to check session validity
    const sessionCheckInterval = setInterval(() => {
      if (!validateSession()) {
        toast.error('Session expired. Please sign in again.');
        clearSession();
        navigate('/auth');
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [navigate]);

  const securityValue = {
    checkRateLimit,
    validateCSRFToken,
    validateSession,
    verifyWalletSignature,
    validateWalletConnection,
    verifyTransactionSignature
  };

  return (
    <SecurityContext.Provider value={securityValue}>
      {children}
    </SecurityContext.Provider>
  );
}

export default SecurityProvider; 