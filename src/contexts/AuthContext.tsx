import { useState, useEffect, type ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AuthError, User } from "@supabase/supabase-js";
import { AuthContext, type AuthUser, type AuthContextType } from "./auth-context";

/**
 * Loading spinner component shown during authentication operations
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

/**
 * Error fallback component when auth initialization fails
 */
const AuthErrorFallback = ({ resetAuth }: { resetAuth: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
      <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Error</h2>
      <p className="text-gray-700 mb-4">
        There was a problem loading your authentication data. This could be due to a cached or expired session.
      </p>
      <button
        onClick={resetAuth}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
      >
        Reset Authentication & Reload
      </button>
    </div>
  </div>
);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetches user profile data from Supabase
   * @param userId The user ID to fetch profile for
   * @returns User profile data or null if not found
   */
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

  /**
   * Updates the user state with data from Supabase and profile
   */
  const updateUserState = useCallback(async (supabaseUser: User | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    try {
      const profile = await fetchUserProfile(supabaseUser.id);
      if (profile) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          username: profile.username || '',
          sweepcoins: profile.sweepcoins ?? 0,
        });
      } else {
        // If we can't get a profile, clear the user state
        console.warn('Could not fetch profile for user, clearing auth state');
        setUser(null);
      }
    } catch (error) {
      console.error('Error updating user state:', error);
      setUser(null);
    }
  }, []);

  /**
   * Resets authentication state and reloads the page
   */
  const resetAuth = useCallback(async () => {
    console.log('Resetting authentication state...');
    
    try {
      // Sign out from Supabase to clear any server-side session
      await supabase.auth.signOut();
      
      // Clear any localStorage items related to auth
      localStorage.removeItem('supabase.auth.token');
      
      // Clear any localStorage data that might be causing issues
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          console.log('Removing localStorage item:', key);
          localStorage.removeItem(key);
        }
      }
      
      // Clear any session storage
      sessionStorage.clear();
      
      // Reset our own state
      setUser(null);
      setAuthFailed(false);
      setError(null);
      
      // Reload the page to get a fresh state
      window.location.href = '/';
    } catch (error) {
      console.error('Error during auth reset:', error);
      // Force reload anyway
      window.location.reload();
    }
  }, []);
  
  /**
   * Logs authentication debug information to the console
   */
  const logAuthDebugInfo = useCallback(() => {
    console.group('Auth Debug Information');
    console.log('Current user state:', user);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
    console.log('Auth failed state:', authFailed);
    
    // Check for localStorage items
    console.group('LocalStorage Auth Items');
    let foundAuthItems = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('sb-'))) {
        foundAuthItems = true;
        try {
          const value = localStorage.getItem(key);
          console.log(key, value ? JSON.parse(value) : null);
        } catch (e) {
          console.log(key, '[Error parsing]');
        }
      }
    }
    if (!foundAuthItems) {
      console.log('No Supabase auth items found in localStorage');
    }
    console.groupEnd();
    
    console.groupEnd();
  }, [user, loading, error, authFailed]);
  
  // Log auth debug info on mount and when auth state changes
  useEffect(() => {
    logAuthDebugInfo();
  }, [user, loading, error, authFailed, logAuthDebugInfo]);

  /**
   * Initialize authentication state and set up listeners
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Starting auth initialization...');
        setLoading(true);
        setError(null);
        setAuthFailed(false);
        
        // Check if Supabase is configured
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }
        
        console.log('Fetching session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        console.log('Session status:', session ? 'Found' : 'Not found');
        
        if (session?.user) {
          try {
            console.log('Fetching profile for user:', session.user.id);
            const profile = await fetchUserProfile(session.user.id);
            
            if (profile) {
              console.log('Setting user state with profile:', profile);
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                username: profile.username || '',
                sweepcoins: profile.sweepcoins ?? 0,
              });
            } else {
              console.log('No profile found for user, attempting recovery...');
              // If no profile, attempt to re-fetch from Supabase Auth
              const { data: userData, error: userError } = await supabase.auth.getUser();
              
              if (userError || !userData.user) {
                console.warn('Failed to recover user data, clearing auth state');
                setUser(null);
              } else {
                // Try to create a minimal profile with available data
                setUser({
                  id: userData.user.id,
                  email: userData.user.email || '',
                  username: '',
                  sweepcoins: 0,
                });
              }
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            setAuthFailed(true);
            throw profileError;
          }
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error instanceof Error ? error : new Error('Unknown authentication error'));
        setAuthFailed(true);
        toast.error('Error initializing authentication');
      } finally {
        console.log('Auth initialization complete');
        setLoading(false);
      }
    };

    // Start auth initialization
    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, session });
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        await updateUserState(session.user);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        await updateUserState(session.user);
      } else if (event === 'USER_UPDATED' && session?.user) {
        await updateUserState(session.user);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [updateUserState, resetAuth]);

  /**
   * Handles authentication errors and displays appropriate messages
   */
  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    setError(error);
    const errorMessage = error.message === 'Invalid login credentials'
      ? 'Invalid email or password'
      : error.message;
    toast.error(errorMessage);
  };

  /**
   * Signs in a user with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
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
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs up a new user with email, username and password
   */
  const signUp = async (email: string, username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting sign up...', { email, username });
      
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('User creation failed');
      }

      // Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          email,
          sweepcoins: 100, // Initial sweepcoins for new users
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // If profile creation fails, we should still continue as the auth record was created
        toast.error('Account created but profile setup failed. Please contact support.');
      }

      toast.success('Account created successfully! Please check your email for verification.');
      
      // Don't auto-sign in, wait for email verification
      // navigate('/login', { replace: true });
    } catch (error) {
      console.error('Sign up error:', error);
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error : new Error('Unknown error signing out'));
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  // The AuthContextType contains all the values and methods needed by consumers
  const authContextValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetAuth
  };

  // If auth failed, show error recovery UI
  if (authFailed && !loading) {
    return <AuthErrorFallback resetAuth={resetAuth} />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
