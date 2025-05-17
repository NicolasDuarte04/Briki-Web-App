import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

// Define the auth context type
type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  refetchUser: () => Promise<any>;
};

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refetchUser: async () => null,
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/user");
        
        if (res.status === 401) {
          console.log("User not authenticated");
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`Error fetching user: ${res.status}`);
        }
        
        const userData = await res.json();
        return userData;
      } catch (err) {
        console.error("Error fetching user:", err);
        return null;
      }
    },
    retry: 1,
  });

  // Simplified login function for Replit auth
  const login = () => {
    window.location.href = "/api/login";
  };

  // Simplified logout function for Replit auth
  const logout = () => {
    window.location.href = "/api/logout";
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user: user ?? null,
    isLoading,
    error: error as Error | null,
    isAuthenticated: !!user,
    login,
    logout,
    refetchUser: refetch,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}