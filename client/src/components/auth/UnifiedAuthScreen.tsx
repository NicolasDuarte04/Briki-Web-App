import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UnifiedAuthForm from "./UnifiedAuthForm";
import { trackEvent } from "../../lib/analytics";

interface UnifiedAuthScreenProps {
  initialTab?: "login" | "signup";
}

export default function UnifiedAuthScreen({ initialTab = "login" }: UnifiedAuthScreenProps) {
  // State management
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
  // Navigation
  const [, navigate] = useLocation();
  
  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Track tab change
    trackEvent("auth_tab_change", "authentication", value);
  };
  
  // Success handler for form submission
  const handleAuthSuccess = () => {
    navigate("/ask-briki-ai");
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Subtle animated gradient background */}
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
          <div className="absolute -z-20 w-full h-full opacity-30" style={{ 
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(76, 110, 255, 0.1) 0%, transparent 50%)"
          }}></div>
        </div>
        
        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex justify-center mb-6">
            <h2 className="briki-logo text-2xl font-bold tracking-tight">
              briki
              <span className="checkmark">✓</span>
            </h2>
          </div>
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="login" 
                className="font-medium rounded-md text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="font-medium rounded-md text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login" className="mt-0">
              <UnifiedAuthForm mode="login" onSuccess={handleAuthSuccess} />
            </TabsContent>
            
            {/* Sign Up Tab */}
            <TabsContent value="signup" className="mt-0">
              <UnifiedAuthForm mode="signup" onSuccess={handleAuthSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}