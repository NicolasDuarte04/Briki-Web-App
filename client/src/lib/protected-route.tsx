import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element | null;
}) {
  const { user, isLoading, refetchUser } = useAuth();
  const [, navigate] = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  
  useEffect(() => {
    const MAX_ATTEMPTS = 3; // Increase max attempts
    
    const verifyAuth = async () => {
      // No need to verify if we already have the user
      if (user) {
        console.log("Protected route: User already authenticated:", user.username);
        return;
      }
      
      // Prevent excessive refetching
      if (verificationAttempts >= MAX_ATTEMPTS) {
        console.log("Protected route: Max verification attempts reached");
        return;
      }
      
      // Only attempt to verify if not already in progress and not loading
      if (!isVerifying && !isLoading && !user) {
        try {
          setIsVerifying(true);
          console.log("Protected route: Verifying authentication...");
          
          const result = await refetchUser();
          console.log("Auth verification result:", result?.data ? `User found: ${result.data.username}` : "No user");
          
          setVerificationAttempts(prev => prev + 1);
        } catch (error) {
          console.error("Auth verification failed:", error);
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    console.log("Protected route state:", { 
      isLoading, 
      isVerifying, 
      verificationAttempts,
      authenticated: !!user
    });
    
    verifyAuth();
  }, [user, isLoading, refetchUser, isVerifying, verificationAttempts]);

  // Show loading state while initial loading or during verification
  if (isLoading || isVerifying) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">
            {isVerifying ? "Verifying your session..." : "Loading..."}
          </p>
        </div>
      </Route>
    );
  }

  // After verification attempts, if still no user, redirect to auth
  if (!user) {
    console.log("Protected route: No authenticated user found, redirecting to auth");
    
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // User is authenticated, render the component
  console.log("Protected route: User authenticated, rendering component");
  return <Route path={path} component={Component} />;
}
