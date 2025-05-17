import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import SimpleAuthForm from "@/components/auth/SimpleAuthForm";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  
  // Extract error message from URL if present
  useEffect(() => {
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");
    
    if (error) {
      // Clear error from URL to prevent showing again on refresh
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
      
      // Display error toast (will implement when toast is available)
      console.error("Authentication error:", error);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-50"
        style={{
          background: "linear-gradient(45deg, #3b82f6, #6366f1, #8b5cf6, #ec4899)",
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
      >
        <div className="w-full max-w-md mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500 dark:from-blue-400 dark:to-violet-400">
            Welcome to Briki
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your intelligent insurance companion for smarter choices
          </p>
        </div>
      </motion.div>
      
      {/* Authentication form */}
      <SimpleAuthForm />
      
      {/* Legal info */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
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