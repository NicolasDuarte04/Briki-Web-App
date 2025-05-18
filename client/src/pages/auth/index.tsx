import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import AuthForm from "@/components/auth/FixedAuthForm";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Handle redirect parameters and errors
  useEffect(() => {
    // Get current URL parameters
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");
    const returnTo = localStorage.getItem("authReturnTo");
    
    // Handle error messages
    if (error) {
      let errorMessage = "Authentication failed. Please try again.";
      
      switch (error) {
        case "google_auth_failed":
          errorMessage = "Google authentication failed. Please try again.";
          break;
        case "login_failed":
          errorMessage = "Login failed. Please try again.";
          break;
        case "invalid_credentials":
          errorMessage = "Invalid username or password.";
          break;
        default:
          break;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Remove error from URL to prevent showing the error again on refresh
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
    
    // Clean up return path from localStorage if found
    if (returnTo) {
      localStorage.removeItem("authReturnTo");
    }
  }, [toast]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient with Briki's colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003087] to-[#33BFFF] opacity-10 dark:opacity-20"></div>
      
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-40"
        style={{
          background: "linear-gradient(45deg, #003087, #33BFFF)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 text-center"
      >
        <div className="w-full max-w-md mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#003087] to-[#33BFFF] dark:from-[#1560C2] dark:to-[#33BFFF]">
            Welcome to Briki
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your intelligent insurance companion for smarter choices
          </p>
        </div>
      </motion.div>
      
      {/* Authentication form */}
      <div className="z-10">
        <AuthForm />
      </div>
      
      {/* Legal info */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 z-10">
        <p>
          By continuing, you agree to Briki's{" "}
          <a href="/terms" className="underline hover:text-gray-800 dark:hover:text-gray-200">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-gray-800 dark:hover:text-gray-200">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}