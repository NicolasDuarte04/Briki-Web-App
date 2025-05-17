import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define the User type based on our database schema
export interface User {
  id: string;
  username: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role?: string;
}

// Define the AuthContext props and state
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  loginWithGoogle: (returnTo?: string) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  loginWithGoogle: () => {},
});

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('GET', '/api/auth/user');
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', '/api/auth/login', {
        username,
        password,
      });
      
      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);
        toast({
          title: 'Login successful',
          description: `Welcome back, ${userData.firstName || userData.username}!`,
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', '/api/auth/register', userData);
      
      if (response.ok) {
        const { user: newUser } = await response.json();
        setUser(newUser);
        toast({
          title: 'Registration successful',
          description: `Welcome to Briki, ${newUser.firstName || newUser.username}!`,
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: 'Registration failed',
          description: error.message || 'Could not create account. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('GET', '/api/auth/logout');
      
      if (response.ok) {
        setUser(null);
        toast({
          title: 'Logged out',
          description: 'You have been logged out successfully.',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Logout failed',
          description: error.message || 'Could not log out. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = (returnTo?: string) => {
    const baseUrl = '/api/auth/google';
    
    // Add returnTo URL if provided
    const url = returnTo 
      ? `${baseUrl}?returnTo=${encodeURIComponent(returnTo)}`
      : baseUrl;
    
    // Redirect to Google login
    window.location.href = url;
  };

  // Determine authentication status
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};