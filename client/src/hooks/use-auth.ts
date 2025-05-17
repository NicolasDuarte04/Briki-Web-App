import { useContext } from 'react';
import { AuthContext, type User } from '@/contexts/AuthContext';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithGoogle: (returnTo?: string) => void;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  
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
    };
  }
  
  return context;
}