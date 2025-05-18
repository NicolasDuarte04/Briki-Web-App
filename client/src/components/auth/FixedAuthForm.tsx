import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormSuccess } from "@/components/ui/form";
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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Registration form schema with stronger validation and password confirmation
const registrationSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().default(false).refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function AuthForm() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetRequestSent, setResetRequestSent] = useState(false);
  
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
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  // Form for registration
  const registerForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });

  // Handle login submit
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      // Track login attempt
      trackEvent("login_attempt", "authentication", "form_login");
      
      const success = await login(data.email, data.password);
      
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
      
      // Password validation happens in the register function
      // We don't send confirmPassword to the API, it's only used for client-side validation
      const success = await registerUser({
        email: data.email,
        password: data.password
      });
      
      if (success) {
        // Track successful registration
        trackEvent("signup_success", "authentication", "form_signup");
      } else {
        // Track failed registration
        trackEvent("signup_failure", "authentication", "form_signup", 0);
        
        toast({
          title: "Registration failed",
          description: "This email address might already be in use or there was an issue with your password information.",
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

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle password reset request
  const handlePasswordReset = () => {
    if (!resetEmail || !resetEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Track password reset attempt
    trackEvent("password_reset_request", "authentication", "forgot_password");
    
    // Here we would normally call an API endpoint to send a reset email
    // For now, we'll simulate success
    setResetRequestSent(true);
    toast({
      title: "Reset link sent",
      description: "If an account exists with that email, a password reset link has been sent.",
    });
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
              {showForgotPassword ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#003087] to-[#33BFFF]">
                      Reset Password
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Enter your email to receive a reset link
                    </p>
                  </div>
                  
                  {!resetRequestSent ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="auth-input"
                        />
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <Button
                          type="button"
                          onClick={handlePasswordReset}
                          className="w-full bg-gradient-to-r from-[#003087] to-[#33BFFF] hover:opacity-90 transition-all h-11 shadow-md hover:shadow-lg"
                        >
                          Send Reset Link
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowForgotPassword(false)}
                          className="w-full mt-2 border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-md"
                        >
                          Back to Login
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      <div className="py-6">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          We've sent an email to <span className="font-semibold">{resetEmail}</span> with instructions to reset your password.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                          Please check your inbox and follow the provided link.
                        </p>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetRequestSent(false);
                        }}
                        className="shadow-sm hover:shadow-md"
                      >
                        Back to Login
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
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
                        name="email"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="your@email.com" 
                                className={`auth-input ${fieldState.isDirty && !fieldState.invalid ? 'border-green-500 ring-green-100' : ''}`}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            {fieldState.isDirty && !fieldState.invalid && (
                              <FormSuccess>Valid email format</FormSuccess>
                            )}
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
                            setShowForgotPassword(true);
                          }}
                          type="button"
                        >
                          Forgot password?
                        </Button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#003087] to-[#33BFFF] hover:opacity-90 transition-all h-11 mt-2 shadow-md hover:shadow-lg"
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
                </>
              )}
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
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            className={`auth-input ${fieldState.isDirty && !fieldState.invalid ? 'border-green-500 ring-green-100' : ''}`}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        {fieldState.isDirty && !fieldState.invalid && (
                          <FormSuccess>Valid email format</FormSuccess>
                        )}
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create a password" 
                              className={`auth-input pr-10 ${
                                field.value && field.value.length >= 8 && 
                                /[A-Z]/.test(field.value) && 
                                /[a-z]/.test(field.value) && 
                                /[0-9]/.test(field.value) ? 'border-green-500 ring-green-100' : ''
                              }`}
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
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirm your password" 
                              className={`auth-input pr-10 ${
                                field.value && 
                                registerForm.getValues().password === field.value && 
                                field.value.length > 0 ? 'border-green-500 ring-green-100' : ''
                              }`}
                              {...field} 
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                        <FormMessage />
                        {field.value && 
                         registerForm.getValues().password === field.value && 
                         field.value.length > 0 && (
                          <FormSuccess>Passwords match</FormSuccess>
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
                    className="w-full bg-gradient-to-r from-[#003087] to-[#33BFFF] hover:opacity-90 transition-all h-11 mt-2 shadow-md hover:shadow-lg"
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