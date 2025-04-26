import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, useQuery, useMutation } from 'react-query';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('@Briki:token');
        
        if (token) {
          // Get user data from API
          const response = await api.get('/api/user');
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        // Clear any invalid tokens
        await AsyncStorage.removeItem('@Briki:token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Call login API
      const response = await api.post('/api/login', { username, password });
      const data = response.data;
      
      // Save token to AsyncStorage
      if (data.token) {
        await AsyncStorage.setItem('@Briki:token', data.token);
        
        // Set user
        setUser(data.user);
      } else {
        throw new Error('No se recibió un token válido');
      }
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, password: string, email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Call register API
      const response = await api.post('/api/register', { username, password, email });
      const data = response.data;
      
      // Save token to AsyncStorage
      if (data.token) {
        await AsyncStorage.setItem('@Briki:token', data.token);
        
        // Set user
        setUser(data.user);
      } else {
        throw new Error('No se recibió un token válido');
      }
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Call logout API
      await api.post('/api/logout');
      
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('@Briki:token');
      
      // Clear user
      setUser(null);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}