import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type TokenResponse = {
  user: SelectUser;
  token: string;
};

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<TokenResponse, Error, LoginData>;
  logoutMutation: UseMutationResult<null, Error, void>;
  registerMutation: UseMutationResult<TokenResponse, Error, InsertUser>;
  refetchUser: () => Promise<any>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(() => {
    // Try to get token from localStorage on initial load
    return localStorage.getItem('auth_token');
  });
  
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<SelectUser | null>({
    queryKey: ["/api/user"],
    queryFn: async ({ queryKey }) => {
      try {
        // If we don't have a token, the user is not authenticated
        if (!authToken) {
          console.log("No auth token available, user not authenticated");
          return null;
        }
        
        console.log("Fetching user data with token...");
        const res = await fetch(queryKey[0] as string, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        
        console.log("User data response status:", res.status);
        
        if (res.status === 401) {
          console.log("Token invalid or expired (401)");
          // Clear invalid token
          localStorage.removeItem('auth_token');
          setAuthToken(null);
          return null;
        }
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Error response: ${res.status} - ${errorText || res.statusText}`);
          throw new Error(`${res.status}: ${errorText || res.statusText}`);
        }
        
        const userData = await res.json();
        console.log("User authenticated:", userData.username);
        return userData;
      } catch (err) {
        console.error("Error fetching user:", err);
        return null;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    enabled: !!authToken, // Only run query if we have a token
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Login attempt for:", credentials.username);
      try {
        // Use apiRequest to ensure consistency with other requests
        const response = await apiRequest("POST", "/api/login", credentials);
        console.log("Login response status:", response.status);
        
        // Parse response
        const userData = await response.json();
        console.log("Login successful, user data received");
        return userData;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      // Ensure we refetch user data after login
      refetch();
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Login mutation error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Could not log in. Please try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      console.log("Registration attempt for:", credentials.username);
      try {
        // Use apiRequest to ensure consistency with other requests
        const response = await apiRequest("POST", "/api/register", credentials);
        console.log("Registration response status:", response.status);
        
        // Parse response
        const userData = await response.json();
        console.log("Registration successful, user data received");
        return userData;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      // Ensure we refetch user data after registration
      refetch();
      toast({
        title: "Registration successful",
        description: `Welcome to Briki, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Registration mutation error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Logout attempt");
      try {
        // Use apiRequest to ensure consistency with other requests
        const response = await apiRequest("POST", "/api/logout");
        console.log("Logout response status:", response.status);
        return null;
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      // Invalidate the user query to ensure we refetch after logout
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      console.error("Logout mutation error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "Could not log out. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
