import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { User as SelectUser, UpsertUser } from "../../../shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

// Import design system components
import { GradientButton, GradientCard } from "../components/ui";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

// Icons
import { Mail, Lock, User, ArrowRight, CheckCircle2, Quote, Star, Sparkles, Shield, ArrowLeft, Eye, EyeOff, Building2 } from "lucide-react";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

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
  const [showPassword, setShowPassword] = useState(false);
  const { user, loginMutation, registerMutation, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

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
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#003f5c] via-[#0077B6] to-[#00A8A6] relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#00C7C4]/10 rounded-full blur-3xl" />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
            <h1 className="text-5xl font-bold mb-2">Briki</h1>
            <p className="text-xl text-white/80">AI-Powered Insurance, Simplified</p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Why Choose Briki?</h2>
            <div className="space-y-4">
              {[
                { icon: Sparkles, text: "AI-powered recommendations", desc: "Get personalized insurance advice" },
                { icon: Shield, text: "Compare instantly", desc: "Find the best coverage in seconds" },
                { icon: Building2, text: "Trusted providers", desc: "Work with Colombia's top insurers" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.text}</h3>
                    <p className="text-white/70">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
          </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <Quote className="h-8 w-8 text-white/50 mb-4" />
            <p className="text-lg italic mb-4">
              "Briki helped me save 30% on my car insurance while getting better coverage. The AI assistant made everything so simple!"
              </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Maria Rodriguez</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#00C7C4] text-[#00C7C4]" />
                  ))}
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to home</span>
        </motion.button>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GradientCard variant="elevated" className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === "login" ? "Welcome Back" : "Get Started"}
              </h2>
              <p className="text-gray-600">
                {activeTab === "login" 
                  ? "Sign in to access your insurance dashboard" 
                  : "Create an account to start saving on insurance"}
              </p>
            </div>

            {/* Google Login */}
            <div className="mb-6">
              <GoogleLoginButton mode={activeTab === "login" ? "login" : "signup"} />
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
          </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00C7C4] data-[state=active]:to-[#0077B6] data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00C7C4] data-[state=active]:to-[#0077B6] data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                    <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                          <FormLabel>Username or Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    {...field} 
                                placeholder="john@example.com"
                                className="pl-10 h-12 border-gray-300 focus:border-[#00C7C4] focus:ring-[#00C7C4]"
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
                          <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    {...field} 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#00C7C4] focus:ring-[#00C7C4]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
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
                          <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                                  Remember me
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                      <a href="/forgot-password" className="text-sm text-[#0077B6] hover:text-[#00C7C4]">
                            Forgot password?
                      </a>
                        </div>

                    <GradientButton
                          type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={loginMutation.isPending}
                    >
                      <span>Sign In</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </GradientButton>
                      </form>
                    </Form>
                </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                    <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                          <FormLabel>Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    {...field} 
                                placeholder="johndoe"
                                className="pl-10 h-12 border-gray-300 focus:border-[#00C7C4] focus:ring-[#00C7C4]"
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
                          <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                {...field}
                                    type="email"
                                placeholder="john@example.com"
                                className="pl-10 h-12 border-gray-300 focus:border-[#00C7C4] focus:ring-[#00C7C4]"
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
                          <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                    {...field} 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#00C7C4] focus:ring-[#00C7C4]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
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
                          <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input 
                                {...field}
                                    type="password"
                                placeholder="••••••••"
                                className="pl-10 h-12 border-gray-300 focus:border-[#00C7C4] focus:ring-[#00C7C4]"
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
                        <FormItem className="flex items-start space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              className="mt-1"
                                />
                              </FormControl>
                          <FormLabel className="text-sm font-normal leading-relaxed">
                                  I agree to the{" "}
                            <a href="/terms" className="text-[#0077B6] hover:text-[#00C7C4]">
                              Terms and Conditions
                                  </a>{" "}
                                  and{" "}
                            <a href="/privacy" className="text-[#0077B6] hover:text-[#00C7C4]">
                                    Privacy Policy
                                  </a>
                                </FormLabel>
                            </FormItem>
                          )}
                        />

                    <GradientButton
                          type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={registerMutation.isPending}
                    >
                      <span>Create Account</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </GradientButton>
                      </form>
                    </Form>
                </TabsContent>
            </Tabs>

          {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {activeTab === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("register")}
                      className="text-[#0077B6] hover:text-[#00C7C4] font-medium"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-[#0077B6] hover:text-[#00C7C4] font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </GradientCard>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Data Protected</span>
          </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}