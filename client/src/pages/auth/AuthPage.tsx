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
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.5 }}
      className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 filter blur-[120px]"
    />
    
    {/* Medium blob */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.5, delay: 0.2 }}
      className="absolute top-[40%] -right-[15%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 filter blur-[100px]"
    />
    
    {/* Small blob */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.5, delay: 0.4 }}
      className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 filter blur-[80px]"
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
    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900" />
    <FloatingElements />
    <div className="relative z-10 w-full">{children}</div>
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
      {/* Back to home button - Fixed position */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-b from-white/80 to-white/0 dark:from-gray-950/80 dark:to-gray-950/0 backdrop-blur-sm z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors py-6"
            onClick={() => navigate('/')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: -3 }}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to home</span>
          </motion.button>
        </div>
      </div>
      
      {/* Auth form container */}
      <div className="w-full max-w-xl px-5 sm:px-8 py-2 mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
            briki
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mt-2">
            Your AI-powered insurance companion
          </p>
        </motion.div>
        
        {/* Auth form */}
        <UnifiedAuthForm mode="login" />
      </div>
    </AnimatedBackground>
  );
}