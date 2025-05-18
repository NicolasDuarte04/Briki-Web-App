import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import GoogleLoginButton from "./GoogleLoginButton";
import { trackEvent } from "@/lib/analytics";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Registration form schema with stronger validation
const registrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function AuthForm() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  
  // Authentication context
  const auth = useAuth();
  const { isLoading } = auth;
  const login = auth.login;
  const registerUser = auth.register;
  const { toast } = useToast();

  // Track tab changes for analytics
  useEffect(() => {
    trackEvent(
      `view_${activeTab}_form`,
      "authentication",
      `auth_${activeTab}_view`
    );
  }, [activeTab]);

  // Form for login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form for registration
  const registerForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  // Handle login submit
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      // Track login attempt
      trackEvent("login_attempt", "authentication", "form_login");
      
      const success = await login(data.username, data.password);
      
      if (success) {
        // Track successful login
        trackEvent("login_success", "authentication", "form_login");
      } else {
        // Track failed login
        trackEvent("login_failure", "authentication", "form_login", 0);
        
        loginForm.setError("password", {
          type: "manual",
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      // Track error during login
      trackEvent("login_error", "authentication", "form_login", 0);
      
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle registration submit
  const onRegisterSubmit = async (data: RegistrationFormValues) => {
    try {
      // Track registration attempt
      trackEvent("signup_attempt", "authentication", "form_signup");
      
      const success = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      
      if (success) {
        // Track successful registration
        trackEvent("signup_success", "authentication", "form_signup");
      } else {
        // Track failed registration
        trackEvent("signup_failure", "authentication", "form_signup", 0);
        
        toast({
          title: "Registration failed",
          description: "This username or email might already be in use.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Track error during registration
      trackEvent("signup_error", "authentication", "form_signup", 0);
      
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md"
      >
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full rounded-none border-b border-gray-200 dark:border-gray-800">
            <TabsTrigger 
              value="login" 
              className="auth-tab text-base font-medium py-4"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="auth-tab text-base font-medium py-4"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login" className="p-6 sm:p-8">
            <div className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#003087] to-[#33BFFF]">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Sign in to continue your journey
                </p>
              </div>
              
              <GoogleLoginButton mode="login" />
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
                  or continue with
                </span>
              </div>
              
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            className="auth-input"
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              className="auth-input pr-10"
                              {...field} 
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Remember me</FormLabel>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                      onClick={() => {
                        trackEvent("forgot_password_click", "authentication", "login_form");
                        // Implementation for forgot password
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#003087] to-[#33BFFF] hover:opacity-90 transition-all h-11 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          {/* Sign Up Tab */}
          <TabsContent value="signup" className="p-6 sm:p-8">
            <div className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#003087] to-[#33BFFF]">
                  Create an Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Join Briki for personalized insurance options
                </p>
              </div>
              
              <GoogleLoginButton mode="signup" />
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
                  or sign up with
                </span>
              </div>
              
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Choose a username" 
                            className="auth-input"
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            className="auth-input"
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create a password" 
                              className="auth-input pr-10"
                              {...field} 
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                        <FormMessage />
                        {field.value && field.value.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            <p>Password must include:</p>
                            <ul className="list-disc list-inside">
                              <li className={field.value.length >= 8 ? "text-green-600" : ""}>
                                At least 8 characters
                              </li>
                              <li className={/[A-Z]/.test(field.value) ? "text-green-600" : ""}>
                                Uppercase letter
                              </li>
                              <li className={/[a-z]/.test(field.value) ? "text-green-600" : ""}>
                                Lowercase letter
                              </li>
                              <li className={/[0-9]/.test(field.value) ? "text-green-600" : ""}>
                                Number
                              </li>
                            </ul>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <FormLabel className="cursor-pointer">
                            I agree to the{" "}
                            <a href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-primary hover:underline">
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
                    className="w-full bg-gradient-to-r from-[#003087] to-[#33BFFF] hover:opacity-90 transition-all h-11 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}