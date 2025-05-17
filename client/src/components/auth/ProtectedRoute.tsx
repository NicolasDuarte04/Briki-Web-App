import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

// Special component for use with wouter's <Route> system
export default function ProtectedRoute({ path, component }: { path: string, component: () => JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Only redirect if we're on this route, not authenticated, and done loading
    if (location.startsWith(path) && !isAuthenticated && !isLoading) {
      // Store the current location for post-login redirect
      localStorage.setItem("returnTo", location);
      setLocation("/auth");
    }
  }, [isAuthenticated, isLoading, location, path, setLocation]);
  
  // If loading or not authenticated, return null (wouter will handle this correctly)
  if (isLoading || !isAuthenticated) {
    return null;
  }
  
  // If authenticated, render the component
  const Component = component;
  return <Component />;
}