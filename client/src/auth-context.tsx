import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our authentication context
export interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true
});

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate authentication check on mount
  useEffect(() => {
    // Mock authentication for development
    setTimeout(() => {
      const mockUser = {
        id: 'mock-user-id',
        username: 'user',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User'
      };
      
      // Set user data
      setUser(mockUser);
      setIsLoading(false);
      
      console.log('Authentication initialized with mock user');
    }, 500);
  }, []);

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}