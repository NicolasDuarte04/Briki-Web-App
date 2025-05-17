import { createContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the User type
export interface User {
  id: string;
  username: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role?: string;
}

// Auth context type definition
export interface AuthContextType {
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

// Creating the context with a default value
export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user on mount and handle persistent sessions
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Clear user data if not authenticated
          setUser(null);
          // We don't show error toast on initial load as it's expected for non-logged-in users
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        toast({
          title: 'Login successful',
          description: `Welcome back, ${userData.user.firstName || userData.user.username}!`,
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid credentials',
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
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast({
          title: 'Registration successful',
          description: `Welcome to Briki, ${data.user.firstName || data.user.username}!`,
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: 'Registration failed',
          description: error.message || 'Could not create account',
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
      
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        setUser(null);
        toast({
          title: 'Logged out',
          description: 'You have been successfully logged out.',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Logout failed',
          description: error.message || 'Could not log out',
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

  // Google login function
  const loginWithGoogle = (returnTo?: string) => {
    // Store returnTo URL in localStorage if provided
    if (returnTo) {
      localStorage.setItem('authReturnTo', returnTo);
    }
    
    // Redirect to Google OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}