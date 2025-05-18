import { useContext } from 'react';
import { AuthContext, type User, type AuthContextType } from '@/contexts/AuthContext';

// Interface matches the AuthContextType
interface UseAuthReturn extends AuthContextType {}

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