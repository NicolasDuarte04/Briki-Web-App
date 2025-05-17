import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

// Simple authentication context
type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Default context value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false
});

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Authentication provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user data
  useEffect(() => {
    // For testing purposes, we'll simulate a logged-in user
    setTimeout(() => {
      setUser({
        id: 'test-user-123',
        username: 'test_user',
        email: 'test@example.com'
      });
      setIsLoading(false);
    }, 500);
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