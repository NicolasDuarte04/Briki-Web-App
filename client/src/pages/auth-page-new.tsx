import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { insertUserSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Import our new components
import AnimatedBackground from "@/components/animated-background";
import GlassCard from "@/components/glass-card";
import EnhancedInput from "@/components/enhanced-input";
import GradientButton from "@/components/gradient-button";

import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Icons
import { Mail, Lock, User, Info } from "lucide-react";

// Form schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email address"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPageNew() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Initialize forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      terms: true as true, // Type assertion to satisfy the literal true requirement
      name: null,
    },
  });
  
  // Handle form submissions
  const onLoginSubmit: SubmitHandler<LoginFormValues> = (values) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };
  
  const onRegisterSubmit: SubmitHandler<RegisterFormValues> = (values) => {
    registerMutation.mutate({
      username: values.username,
      password: values.password,
      email: values.email,
      name: values.username, // Using username as name for simplicity
    });
  };
  
  // Auth checks and redirects
  useEffect(() => {
    // Check auth on load
    const checkAuth = async () => {
      try {
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
          console.log("AuthPage: No auth token found in storage");
          return;
        }
        
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          console.log("AuthPage: Direct auth check - User is authenticated");
        } else {
          console.log("AuthPage: Direct auth check - No authenticated user");
          // Clear invalid token
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error("AuthPage: Error checking auth status:", error);
      }
    };
    
    checkAuth();
  }, []);
  
  // Redirect if user is logged in
  useEffect(() => {
    if (user) {
      console.log("AuthPage: User already logged in, redirecting to home page");
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);
    }
  }, [user]);
  
  // Handle auth flow redirects
  useEffect(() => {
    if (loginMutation.isSuccess || registerMutation.isSuccess) {
      console.log("AuthPage: Auth successful, redirecting to home page");
      
      // Show welcome toast notification
      toast({
        title: "Welcome to Briki!",
        description: "You've successfully signed in to our AI-powered insurance platform.",
        variant: "default",
      });
      
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess, toast]);

  return (
    <AnimatedBackground variant="auth" className="flex min-h-screen items-center justify-center px-4 py-24">
      {/* Centered auth container */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Logo and branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-[#3D70F5] to-[#59A0FF] bg-clip-text text-transparent drop-shadow-md">
            Briki
          </h1>
          <p className="text-lg text-slate-800 font-semibold mt-2 px-3 py-1.5 bg-white/60 rounded-md backdrop-blur-sm inline-block shadow-sm">
            AI-Powered Insurance Platform
          </p>
        </motion.div>
          
        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.21, 0.61, 0.35, 1] }}
          className="relative z-20"
        >
          <GlassCard variant="default" hover="glow" className="p-8 md:p-10 shadow-2xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 bg-white/20 p-1.5 rounded-lg border border-white/30 shadow-inner">
                <TabsTrigger 
                  value="login" 
                  className={`rounded-md py-3 text-sm font-semibold transition-all duration-300
                    ${activeTab === 'login' 
                      ? 'bg-gradient-to-r from-[#3D70F5] to-[#59A0FF] text-white shadow-md' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'}`}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className={`rounded-md py-3 text-sm font-semibold transition-all duration-300
                    ${activeTab === 'register' 
                      ? 'bg-gradient-to-r from-[#3D70F5] to-[#59A0FF] text-white shadow-md' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'}`}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-8">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Username" 
                            placeholder="Enter your username"
                            icon={<User size={18} className="text-slate-600" />}
                            containerClassName="shadow-sm"
                            className="border-2 border-white/40 placeholder:text-slate-500/80 text-slate-800 font-medium"
                            {...field} 
                          />
                          <FormMessage className="font-medium text-red-500" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            icon={<Lock size={18} className="text-slate-600" />}
                            containerClassName="shadow-sm"
                            className="border-2 border-white/40 placeholder:text-slate-500/80 text-slate-800 font-medium"
                            {...field} 
                          />
                          <FormMessage className="font-medium text-red-500" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center justify-between">
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="rounded border-2 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">Remember me</FormLabel>
                          </FormItem>
                        )}
                      />
                      <button 
                        type="button" 
                        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    
                    <div className="pt-4">
                      <GradientButton
                        type="submit"
                        size="lg"
                        loading={loginMutation.isPending}
                        loadingText="Signing in..."
                        className="w-full py-6 text-base"
                      >
                        Sign in
                      </GradientButton>
                    </div>
                  </form>
                </Form>
                
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative z-10 bg-[rgba(255,255,255,0.8)] px-4 text-sm text-foreground/70 backdrop-blur-sm">
                    Or continue with
                  </div>
                </div>
                  
                <div className="grid grid-cols-2 gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/70 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white/90 border border-white/40"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                    <span>Google</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/70 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white/90 border border-white/40"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                    <span>Facebook</span>
                  </motion.button>
                </div>
              </TabsContent>
              
              {/* Register form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-7">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Username" 
                            placeholder="Choose a username"
                            icon={<User size={18} />}
                            {...field} 
                          />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Email" 
                            placeholder="Enter your email"
                            icon={<Mail size={18} />}
                            {...field} 
                          />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            icon={<Lock size={18} />}
                            {...field} 
                          />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            icon={<Lock size={18} />}
                            {...field} 
                          />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 my-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="rounded border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal text-foreground/80 cursor-pointer">
                              I agree to the{" "}
                              <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                                Privacy Policy
                              </a>
                            </FormLabel>
                            <FormMessage className="text-xs text-destructive" />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <GradientButton
                        type="submit"
                        size="lg"
                        loading={registerMutation.isPending}
                        loadingText="Creating account..."
                        className="w-full"
                      >
                        Create account
                      </GradientButton>
                    </div>
                  </form>
                </Form>
                
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative z-10 bg-[rgba(255,255,255,0.8)] px-4 text-sm text-foreground/70 backdrop-blur-sm">
                    Or continue with
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/70 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white/90 border border-white/40"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                    <span>Google</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white/70 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white/90 border border-white/40"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                    <span>Facebook</span>
                  </motion.button>
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </motion.div>
        
        {/* Footer text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-white/80 mt-6"
        >
          © {new Date().getFullYear()} Briki • All rights reserved
        </motion.p>
      </div>
    </AnimatedBackground>
  );
}