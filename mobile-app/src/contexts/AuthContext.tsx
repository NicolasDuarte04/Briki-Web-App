import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from 'react-query';

import { api } from '../services/api';
import { User } from '../types/user';

type AuthContextData = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user
  const { 
    data: user, 
    error, 
    refetch: refetchUser 
  } = useQuery<User | null, Error>(
    ['user'],
    async () => {
      try {
        // Check if token exists
        const token = await AsyncStorage.getItem('@Briki:token');
        
        if (!token) {
          return null;
        }
        
        const response = await api.get('/api/user');
        return response.data;
      } catch (error) {
        // Clear token on auth error
        await AsyncStorage.removeItem('@Briki:token');
        return null;
      }
    },
    {
      onSettled: () => {
        setIsLoading(false);
      },
    }
  );

  // Login mutation
  const loginMutation = useMutation(
    async ({ username, password }: { username: string; password: string }) => {
      const response = await api.post('/api/login', { username, password });
      return response.data;
    },
    {
      onSuccess: async (data) => {
        // Store the token
        await AsyncStorage.setItem('@Briki:token', data.token);
        // Update auth header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        // Refetch user data
        refetchUser();
      },
    }
  );

  // Register mutation
  const registerMutation = useMutation(
    async ({ username, password, email }: { username: string; password: string; email: string }) => {
      const response = await api.post('/api/register', { username, password, email });
      return response.data;
    },
    {
      onSuccess: async (data) => {
        // Store the token
        await AsyncStorage.setItem('@Briki:token', data.token);
        // Update auth header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        // Refetch user data
        refetchUser();
      },
    }
  );

  // Logout mutation
  const logoutMutation = useMutation(
    async () => {
      await api.post('/api/logout');
    },
    {
      onSuccess: async () => {
        // Clear token
        await AsyncStorage.removeItem('@Briki:token');
        // Remove auth header
        delete api.defaults.headers.common['Authorization'];
        // Refetch (will return null now)
        refetchUser();
      },
    }
  );

  // Set token on initial load
  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('@Briki:token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    };
    
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const register = async (username: string, password: string, email: string) => {
    await registerMutation.mutateAsync({ username, password, email });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
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
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};