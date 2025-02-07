import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute state:', { 
      user, 
      loading, 
      path: location.pathname 
    });
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to /auth from:', location.pathname);
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  console.log('Rendering protected content for:', user.email);
  return <>{children}</>;
}; 