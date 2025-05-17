import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  allowRoles?: string[];
}

export default function ProtectedRoute({
  children,
  redirectTo = '/auth',
  allowRoles = ['user', 'admin', 'company'],
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current URL to redirect back after login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/auth') {
          localStorage.setItem('authReturnTo', currentPath);
        }
      }
      
      // Redirect to auth page
      setLocation(`${redirectTo}?returnTo=${window.location.pathname}`);
    }
    
    // If authenticated but not in allowed roles, redirect to home
    if (!isLoading && isAuthenticated && user?.role && !allowRoles.includes(user.role)) {
      setLocation('/');
    }
  }, [isLoading, isAuthenticated, user, setLocation, redirectTo, allowRoles]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If authenticated and has permission, render children
  if (isAuthenticated && user?.role && allowRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Render nothing during the redirect process
  return null;
}