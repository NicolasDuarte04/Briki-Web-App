import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";

// Import our components
import AnimatedBackground from "../components/animated-background";
import GlassCard from "../components/ui/glass-card";
import GradientButton from "../components/gradient-button";

// Icons
import { ArrowLeft, LogIn } from "lucide-react";

// Decorative floating elements
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Top right element */}
    <motion.div 
      className="absolute top-[10%] right-[10%] bg-gradient-to-br from-blue-400/40 to-purple-400/40 w-24 h-24 rounded-full blur-xl"
      animate={{ 
        y: [0, 15, 0],
        opacity: [0.4, 0.5, 0.4],
      }}
      transition={{ 
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
    
    {/* Bottom left element */}
    <motion.div 
      className="absolute bottom-[10%] left-[15%] bg-gradient-to-br from-cyan-400/30 to-blue-500/30 w-32 h-32 rounded-full blur-2xl"
      animate={{ 
        y: [0, -20, 0],
        opacity: [0.3, 0.4, 0.3],
      }}
      transition={{ 
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity,
        delay: 1,
      }}
    />
    
    {/* Middle right element */}
    <motion.div 
      className="absolute top-[45%] right-[8%] bg-gradient-to-br from-indigo-400/30 to-sky-300/30 w-16 h-16 rounded-full blur-xl"
      animate={{ 
        x: [0, 15, 0],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ 
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        delay: 0.5,
      }}
    />
  </div>
);

export default function AuthPageReplit() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Direct login with Replit auth
  const login = () => {
    window.location.href = "/api/login";
  };
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Auth checks and redirects
  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Already logged in",
        description: "You are already logged in to your account.",
      });
      setTimeout(() => {
        navigate('/home');
      }, 500);
    }
  }, [isAuthenticated, navigate, toast]);

  return (
    <AnimatedBackground variant="auth" className="flex min-h-screen items-center justify-center px-4 py-0">
      {/* Floating decorative elements with subtle gradient overlay */}
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
      
      {/* Centered auth container with reduced spacing */}
      <div className="relative z-10 w-full max-w-xl px-5 sm:px-8 py-2">
        {/* Logo and branding with reduced bottom margin */}
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
            AI-Powered Insurance Platform
          </p>
        </motion.div>
          
        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.21, 0.61, 0.35, 1] }}
        >
          <GlassCard className="p-6 sm:p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-3">Welcome</h2>
            <p className="text-white/90 mb-8">
              Sign in to access your personalized insurance recommendations and manage your coverage.
            </p>
            
            <GradientButton
              onClick={login}
              size="lg"
              loading={isLoading}
              loadingText="Signing in..."
              className="w-full h-12 font-semibold mb-6"
              icon={<LogIn className="mr-2 h-5 w-5" />}
            >
              Sign in with Replit
            </GradientButton>
            
            <p className="text-sm text-white/70">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}