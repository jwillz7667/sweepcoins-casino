import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 