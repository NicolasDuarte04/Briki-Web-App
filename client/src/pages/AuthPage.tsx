import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { trackEvent } from "@/lib/analytics";
import { UnifiedAuthScreen } from "@/components/auth/UnifiedAuthScreen";
import { AnimatedBackground, FloatingElements } from "@/components/ui/animated-background";

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
    <AnimatedBackground variant="auth" className="flex min-h-screen items-center justify-center px-4 py-0">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-cyan-500/5 backdrop-blur-[80px] opacity-30"></div>
      <FloatingElements />
      
      {/* Back to home button */}
      <motion.button 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ x: -3 }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to home</span>
      </motion.button>
      
      {/* Auth container */}
      <div className="relative z-10 w-full max-w-xl px-5 sm:px-8 py-2">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent drop-shadow-md">
            Briki
          </h1>
          <p className="text-lg text-white/90 font-medium drop-shadow-md mt-2">
            Your AI-powered insurance companion
          </p>
        </motion.div>
        
        {/* Auth form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <UnifiedAuthScreen initialTab={params?.tab as "login" | "signup" || "login"} />
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}