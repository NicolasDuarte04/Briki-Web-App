import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Redirect component for legacy route
 * This redirects /auto-insurance to /explore/auto
 */
export default function AutoInsuranceRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to the new path
    navigate("/explore/auto", { replace: true });
  }, [navigate]);
  
  // Return null or a loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}