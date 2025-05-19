import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedAuthForm from "./UnifiedAuthForm";
import { trackEvent } from "@/lib/analytics";

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
    navigate("/home");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Briki</h2>
        </div>
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="login" className="font-medium rounded-md text-gray-800 dark:text-white data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">Log In</TabsTrigger>
            <TabsTrigger value="signup" className="font-medium rounded-md text-gray-800 dark:text-white data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">Sign Up</TabsTrigger>
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
  );
}