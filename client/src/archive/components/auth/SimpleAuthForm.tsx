import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

export default function SimpleAuthForm() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Handle Google login
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" className="py-3">Log In</TabsTrigger>
            <TabsTrigger value="signup" className="py-3">Sign Up</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login" className="p-6">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-gray-500 dark:text-gray-400">Sign in to continue your journey</p>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 w-full"
              >
                <FcGoogle className="h-5 w-5" />
                <span>Continue with Google</span>
              </Button>
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-sm text-gray-500">
                  or continue with
                </span>
              </div>
              
              <p className="text-center text-gray-500">
                Email/Password login will be available in future updates.
              </p>
            </div>
          </TabsContent>
          
          {/* Sign Up Tab */}
          <TabsContent value="signup" className="p-6">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Create an Account</h2>
                <p className="text-gray-500 dark:text-gray-400">Join Briki for personalized insurance options</p>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 w-full"
              >
                <FcGoogle className="h-5 w-5" />
                <span>Sign up with Google</span>
              </Button>
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-sm text-gray-500">
                  or sign up with
                </span>
              </div>
              
              <p className="text-center text-gray-500">
                Email/Password registration will be available in future updates.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}