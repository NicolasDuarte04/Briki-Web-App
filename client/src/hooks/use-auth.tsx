import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User as SelectUser } from "../../../shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";
import { trackEvent } from "../lib/analytics";

// Update response type to remove token
type AuthResponse = {
  user: SelectUser;
};

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginData>;
  logoutMutation: UseMutationResult<null, Error, void>;
  registerMutation: UseMutationResult<AuthResponse, Error, RegisterData>;
  refetchUser: () => Promise<any>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { 
    email: string; 
    password: string; 
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
};

type LoginData = {
  email: string;
  password: string;
  role?: string; // Add optional role parameter for company login
};

type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Centralized role-based redirection function
  const handleRoleBasedRedirection = (userData: SelectUser) => {
    console.log("Handling role-based redirection for user:", userData.email);
    console.log("User role:", userData.role);
    
    if (userData.role === "company") {
      console.log("Company user detected, redirecting to company dashboard");
      navigate("/company-dashboard");
      trackEvent('navigation', 'redirection', 'company_dashboard');
    } else {
      console.log("Standard user detected, redirecting to profile page");
      navigate("/profile");
      trackEvent('navigation', 'redirection', 'profile');
    }
  };
  
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<SelectUser | null>({
    queryKey: ["/api/user"],
    queryFn: async ({ queryKey }) => {
      try {
        console.log("Fetching user data...");
        const res = await fetch(queryKey[0] as string, {
          credentials: 'include', // Include cookies
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        
        console.log("User data response status:", res.status);
        
        if (res.status === 401) {
          console.log("User not authenticated (401)");
          trackEvent('auth_session_invalid', 'authentication', 'session_error');
          return null;
        }
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Error response: ${res.status} - ${errorText || res.statusText}`);
          trackEvent('auth_fetch_error', 'authentication', 'api_error', 0);
          throw new Error(`${res.status}: ${errorText || res.statusText}`);
        }
        
        const userData = await res.json();
        console.log("User authenticated:", userData.email);
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
    enabled: true
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      trackEvent('login_attempt', 'authentication', 'form_login', undefined, { method: 'credentials' });
      const result = await loginMutation.mutateAsync({ email, password });
      return !!result;
    } catch (error) {
      console.error("Login failed in login helper:", error);
      return false;
    }
  };

  const register = async (data: { 
    email: string; 
    password: string; 
    confirmPassword?: string; 
    firstName?: string;
    lastName?: string;
  }): Promise<boolean> => {
    try {
      // Verify passwords match if confirmPassword is provided
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        toast({
          title: "Password mismatch",
          description: "The passwords you entered don't match. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      trackEvent('signup_attempt', 'authentication', 'form_signup');
      
      // Send registration data with confirmPassword
      const result = await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword || data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      return !!result;
    } catch (error) {
      console.error("Registration failed in register helper:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      trackEvent('logout_attempt', 'authentication', 'user_initiated');
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed in logout helper:", error);
    }
  };
  
  // Password reset function
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      trackEvent('password_reset_attempt', 'authentication', 'form');
      
      // Call the password reset endpoint
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });
      
      // Process the response
      if (response.ok) {
        trackEvent('password_reset_success', 'authentication', 'form');
        toast({
          title: "Password reset email sent",
          description: "If an account exists with that email, we've sent instructions to reset your password.",
        });
        return true;
      } else {
        const errorData = await response.json();
        trackEvent('password_reset_error', 'authentication', 'form');
        toast({
          title: "Password reset request failed",
          description: errorData.message || "Failed to request password reset. Please try again later.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Password reset error:", error);
      trackEvent('password_reset_error', 'authentication', 'form');
      toast({
        title: "Password reset request failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Login attempt for:", credentials.email);
      trackEvent('login_attempt', 'authentication', 'credentials', undefined, {
        email: credentials.email,
        role: credentials.role || 'user'
      });
      try {
        // Make a direct fetch to the correct endpoint
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          },
          credentials: 'include', // Include cookies
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
          
          trackEvent('login_failure', 'authentication', 'credentials', 0, {
            error: errorMessage,
            status: response.status
          });
          
          throw new Error(errorMessage);
        }
        
        console.log("Login successful, auth data received");
        trackEvent('login_success', 'authentication', 'credentials');
        return responseData as AuthResponse;
      } catch (error: any) {
        console.error("Login error:", error.message || error);
        throw error;
      }
    },
    onSuccess: (data: AuthResponse) => {
      console.log("Login success callback");
      
      // Immediate redirect for better UX
      handleRoleBasedRedirection(data.user);
      
      // Store user data in query cache
      queryClient.setQueryData(["/api/user"], data.user);
      
      // Track successful login with user ID for analytics
      trackEvent('login_complete', 'authentication', 'credentials', undefined, {
        user_id: data.user.id,
        email: data.user.email,
        role: data.user.role
      });
      
      // Force user data refresh
      setTimeout(() => {
        refetch();
      }, 100);
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
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
    mutationFn: async (credentials: RegisterData) => {
      console.log("Registration attempt for:", credentials.email);
      trackEvent('signup_attempt', 'authentication', 'form', undefined, {
        email: credentials.email
      });
      
      try {
        // Make a direct fetch to the correct endpoint
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          },
          credentials: 'include', // Include cookies
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
          
          trackEvent('signup_failure', 'authentication', 'form', 0, {
            error: errorMessage,
            status: response.status
          });
          
          throw new Error(errorMessage);
        }
        
        console.log("Registration successful, auth data received");
        trackEvent('signup_success', 'authentication', 'form');
        return responseData as AuthResponse;
      } catch (error: any) {
        console.error("Registration error:", error.message || error);
        throw error;
      }
    },
    onSuccess: (data: AuthResponse) => {
      console.log("Registration success callback");
      
      // Immediate redirect for better UX
      handleRoleBasedRedirection(data.user);
      
      // Store user data in query cache
      queryClient.setQueryData(["/api/user"], data.user);
      
      // Track successful registration with user ID for analytics
      trackEvent('signup_complete', 'authentication', 'form', undefined, {
        user_id: data.user.id,
        email: data.user.email,
        role: data.user.role
      });
      
      // Force user data refresh
      setTimeout(() => {
        refetch();
      }, 100);
      
      toast({
        title: "Registration successful",
        description: `Welcome to Briki!`,
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
      trackEvent('logout_initiated', 'authentication', 'user_action');
      
      try {
        const response = await fetch("/api/auth/logout", {
          method: "GET", // Backend uses GET for logout
          credentials: 'include', // Include cookies
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        console.log("Logout response status:", response.status);
        
        if (!response.ok) {
          trackEvent('logout_server_error', 'authentication', 'api_error', 0, {
            status: response.status
          });
        }
        
        return null;
      } catch (error) {
        console.error("Logout error:", error);
        trackEvent('logout_error', 'authentication', 'api_error', 0);
        // Even if server-side logout fails, we'll still clear local state
        return null;
      }
    },
    onSuccess: () => {
      // Track successful logout for analytics
      if (user) {
        trackEvent('logout_success', 'authentication', 'user_action', undefined, {
          user_id: user.id,
          username: user.username
        });
      } else {
        trackEvent('logout_success', 'authentication', 'user_action');
      }
      
      // Clear user data from query cache
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to home page
      navigate("/");
    },
    onError: (error: Error) => {
      console.error("Logout mutation error:", error);
      trackEvent('logout_failure', 'authentication', 'api_error', 0);
      
      // Even if there's an error, attempt to clear local auth state
      queryClient.setQueryData(["/api/user"], null);
      
      toast({
        title: "Logout issue",
        description: "You've been logged out locally, but there was an issue with the server: " + error.message,
        variant: "destructive",
      });
      
      // Redirect to home page regardless of error
      navigate("/");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        isAuthenticated: !!user,
        loginMutation,
        logoutMutation,
        registerMutation,
        refetchUser: refetch,
        login,
        register,
        logout,
        requestPasswordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  // Check if we're in a context
  if (!context) {
    console.warn("Auth context not found, using default values");
    trackEvent('auth_context_missing', 'error', 'system_error');
    
    // Create authentication mutations with tracking
    const loginMutation = useMutation({
      mutationFn: async (credentials: LoginData) => {
        trackEvent('login_attempt_fallback', 'authentication', 'credentials');
        try {
          const response = await apiRequest("POST", "/api/login", credentials);
          if (!response.ok) {
            const error = await response.json();
            trackEvent('login_failure_fallback', 'authentication', 'credentials', 0);
            throw new Error(error.message || "Login failed");
          }
          trackEvent('login_success_fallback', 'authentication', 'credentials');
          return response.json();
        } catch (error) {
          trackEvent('login_error_fallback', 'authentication', 'system_error', 0);
          throw error;
        }
      }
    });

    const registerMutation = useMutation({
      mutationFn: async (userData: InsertUser) => {
        trackEvent('signup_attempt_fallback', 'authentication', 'form');
        try {
          const response = await apiRequest("POST", "/api/register", userData);
          if (!response.ok) {
            const error = await response.json();
            trackEvent('signup_failure_fallback', 'authentication', 'form', 0);
            throw new Error(error.message || "Registration failed");
          }
          trackEvent('signup_success_fallback', 'authentication', 'form');
          return response.json();
        } catch (error) {
          trackEvent('signup_error_fallback', 'authentication', 'system_error', 0);
          throw error;
        }
      }
    });

    const logoutMutation = useMutation({
      mutationFn: async () => {
        trackEvent('logout_attempt_fallback', 'authentication', 'user_action');
        try {
          const response = await apiRequest("POST", "/api/logout");
          if (!response.ok) {
            const error = await response.json();
            trackEvent('logout_failure_fallback', 'authentication', 'api_error', 0);
            throw new Error(error.message || "Logout failed");
          }
          trackEvent('logout_success_fallback', 'authentication', 'user_action');
          return response.json();
        } catch (error) {
          trackEvent('logout_error_fallback', 'authentication', 'system_error', 0);
          throw error;
        }
      }
    });
    
    const login = async (email: string, password: string): Promise<boolean> => {
      try {
        trackEvent('login_attempt_fallback_helper', 'authentication', 'credentials');
        await loginMutation.mutateAsync({ email, password });
        return true;
      } catch (error) {
        console.error("Login failed in fallback login helper:", error);
        return false;
      }
    };

    const register = async (data: { email: string; password: string; confirmPassword?: string }): Promise<boolean> => {
      try {
        // Validate password confirmation if provided
        if (data.confirmPassword && data.password !== data.confirmPassword) {
          console.error("Passwords do not match");
          return false;
        }
        
        trackEvent('signup_attempt_fallback_helper', 'authentication', 'form');
        await registerMutation.mutateAsync({
          id: crypto.randomUUID(),
          email: data.email,
          password: data.password,
          role: "user",
          firstName: null,
          lastName: null,
          profileImageUrl: null,
        });
        return true;
      } catch (error) {
        console.error("Registration failed in fallback register helper:", error);
        return false;
      }
    };

    const logout = async (): Promise<void> => {
      try {
        trackEvent('logout_attempt_fallback_helper', 'authentication', 'user_action');
        await logoutMutation.mutateAsync();
      } catch (error) {
        console.error("Logout failed in fallback logout helper:", error);
      }
    };
    
    return {
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      loginMutation,
      registerMutation,
      logoutMutation,
      login,
      register,
      logout,
      refetchUser: async () => ({ user: null }),
      requestPasswordReset: async (email: string) => {
        trackEvent('password_reset_attempt_fallback', 'authentication', 'form');
        toast({
          title: "Password reset unavailable",
          description: "This feature is not available while offline. Please try again later.",
          variant: "destructive",
        });
        return false;
      }
    };
  }
  
  return context;
}
