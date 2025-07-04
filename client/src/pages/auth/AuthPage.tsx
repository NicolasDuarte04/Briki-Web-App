import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Shield, Zap, BarChart3, Users, Star, CheckCircle } from "lucide-react";
import UnifiedAuthForm from "../../components/auth/UnifiedAuthForm";
import { useAuth } from "../../hooks/use-auth";
import { trackEvent } from "../../lib/analytics";

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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      <FloatingElements />
      
      {/* Back to home button - Fixed position */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-b from-white/80 to-transparent dark:from-gray-950/80 dark:to-transparent backdrop-blur-sm z-[100]">
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

      {/* Split Layout Container */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side - Benefits Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-500 relative flex items-center justify-center p-8 lg:p-16">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Welcome to Briki
              </h1>
              <p className="text-xl mb-8 text-blue-50">
                Colombia's #1 AI-powered insurance platform
              </p>
              
              {/* Benefits list */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Instant AI Analysis</h3>
                    <p className="text-blue-50">Get personalized insurance recommendations in seconds</p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Compare Plans Easily</h3>
                    <p className="text-blue-50">Side-by-side comparison of all major providers</p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                    <p className="text-blue-50">Your data is encrypted and never shared</p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Trusted by 50,000+ Users</h3>
                    <p className="text-blue-50">Join thousands who save time and money</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-blue-50 italic mb-3">
                  "Briki helped me find the perfect health insurance plan in minutes. The AI assistant answered all my questions!"
                </p>
                <p className="text-white font-semibold">María González</p>
                <p className="text-blue-100 text-sm">Verified Customer</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                briki
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mt-2">
                Your AI-powered insurance companion
              </p>
            </motion.div>
            
            {/* Auth form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <UnifiedAuthForm mode={params?.tab === "signup" ? "signup" : "login"} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}