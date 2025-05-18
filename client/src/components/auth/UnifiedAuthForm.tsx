import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Loader2, EyeIcon, EyeOffIcon, CheckCircle } from "lucide-react";

// Login form schema with email-only authentication
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false)
});

// Registration form schema with strong validation
const registrationSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    name: z.string().optional(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms and conditions"
    })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  });

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function UnifiedAuthForm() {
  // State management
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetRequestSent, setResetRequestSent] = useState(false);
  
  // Access authentication context and toast
  const auth = useAuth();
  const { isLoading } = auth;
  const { toast } = useToast();

  // Track tab changes for analytics
  useEffect(() => {
    trackEvent(
      `view_${activeTab}_form`, 
      "authentication", 
      `auth_${activeTab}_view`
    );
  }, [activeTab]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    mode: "onChange"
  });

  // Registration form
  const registerForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      acceptTerms: false
    },
    mode: "onChange"
  });

  // Forgot password form
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    },
    mode: "onChange"
  });

  // Handle login submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      trackEvent("login_attempt", "authentication", "form_login");
      
      const success = await auth.login(data.email, data.password);
      
      if (success) {
        trackEvent("login_success", "authentication", "form_login");
        // Toast is handled in the auth context
      } else {
        trackEvent("login_failure", "authentication", "form_login");
        
        loginForm.setError("root", {
          type: "manual",
          message: "Invalid email or password"
        });
      }
    } catch (error) {
      trackEvent("login_error", "authentication", "form_login");
      
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle registration submission
  const onRegisterSubmit = async (data: RegistrationFormValues) => {
    try {
      trackEvent("signup_attempt", "authentication", "form_signup");
      
      const success = await auth.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        name: data.name
      });
      
      if (success) {
        trackEvent("signup_success", "authentication", "form_signup");
        // Toast is handled in auth context
      } else {
        trackEvent("signup_failure", "authentication", "form_signup");
        
        toast({
          title: "Registration failed",
          description: "This email might already be in use or there was a server issue.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      trackEvent("signup_error", "authentication", "form_signup");
      
      // Try to extract more specific error message if available
      const errorMessage = error?.message || "Registration failed. Please try again.";
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Handle forgot password submission
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      trackEvent("password_reset_request", "authentication", "forgot_password");
      
      // This would call the password reset endpoint
      // For now we'll simulate success
      setResetRequestSent(true);
      
      toast({
        title: "Reset link sent",
        description: "If an account exists with that email, you will receive a password reset link.",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Could not send reset link. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Visibility toggle handlers
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Helper for password validation indicators
  const getPasswordValidation = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };
  };

  // Get validation state for login form
  const loginEmail = loginForm.watch("email");
  const loginPassword = loginForm.watch("password");
  const loginEmailState = loginForm.getFieldState("email");
  const loginPasswordState = loginForm.getFieldState("password");

  // Get validation state for registration form
  const registerEmail = registerForm.watch("email");
  const registerPassword = registerForm.watch("password");
  const registerConfirmPassword = registerForm.watch("confirmPassword");
  const registerEmailState = registerForm.getFieldState("email");
  const registerPasswordState = registerForm.getFieldState("password");
  const registerConfirmPasswordState = registerForm.getFieldState("confirmPassword");
  const passwordValidation = getPasswordValidation(registerPassword);

  // Content for the main authentication tabs
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md"
      >
        {showForgotPassword ? (
          // Forgot Password View
          <div className="p-6 sm:p-8">
            <button 
              onClick={() => setShowForgotPassword(false)}
              className="flex items-center text-sm font-medium text-blue-600 mb-6 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to login
            </button>
            
            {resetRequestSent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  We've sent a password reset link to:
                </p>
                <p className="font-medium text-gray-900 dark:text-white mb-4">
                  {forgotPasswordForm.getValues("email")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                    Reset your password
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>
                
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-5">
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Email address</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type="email"
                                className={`auth-input ${fieldState.isDirty && !fieldState.invalid ? 'border-green-500 pr-10' : ''}`}
                                placeholder="your@email.com"
                                {...field} 
                              />
                            </FormControl>
                            {fieldState.isDirty && !fieldState.invalid && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      disabled={!forgotPasswordForm.formState.isValid || forgotPasswordForm.formState.isSubmitting}
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium rounded-lg flex items-center justify-center"
                    >
                      {forgotPasswordForm.formState.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : null}
                      Send reset link
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        ) : (
          // Normal Auth Tabs (Login and Signup)
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
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Sign in to your account
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
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    {/* Root Error Message */}
                    {loginForm.formState.errors.root && (
                      <div className="px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                        {loginForm.formState.errors.root.message}
                      </div>
                    )}
                    
                    {/* Email Field */}
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className={`auth-input ${fieldState.isDirty && !fieldState.invalid ? 'border-green-500 pr-10' : ''}`}
                                {...field}
                              />
                            </FormControl>
                            {fieldState.isDirty && !fieldState.invalid && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
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
                              tabIndex={-1}
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
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={!loginForm.formState.isValid || loginForm.formState.isSubmitting}
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium rounded-lg flex items-center justify-center"
                    >
                      {loginForm.formState.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : null}
                      Sign in
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="p-6 sm:p-8">
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                    Create an Account
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Join Briki to get started
                  </p>
                </div>

                <GoogleLoginButton mode="signup" />

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
                    or continue with
                  </span>
                </div>

                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                    {/* Email Field */}
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className={`auth-input ${fieldState.isDirty && !fieldState.invalid ? 'border-green-500 pr-10' : ''}`}
                                {...field}
                              />
                            </FormControl>
                            {fieldState.isDirty && !fieldState.invalid && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Name Field (Optional) */}
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">
                            Full Name <span className="text-gray-400">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              className="auth-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
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
                                placeholder="••••••••"
                                className={`auth-input pr-10 ${fieldState.isDirty && field.value && passwordValidation.length && 
                                  passwordValidation.uppercase && 
                                  passwordValidation.lowercase && 
                                  passwordValidation.number ? 'border-green-500' : ''}`}
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              onClick={togglePasswordVisibility}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                          </div>
                          <FormMessage />
                          
                          {/* Password strength indicators */}
                          {field.value && (
                            <div className="mt-2 space-y-1 text-sm">
                              <div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1.5 ${passwordValidation.length ? 'opacity-100' : 'opacity-40'}`} />
                                <span>At least 8 characters</span>
                              </div>
                              <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1.5 ${passwordValidation.uppercase ? 'opacity-100' : 'opacity-40'}`} />
                                <span>At least one uppercase letter</span>
                              </div>
                              <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1.5 ${passwordValidation.lowercase ? 'opacity-100' : 'opacity-40'}`} />
                                <span>At least one lowercase letter</span>
                              </div>
                              <div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1.5 ${passwordValidation.number ? 'opacity-100' : 'opacity-40'}`} />
                                <span>At least one number</span>
                              </div>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
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
                                placeholder="••••••••"
                                className={`auth-input pr-10 ${
                                  fieldState.isDirty && 
                                  field.value && 
                                  field.value === registerPassword ? 'border-green-500' : ''
                                }`}
                                {...field}
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              onClick={toggleConfirmPasswordVisibility}
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Terms and Conditions */}
                    <FormField
                      control={registerForm.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                            />
                          </FormControl>
                          <div className="grid gap-1.5 leading-none">
                            <FormLabel className="text-sm text-gray-600 dark:text-gray-400 font-normal cursor-pointer">
                              I agree to the{" "}
                              <a href="/terms" className="text-blue-600 hover:text-blue-800 transition-colors underline">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors underline">
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
                      disabled={!registerForm.formState.isValid || registerForm.formState.isSubmitting}
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium rounded-lg flex items-center justify-center mt-2"
                    >
                      {registerForm.formState.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : null}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </div>
  );
}