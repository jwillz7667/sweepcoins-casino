import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";
import React from "react";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  sweepcoins: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Add LoadingSpinner component at the top level of the file, after imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile || { id: userId, username: '', sweepcoins: 0 };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { id: userId, username: '', sweepcoins: 0 };
    }
  };

  // Update user state with profile data
  const updateUserState = useCallback(async (supabaseUser: User | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    const profile = await fetchUserProfile(supabaseUser.id);
    if (profile) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        username: profile.username || '',
        sweepcoins: profile.sweepcoins ?? 0,
      });
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Got session:', session);
        
        if (session?.user) {
          console.log('Session exists, fetching user profile...');
          const profile = await fetchUserProfile(session.user.id);
          console.log('Fetched profile:', profile);
          
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              username: profile.username || '',
              sweepcoins: profile.sweepcoins ?? 0,
            });
            console.log('User state initialized:', {
              id: session.user.id,
              email: session.user.email,
              username: profile.username,
              sweepcoins: profile.sweepcoins ?? 0,
            });
          }
        } else {
          console.log('No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        console.log('Auth initialization complete');
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, userId: session?.user?.id });
      await updateUserState(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateUserState]);

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    const errorMessage = error.message === 'Invalid login credentials'
      ? 'Invalid email or password'
      : error.message;
    toast.error(errorMessage);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in...', { email });
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { error, session: data?.session });

      if (error) throw error;

      // Wait for profile data to be updated
      const profile = await fetchUserProfile(data.session.user.id);
      console.log('Fetched user profile:', profile);

      if (profile) {
        // Update user state using state updater
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          username: profile.username || '',
          sweepcoins: profile.sweepcoins ?? 0,
        });

        console.log('User state updated:', {
          id: data.session.user.id,
          email: data.session.user.email,
          username: profile.username,
          sweepcoins: profile.sweepcoins ?? 0,
        });

        // Show success message and navigate after state is updated
        toast.success('Welcome back!');
        console.log('Navigating to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      handleAuthError(error as AuthError);
    }
  };

  const signUp = async (email: string, username: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/auth');
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };