import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { User as SelectUser, UpsertUser } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Import UI components
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Mail, Lock, User, ArrowRight, CheckCircle2, Quote, Star, Sparkles } from "lucide-react";

// Form schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email address"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions"
  }),
  name: z.string().nullable().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

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
      terms: false,
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
      firstName: values.username,
      lastName: "",
      id: crypto.randomUUID(),
      role: "user"
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

  // Handle welcome notification on successful auth
  useEffect(() => {
    if (loginMutation.isSuccess || registerMutation.isSuccess) {
      toast({
        title: "Welcome to Briki!",
        description: "You've successfully signed in to our AI-powered insurance platform.",
        variant: "default",
      });
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess, toast]);

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
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#0077B6] via-[#0098C1] to-[#00C7C4] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <motion.h1 
              className="text-5xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Briki
            </motion.h1>
            <motion.p 
              className="mt-2 text-xl text-white/80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              AI-Powered Insurance Platform
            </motion.p>
          </div>

          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Quote className="h-8 w-8 text-white/60 mb-4" />
              <p className="text-lg mb-6 leading-relaxed">
                "Briki transformed how I shop for insurance. The AI recommendations saved me hours of research and helped me find the perfect coverage for my family."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-semibold">MC</span>
                </div>
                <div>
                  <p className="font-semibold">Maria Castellanos</p>
                  <p className="text-sm text-white/70">Briki Customer</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/70 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/70 mt-1">Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/70 mt-1">AI Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-gray-50/50 to-white">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C7C4] to-[#0077B6]">
              Briki
            </h1>
            <p className="text-gray-600 mt-2">AI-Powered Insurance Platform</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-8 bg-gray-100/50 p-1.5 rounded-xl">
                <TabsTrigger 
                  value="login" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {/* Login form */}
                <TabsContent value="login" className="space-y-6 mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    placeholder="Enter your username"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-[#00C7C4] focus:ring-[#00C7C4]/20"
                                    {...field} 
                                  />
                                </div>
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
                              <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    type="password"
                                    placeholder="Enter your password"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-[#00C7C4] focus:ring-[#00C7C4]/20"
                                    {...field} 
                                  />
                                </div>
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
                                    className="border-gray-300 data-[state=checked]:bg-[#0077B6] data-[state=checked]:border-[#0077B6]"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm text-gray-600 font-normal cursor-pointer">
                                  Remember me
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <button 
                            type="button" 
                            className="text-sm text-[#0077B6] hover:text-[#00C7C4] transition-colors font-medium"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <Button
                          type="submit"
                          disabled={loginMutation.isPending}
                          className="w-full h-12 bg-gradient-to-r from-[#00C7C4] to-[#0077B6] hover:shadow-lg hover:shadow-[#00C7C4]/25 transition-all duration-300 font-semibold text-white"
                        >
                          {loginMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Signing in...
                            </div>
                          ) : (
                            <>
                              Sign in
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>

                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700"
                        type="button"
                        onClick={() => window.location.href = '/api/auth/google'}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-100 border border-gray-200 font-medium text-gray-400 cursor-not-allowed relative"
                        type="button"
                        disabled
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                        <span className="absolute -top-2 -right-2 text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full">Soon</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Register form */}
                <TabsContent value="register" className="space-y-6 mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    placeholder="Choose a username"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-[#00C7C4] focus:ring-[#00C7C4]/20"
                                    {...field} 
                                  />
                                </div>
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
                              <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-[#00C7C4] focus:ring-[#00C7C4]/20"
                                    {...field} 
                                  />
                                </div>
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
                              <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    type="password"
                                    placeholder="Create a password"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-[#00C7C4] focus:ring-[#00C7C4]/20"
                                    {...field} 
                                  />
                                </div>
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
                              <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-[#00C7C4] focus:ring-[#00C7C4]/20"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-1 border-gray-300 data-[state=checked]:bg-[#0077B6] data-[state=checked]:border-[#0077B6]"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm text-gray-600 font-normal">
                                  I agree to the{" "}
                                  <a href="#" className="text-[#0077B6] hover:text-[#00C7C4] font-medium underline underline-offset-2">
                                    Terms of Service
                                  </a>{" "}
                                  and{" "}
                                  <a href="#" className="text-[#0077B6] hover:text-[#00C7C4] font-medium underline underline-offset-2">
                                    Privacy Policy
                                  </a>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={registerMutation.isPending}
                          className="w-full h-12 bg-gradient-to-r from-[#00C7C4] to-[#0077B6] hover:shadow-lg hover:shadow-[#00C7C4]/25 transition-all duration-300 font-semibold text-white"
                        >
                          {registerMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Creating account...
                            </div>
                          ) : (
                            <>
                              Create Account
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>

                        {/* Benefits */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-[#00C7C4]/5 to-[#0077B6]/5 rounded-xl border border-[#00C7C4]/10">
                          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#0077B6]" />
                            Why join Briki?
                          </h4>
                          <ul className="space-y-2">
                            {[
                              "AI-powered insurance recommendations",
                              "Compare plans side-by-side instantly",
                              "Save your preferences and quotes",
                              "Access exclusive member benefits"
                            ].map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-[#00C7C4] mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 Briki. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">Help</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}