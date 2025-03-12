import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/auth-context';

// Re-export the AuthContextType for convenience
export type { AuthContextType };

/**
 * Hook for accessing authentication context throughout the application
 * @returns {AuthContextType} The authentication context
 * @throws {Error} If used outside of an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
