import { createContext, ReactNode, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "./use-toast";

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  refetchUser: () => Promise<any>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Centralized role-based redirection function
  const handleRoleBasedRedirection = (userData: any) => {
    console.log("Handling role-based redirection for user:", userData.username);
    console.log("User role:", userData.role);
    
    if (userData.role === "company") {
      console.log("Company user detected, redirecting to company dashboard");
      navigate("/company-dashboard");
    } else {
      console.log("Standard user detected, redirecting to home page");
      navigate("/ask-briki-ai");
    }
  };
  
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(queryKey[0] as string);
        
        if (response.status === 401) {
          console.log("User not authenticated (401)");
          return null;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error response: ${response.status} - ${errorText || response.statusText}`);
          throw new Error(`${response.status}: ${errorText || response.statusText}`);
        }
        
        const userData = await response.json();
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
  });

  const login = () => {
    window.location.href = "/api/login";
  };

  const logout = () => {
    window.location.href = "/api/logout";
  };

  // Show welcome notification on login
  useEffect(() => {
    const lastAuthState = localStorage.getItem('lastAuthState');
    const currentAuthState = Boolean(user);
    
    // If we just logged in (changed from not authenticated to authenticated)
    if (currentAuthState && lastAuthState === 'false') {
      toast({
        title: "Welcome to Briki!",
        description: `You've successfully signed in to our AI-powered insurance platform.`,
        variant: "default",
      });
    }
    
    // Store current auth state for future reference
    localStorage.setItem('lastAuthState', String(currentAuthState));
  }, [user, toast]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
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