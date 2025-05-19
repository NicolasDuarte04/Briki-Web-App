import { useContext } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { AuthContext, type User, type AuthContextType } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Interface extends the AuthContextType
interface UseAuthReturn extends AuthContextType {
  // Add enhanced authentication functions with company role support
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
}

// Custom hook for login mutation
function useLoginMutation() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const context = useContext(AuthContext);
  
  return useMutation({
    mutationFn: async ({ 
      username, 
      password, 
      role 
    }: { 
      username: string; 
      password: string; 
      role?: string;
    }) => {
      console.log(`Login attempt for: ${username} with role: ${role || 'user'}`);
      
      // Use the context login function
      if (!context) {
        throw new Error('Auth context not available');
      }
      
      const success = await context.login(username, password);
      if (!success) {
        throw new Error('Login failed');
      }
      
      return { success: true, user: context.user, role };
    },
    onSuccess: (data) => {
      console.log('Login mutation success:', data);
      
      // Show a success toast
      toast({
        title: 'Login successful',
        description: 'Welcome back! Redirecting to your dashboard...',
      });
      
      // Handle company role automatically - this ensures the routing
      // works consistently for partner logins
      if (data.role === 'company') {
        setTimeout(() => {
          navigate("/company-dashboard");
        }, 500);
      }
      // For regular users, redirection to home is default
    },
    onError: (error: Error) => {
      console.error('Login mutation error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  });
}

// Custom hook for logout mutation
function useLogoutMutation() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const context = useContext(AuthContext);
  
  return useMutation({
    mutationFn: async () => {
      if (!context) {
        throw new Error('Auth context not available');
      }
      
      await context.logout();
      return true;
    },
    onSuccess: () => {
      // Show a success toast
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      
      // Navigate to landing page after logout
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('Logout mutation error:', error);
      toast({
        title: 'Logout failed',
        description: 'There was an issue logging you out. Please try again.',
        variant: 'destructive',
      });
    }
  });
}

// Main useAuth hook
export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  
  if (!context) {
    console.warn('Auth context not found, using default values');
    
    // Return a default implementation if context is not available
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => false,
      register: async () => false,
      logout: async () => {},
      loginWithGoogle: () => {},
      loginMutation,
      logoutMutation,
    };
  }
  
  return {
    ...context,
    loginMutation,
    logoutMutation,
  };
}