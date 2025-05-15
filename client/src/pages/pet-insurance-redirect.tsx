import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Redirect component for legacy route
 * This redirects /pet-insurance to /explore/pet
 */
export default function PetInsuranceRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to the new path
    navigate("/explore/pet", { replace: true });
  }, [navigate]);
  
  // Return null or a loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}