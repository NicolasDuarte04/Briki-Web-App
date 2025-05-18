import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import UnifiedAuthForm from "@/components/auth/UnifiedAuthForm";
import { useAuth } from "@/hooks/use-auth";
import { trackEvent } from "@/lib/analytics";

// Animated floating elements for the background
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Large blue blob */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1.5 }}
      className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/30 filter blur-[120px]"
    />
    
    {/* Medium purple-pink blob */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1.5, delay: 0.2 }}
      className="absolute top-[40%] -right-[15%] w-[50%] h-[50%] rounded-full bg-indigo-500/30 filter blur-[100px]"
    />
    
    {/* Small cyan blob */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1.5, delay: 0.4 }}
      className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-cyan-400/30 filter blur-[80px]"
    />
  </div>
);

// Animated background wrapper
const AnimatedBackground = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative min-h-screen ${className || ""}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-indigo-950" />
    <FloatingElements />
    <div className="relative z-10">{children}</div>
  </div>
);

export default function AuthPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute<{ tab?: string }>("/auth/:tab?");
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("User already authenticated, redirecting to home");
      navigate("/home");
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  // Track page view
  useEffect(() => {
    trackEvent("view_auth_page", "authentication", params?.tab || "login");
  }, [params?.tab]);
  
  return (
    <AnimatedBackground className="flex min-h-screen items-center justify-center px-4 py-0">
      {/* Back to home button */}
      <motion.button 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ x: -3 }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to home</span>
      </motion.button>
      
      {/* Auth form container */}
      <div className="w-full max-w-xl px-5 sm:px-8 py-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent drop-shadow-md">
            Briki
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium drop-shadow-md mt-2">
            Your AI-powered insurance companion
          </p>
        </motion.div>
        
        {/* Auth form */}
        <UnifiedAuthForm />
      </div>
    </AnimatedBackground>
  );
}