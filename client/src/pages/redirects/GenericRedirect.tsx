import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Generic redirect component that redirects from a legacy path to a new path
 * Reusable across all redirect scenarios
 */
interface GenericRedirectProps {
  to: string;
}

export default function GenericRedirect({ to }: GenericRedirectProps) {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to the new path
    navigate(to, { replace: true });
  }, [navigate, to]);
  
  // Return a loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}