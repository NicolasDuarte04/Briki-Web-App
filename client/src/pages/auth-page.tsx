import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { insertUserSchema } from "@shared/schema";

import { Input } from "@/components/ui/input";
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

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
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
        const response = await fetch('/api/user', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          console.log("AuthPage: Direct auth check - User is authenticated");
        } else {
          console.log("AuthPage: Direct auth check - No authenticated user");
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
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess]);

  return (
    <div className="auth-layout">
      {/* Subtle gradient background */}
      <div className="auth-background"></div>
      
      {/* Centered auth container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          className="text-center"
        >
          <h1 className="auth-logo">Briki</h1>
          <p className="auth-logo-tagline">AI-Powered Insurance Platform</p>
        </motion.div>
          
        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.21, 0.61, 0.35, 1] }}
        >
          <div className="auth-card">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="auth-tabs-list">
                <TabsTrigger 
                  value="login" 
                  className={`auth-tab ${activeTab === 'login' ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className={`auth-tab ${activeTab === 'register' ? 'font-medium' : 'text-muted-foreground'}`}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium block mb-1.5">Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" className="auth-input" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 text-destructive" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium block mb-1.5">Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="auth-input" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 text-destructive" />
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
                                className="rounded border-muted data-[state=checked]:bg-primary"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-foreground/70 cursor-pointer">Remember me</FormLabel>
                          </FormItem>
                        )}
                      />
                      <button type="button" className="text-sm text-primary/90 hover:text-primary transition-colors">
                        Forgot password?
                      </button>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <button 
                        type="submit" 
                        className="auth-submit-button" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign in"}
                      </button>
                    </motion.div>
                  </form>
                </Form>
                
                <div className="auth-divider mt-6 text-center">
                  <span className="auth-divider-text">Or continue with</span>
                </div>
                  
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="auth-social-button"
                    type="button"
                  >
                    <svg className="w-4 h-4 mr-2 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                    <span className="text-foreground">Google</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="auth-social-button"
                    type="button"
                  >
                    <svg className="w-4 h-4 mr-2 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                    <span className="text-foreground">Facebook</span>
                  </motion.button>
                </div>
              </TabsContent>
              
              {/* Register form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium block mb-1.5">Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" className="auth-input" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 text-destructive" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium block mb-1.5">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" className="auth-input" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 text-destructive" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium block mb-1.5">Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="auth-input" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 text-destructive" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium block mb-1.5">Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="auth-input" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs mt-1 text-destructive" />
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
                              className="rounded border-muted data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal text-foreground/80 cursor-pointer">
                              I agree to the{" "}
                              <a href="#" className="text-primary/90 hover:text-primary transition-colors">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="#" className="text-primary/90 hover:text-primary transition-colors">
                                Privacy Policy
                              </a>
                            </FormLabel>
                            <FormMessage className="text-xs text-destructive" />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create account"}
                      </button>
                    </motion.div>
                  </form>
                </Form>
                
                <div className="auth-divider mt-6 text-center">
                  <span className="auth-divider-text">Or continue with</span>
                </div>
                  
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="auth-social-button"
                    type="button"
                  >
                    <svg className="w-4 h-4 mr-2 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                    <span className="text-foreground">Google</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="auth-social-button"
                    type="button"
                  >
                    <svg className="w-4 h-4 mr-2 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                    <span className="text-foreground">Facebook</span>
                  </motion.button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}