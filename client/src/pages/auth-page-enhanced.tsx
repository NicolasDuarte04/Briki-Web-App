import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { insertUserSchema, User as SelectUser } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
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
import { Mail, Lock, User, Info, ArrowLeft, CheckCircle2 } from "lucide-react";

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

export default function AuthPageEnhanced() {
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
      terms: false as any, // Default to unchecked for better UX
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
    if (user) {
      toast({
        title: "Already logged in",
        description: "You are already logged in to your account.",
      });
      setTimeout(() => {
        navigate('/home');
      }, 500);
    }
  }, [user, navigate, toast]);
  
  // Handle auth flow redirects with role-based routing
  useEffect(() => {
    if (loginMutation.isSuccess || registerMutation.isSuccess) {
      // Get the user data from the query cache
      const userData = queryClient.getQueryData<SelectUser>(["/api/user"]);
      
      // Show welcome toast notification
      toast({
        title: "Welcome to Briki!",
        description: "You've successfully signed in to our AI-powered insurance platform.",
        variant: "default",
      });
      
      // Role-based redirection
      setTimeout(() => {
        if (userData?.role === "company") {
          console.log("Company user detected, redirecting to company dashboard");
          navigate('/company-dashboard');
        } else {
          console.log("Standard user detected, redirecting to home");
          navigate('/home');
        }
      }, 1000);
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess, navigate, toast]);

  // Handle login errors
  useEffect(() => {
    if (loginMutation.isError) {
      toast({
        title: "Login failed",
        description: "Please check your username and password and try again.",
        variant: "destructive",
      });
    }
  }, [loginMutation.isError, toast]);

  // Handle registration errors
  useEffect(() => {
    if (registerMutation.isError) {
      toast({
        title: "Registration failed",
        description: "This username or email might already be in use. Please try another.",
        variant: "destructive",
      });
    }
  }, [registerMutation.isError, toast]);

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
          <GlassCard className="p-5 sm:p-6 rounded-2xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-5 bg-white/10 p-1.5 rounded-lg shadow-inner">
                <TabsTrigger 
                  value="login" 
                  className={`rounded-md py-3 text-sm font-semibold transition-all
                    ${activeTab === 'login' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-foreground/80 hover:text-foreground'}`}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className={`rounded-md py-3 text-sm font-semibold transition-all
                    ${activeTab === 'register' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-foreground/80 hover:text-foreground'}`}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login form */}
              <TabsContent value="login" className="space-y-1">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Username" 
                            placeholder="Enter your username"
                            icon={<User size={18} />}
                            error={loginForm.formState.errors.username?.message}
                            className="h-12"
                            {...field} 
                          />
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
                            icon={<Lock size={18} />}
                            error={loginForm.formState.errors.password?.message}
                            className="h-12"
                            {...field} 
                          />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center justify-between pt-1">
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="rounded border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">Remember me</FormLabel>
                          </FormItem>
                        )}
                      />
                      <button 
                        type="button" 
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
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
                        className="w-full h-12 font-semibold"
                      >
                        Sign in
                      </GradientButton>
                    </div>
                  </form>
                </Form>
                
                <div className="relative flex items-center justify-center my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative z-10 bg-[rgba(255,255,255,0.8)] px-4 text-sm text-foreground/70 backdrop-blur-sm rounded-full">
                    Or continue with
                  </div>
                </div>
                  
                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98 }}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white/80 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white/90 border border-white/40"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                    <span>Google</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98 }}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white/80 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white/90 border border-white/40"
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
              <TabsContent value="register" className="space-y-1">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <EnhancedInput
                            label="Username" 
                            placeholder="Choose a username"
                            icon={<User size={18} />}
                            error={registerForm.formState.errors.username?.message}
                            className="h-12"
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
                            error={registerForm.formState.errors.email?.message}
                            className="h-12"
                            {...field} 
                          />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-6">
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
                              error={registerForm.formState.errors.password?.message}
                              className="h-12"
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
                              error={registerForm.formState.errors.confirmPassword?.message}
                              className="h-12"
                              {...field} 
                            />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="rounded border-input mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-snug">
                            <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                              I agree to the{" "}
                              <a href="#" className="text-primary font-semibold hover:text-primary/80 underline underline-offset-2 transition-colors">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="#" className="text-primary font-semibold hover:text-primary/80 underline underline-offset-2 transition-colors">
                                Privacy Policy
                              </a>
                            </FormLabel>
                            {registerForm.formState.errors.terms && (
                              <p className="text-xs font-medium text-red-500 mt-1">{registerForm.formState.errors.terms.message}</p>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <GradientButton
                        type="submit"
                        size="lg"
                        loading={registerMutation.isPending}
                        loadingText="Creating account..."
                        className="w-full h-12 font-semibold"
                      >
                        Create Account
                      </GradientButton>
                    </div>

                    {/* Sign-up benefits */}
                    <div className="mt-6 rounded-xl border border-blue-100/30 bg-blue-50/20 p-4">
                      <h4 className="mb-2 text-sm font-medium text-blue-900/80">Join Briki for these benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "Get personalized insurance recommendations",
                          "Save your preferences and trip details",
                          "Manage all your insurance policies in one place",
                          "Access exclusive member-only offers"
                        ].map((benefit, index) => (
                          <li key={index} className="flex items-start text-xs text-blue-800/70">
                            <CheckCircle2 className="mr-1.5 h-4 w-4 flex-shrink-0 text-primary/70" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </motion.div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-foreground/60">
          <p>© 2025 Briki. All rights reserved.</p>
          <p className="mt-1">
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Terms</a>
            <span className="mx-2">•</span>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Privacy</a>
            <span className="mx-2">•</span>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Help</a>
          </p>
        </div>
      </div>
    </AnimatedBackground>
  );
}