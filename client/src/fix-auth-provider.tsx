import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Simple Authentication Context
 * Used as a fallback when the main auth system encounters issues
 */
type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true
});

/**
 * Custom hook to access the auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * AuthProvider component that wraps the application
 * This provides authentication context throughout the app
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated auth check for development
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // For development, simulate a successful login
        // In production, we would fetch the user from the server
        setTimeout(() => {
          const mockUser = {
            id: 'user-1',
            username: 'test_user',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          };
          setUser(mockUser);
          setIsLoading(false);
          console.log('Auth provider initialized with mock user');
        }, 500);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}