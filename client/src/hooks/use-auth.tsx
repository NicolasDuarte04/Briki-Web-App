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
        // Make a direct fetch to control headers exactly
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          },
          body: JSON.stringify(credentials)
        });
        
        console.log("Login response status:", response.status);
        
        // Try to parse the response as JSON
        let responseData;
        try {
          responseData = await response.json();
          console.log("Login response data:", responseData);
        } catch (parseError) {
          console.error("Error parsing login response:", parseError);
          responseData = { message: response.statusText || "Login failed" };
        }
        
        if (!response.ok) {
          const errorMessage = typeof responseData === 'object' && responseData && 'message' in responseData
            ? responseData.message
            : "Login failed";
          console.error("Login error message:", errorMessage);
          throw new Error(errorMessage);
        }
        
        console.log("Login successful, auth data received");
        return responseData as TokenResponse;
      } catch (error: any) {
        console.error("Login error:", error.message || error);
        throw error;
      }
    },
    onSuccess: (data: TokenResponse) => {
      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      setAuthToken(data.token);
      
      // Store user data in query cache
      queryClient.setQueryData(["/api/user"], data.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
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
        // Make a direct fetch to control headers exactly
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          },
          body: JSON.stringify(credentials)
        });
        
        console.log("Registration response status:", response.status);
        
        // Try to parse the response as JSON
        let responseData;
        try {
          responseData = await response.json();
          console.log("Registration response data:", responseData);
        } catch (parseError) {
          console.error("Error parsing registration response:", parseError);
          responseData = { message: response.statusText || "Registration failed" };
        }
        
        if (!response.ok) {
          const errorMessage = typeof responseData === 'object' && responseData && 'message' in responseData
            ? responseData.message
            : "Registration failed";
          console.error("Registration error message:", errorMessage);
          throw new Error(errorMessage);
        }
        
        console.log("Registration successful, auth data received");
        return responseData as TokenResponse;
      } catch (error: any) {
        console.error("Registration error:", error.message || error);
        throw error;
      }
    },
    onSuccess: (data: TokenResponse) => {
      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      setAuthToken(data.token);
      
      // Store user data in query cache
      queryClient.setQueryData(["/api/user"], data.user);
      
      toast({
        title: "Registration successful",
        description: `Welcome to Briki, ${data.user.username}!`,
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
        // Only try to logout on the server if we have a token
        if (authToken) {
          const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${authToken}`,
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            }
          });
          console.log("Logout response status:", response.status);
        }
        return null;
      } catch (error) {
        console.error("Logout error:", error);
        // Even if server-side logout fails, we'll still clear local state
        return null;
      }
    },
    onSuccess: () => {
      // Clear token from localStorage
      localStorage.removeItem('auth_token');
      setAuthToken(null);
      
      // Clear user data from query cache
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      console.error("Logout mutation error:", error);
      
      // Even if there's an error, attempt to clear local auth state
      localStorage.removeItem('auth_token');
      setAuthToken(null);
      queryClient.setQueryData(["/api/user"], null);
      
      toast({
        title: "Logout issue",
        description: "You've been logged out locally, but there was an issue with the server: " + error.message,
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
