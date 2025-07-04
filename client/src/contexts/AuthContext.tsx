import { createContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '../hooks/use-toast';

// Define the User type aligned with our database structure
export interface User {
  id: string | number; // Support both string (for OAuth) and number (for DB)
  username?: string | null;
  email: string;
  name?: string | null;
  role?: string | null;
  profileImageUrl?: string | null; // Extracted from company_profile in API response
  companyProfile?: {
    name?: string;
    country?: string;
    logo?: string;
    description?: string;
    website?: string;
  };
}

// Auth context type definition
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    name?: string;
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
        } else if (response.status === 302 || response.status === 401) {
          // Handle redirects or unauthorized status gracefully - user is not logged in
          setUser(null);
          // Don't show error toast for expected auth states
        } else {
          console.warn(`Auth check returned unexpected status: ${response.status}`);
          setUser(null);
        }
      } catch (error) {
        // Only log error if it's not a normal redirect/auth flow
        console.log('Auth check status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        toast({
          title: 'Login successful',
          description: `Welcome back, ${userData.user.name || userData.user.username || 'user'}!`,
        });
        
        // Role-based redirection logic
        if (userData.user.role === 'company') {
          // Add analytics tracking for company login if needed
          console.log('Company user authenticated, redirection will be handled by login page');
        }
        
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
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: userData.name
        }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        toast({
          title: 'Registration successful',
          description: `Welcome to Briki, ${data.user.name || data.user.username || 'user'}!`,
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