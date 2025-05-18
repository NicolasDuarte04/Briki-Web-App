import { useEffect } from 'react';
import { useLocation } from "wouter";
import UnifiedAuthScreen from "@/components/auth/UnifiedAuthScreen";
import { useAuth } from "@/hooks/use-auth";
import { trackEvent } from "@/lib/analytics";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User already authenticated, redirecting");
      
      // Redirect based on user role
      if (user.role === "company") {
        navigate("/company-dashboard");
        trackEvent("auth_redirect", "navigation", "company_dashboard");
      } else {
        navigate("/home");
        trackEvent("auth_redirect", "navigation", "home");
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  // Track page view
  useEffect(() => {
    trackEvent("view_auth_page", "authentication", "login");
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="w-full max-w-md">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !isAuthenticated ? (
          <UnifiedAuthScreen />
        ) : null}
      </div>
    </div>
  );
}