import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';
import { api } from '../services/api';

// Type definitions
interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  register: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Props for the Auth Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user data from token on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const token = await storage.getItem('@Briki:token');
        
        if (token) {
          // Try to get user data with the stored token
          const response = await api.get('/users/me');
          setUser(response.data);
        }
      } catch (error) {
        // If there's an error, clear the stored token
        await storage.removeItem('@Briki:token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in function
  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', { username, password });
      
      // Store the token
      await AsyncStorage.setItem('@Briki:token', response.data.token);
      
      // Set the user
      setUser(response.data.user);
    } catch (err: any) {
      console.error('Sign in error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Remove the token from storage
      await AsyncStorage.removeItem('@Briki:token');
      
      // Clear the user
      setUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err.message);
      setError('Error al cerrar sesión.');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/register', { username, email, password });
      
      // Store the token
      await AsyncStorage.setItem('@Briki:token', response.data.token);
      
      // Set the user
      setUser(response.data.user);
    } catch (err: any) {
      console.error('Register error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Error al registrarse. Inténtalo de nuevo.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    register,
  };

  // Return the provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};