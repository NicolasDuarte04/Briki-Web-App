import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { insertUserSchema } from "@shared/schema";

import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { FuturisticBackground } from "@/components/ui/futuristic-background";
import { 
  TravelIcon, 
  AutoIcon, 
  PetIcon, 
  HealthIcon 
} from "@/components/icons/contemporary-icons";
import {
  AppleTravelIcon,
  AppleAutoIcon,
  ApplePetIcon,
  AppleHealthIcon
} from "@/components/icons/apple-style-icons";

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
  
  // Force refresh auth status when auth page is loaded
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a direct fetch request to check authentication status
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
      // Use consistent direct navigation approach
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);
    } else {
      console.log("AuthPage: No logged in user detected, staying on auth page");
    }
  }, [user]);
  
  // Handle login success
  useEffect(() => {
    if (loginMutation.isSuccess) {
      console.log("AuthPage: Login successful, redirecting to home page");
      // Navigate to the home page instead of root
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);
    }
  }, [loginMutation.isSuccess]);
  
  // Handle registration success
  useEffect(() => {
    if (registerMutation.isSuccess) {
      console.log("AuthPage: Registration successful, redirecting to home page");
      // Navigate to the home page instead of root
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);
    }
  }, [registerMutation.isSuccess]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FuturisticBackground particleCount={60} />
      </div>
      
      {/* Left column: Auth form */}
      <div className="flex flex-col justify-center w-full max-w-md px-4 py-12 mx-auto sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-extrabold text-foreground section-header mb-4">Briki</h1>
            <p className="text-foreground/70 mt-2">AI-Powered Insurance Platform</p>
            <div className="flex justify-center mt-8 space-x-8">
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 mb-3">
                  <TravelIcon className="h-full w-full" />
                </div>
                <span className="text-xs text-foreground/80">Travel</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 mb-3">
                  <AutoIcon className="h-full w-full" />
                </div>
                <span className="text-xs text-foreground/80">Auto</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 mb-3">
                  <PetIcon className="h-full w-full" />
                </div>
                <span className="text-xs text-foreground/80">Pet</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 mb-3">
                  <HealthIcon className="h-full w-full" />
                </div>
                <span className="text-xs text-foreground/80">Health</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Username</FormLabel>
                            <FormControl>
                              <Input placeholder="username" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
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
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal text-foreground/80">Remember me</FormLabel>
                            </FormItem>
                          )}
                        />
                        <Button variant="link" className="p-0 h-auto text-sm text-primary">
                          Forgot password?
                        </Button>
                      </div>
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          type="submit" 
                          className="w-full briki-button" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign in"}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="bg-border" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-foreground/70">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button variant="outline" type="button" className="w-full bg-card/50 border-border hover:bg-card/80 backdrop-blur-sm">
                          <svg className="w-4 h-4 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                          </svg>
                          <span className="text-foreground">Google</span>
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button variant="outline" type="button" className="w-full bg-card/50 border-border hover:bg-card/80 backdrop-blur-sm">
                          <svg className="w-4 h-4 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                          </svg>
                          <span className="text-foreground">Facebook</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Username</FormLabel>
                            <FormControl>
                              <Input placeholder="username" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" className="bg-background/50 border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal text-foreground/80">
                                I agree to the <Button variant="link" className="p-0 h-auto text-sm text-primary">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-sm text-primary">Privacy Policy</Button>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full briki-button"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create account"}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="bg-border" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-foreground/70">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button variant="outline" type="button" className="w-full bg-card/50 border-border hover:bg-card/80 backdrop-blur-sm">
                          <svg className="w-4 h-4 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                          </svg>
                          <span className="text-foreground">Google</span>
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button variant="outline" type="button" className="w-full bg-card/50 border-border hover:bg-card/80 backdrop-blur-sm">
                          <svg className="w-4 h-4 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                          </svg>
                          <span className="text-foreground">Facebook</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right column: Hero image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
          <div className="absolute inset-0">
            <FuturisticBackground particleCount={40} interactive={false} />
          </div>
          
          <div className="flex flex-col items-center justify-center h-full text-foreground px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-8 flex flex-wrap justify-center gap-8"
            >
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-16 w-16 mb-3">
                  <TravelIcon className="h-full w-full" />
                </div>
                <span className="text-foreground/90">Travel Insurance</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-16 w-16 mb-3">
                  <AutoIcon className="h-full w-full" />
                </div>
                <span className="text-foreground/90">Auto Insurance</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-16 w-16 mb-3">
                  <PetIcon className="h-full w-full" />
                </div>
                <span className="text-foreground/90">Pet Insurance</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-16 w-16 mb-3">
                  <HealthIcon className="h-full w-full" />
                </div>
                <span className="text-foreground/90">Health Insurance</span>
              </motion.div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-xl max-w-xl text-center text-foreground/90 section-header"
            >
              AI-powered insurance platform comparing plans across multiple categories with real-time analysis.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}