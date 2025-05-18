import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, CheckCircle, Mail, Lock, User } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false)
});

// Registration schema with strong password requirements
const registrationSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

// Define form value types
type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const UnifiedAuthScreen = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetRequestSent, setResetRequestSent] = useState(false);
  
  const { toast } = useToast();
  const auth = useAuth();
  
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
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
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Handle login submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      trackEvent("login_attempt", "authentication", "form_login");
      
      const success = await auth.login(data.email, data.password);
      
      if (success) {
        trackEvent("login_success", "authentication", "form_login");
        // Toast is handled in auth context
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
        firstName: data.firstName,
        lastName: data.lastName
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
  
  // Get validation state for login form
  const loginEmail = loginForm.watch("email");
  const loginEmailState = loginForm.getFieldState("email");
  
  // Get validation state for registration form
  const registerEmail = registerForm.watch("email");
  const registerPassword = registerForm.watch("password");
  const registerConfirmPassword = registerForm.watch("confirmPassword");
  const registerEmailState = registerForm.getFieldState("email");
  const registerPasswordState = registerForm.getFieldState("password");
  const registerConfirmPasswordState = registerForm.getFieldState("confirmPassword");
  
  // Password validation helper
  const getPasswordValidation = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
  };
  
  const passwordValidation = getPasswordValidation(registerPassword);
  
  // Function to navigate between tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setForgotPasswordMode(false);
    setResetRequestSent(false);
    
    // Clear form errors when switching tabs
    if (value === "login") {
      registerForm.clearErrors();
    } else {
      loginForm.clearErrors();
    }
    
    // Track tab change
    trackEvent("auth_tab_change", "authentication", value);
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          {!forgotPasswordMode ? (
            <>
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login" className="rounded-l-md">Log In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-r-md">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Sign in to your account
                  </p>
                </div>
                
                {/* Google Login Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                  onClick={() => window.location.href = "/api/auth/google"}
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.205C17.64 8.566 17.583 7.953 17.476 7.364H9V10.845H13.844C13.635 11.97 13.001 12.923 12.048 13.561V15.82H14.956C16.66 14.253 17.64 11.945 17.64 9.205Z" fill="#4285F4"/>
                    <path d="M9 18C11.43 18 13.467 17.194 14.956 15.82L12.048 13.561C11.242 14.101 10.211 14.42 9 14.42C6.656 14.42 4.672 12.837 3.964 10.71H0.957V13.042C2.438 15.983 5.482 18 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71C3.784 10.17 3.682 9.593 3.682 9C3.682 8.407 3.784 7.83 3.964 7.29V4.958H0.957C0.348 6.173 0 7.548 0 9C0 10.452 0.348 11.827 0.957 13.042L3.964 10.71Z" fill="#FBBC05"/>
                    <path d="M9 3.58C10.321 3.58 11.508 4.034 12.44 4.925L15.022 2.344C13.463 0.891 11.426 0 9 0C5.482 0 2.438 2.017 0.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </Button>
                
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
                                className={`pl-10 ${fieldState.isDirty && !fieldState.invalid ? 'border-green-500 pr-10' : ''}`}
                                {...field}
                              />
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                                className="pl-10 pr-10"
                                {...field}
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={togglePasswordVisibility}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setForgotPasswordMode(true);
                          trackEvent("view_forgot_password", "authentication", "forgot_password");
                        }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors h-11"
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </div>
                      ) : (
                        "Log In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                    Create an Account
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Join Briki for personalized insurance options
                  </p>
                </div>
                
                {/* Google Signup Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                  onClick={() => window.location.href = "/api/auth/google"}
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.205C17.64 8.566 17.583 7.953 17.476 7.364H9V10.845H13.844C13.635 11.97 13.001 12.923 12.048 13.561V15.82H14.956C16.66 14.253 17.64 11.945 17.64 9.205Z" fill="#4285F4"/>
                    <path d="M9 18C11.43 18 13.467 17.194 14.956 15.82L12.048 13.561C11.242 14.101 10.211 14.42 9 14.42C6.656 14.42 4.672 12.837 3.964 10.71H0.957V13.042C2.438 15.983 5.482 18 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71C3.784 10.17 3.682 9.593 3.682 9C3.682 8.407 3.784 7.83 3.964 7.29V4.958H0.957C0.348 6.173 0 7.548 0 9C0 10.452 0.348 11.827 0.957 13.042L3.964 10.71Z" fill="#FBBC05"/>
                    <path d="M9 3.58C10.321 3.58 11.508 4.034 12.44 4.925L15.022 2.344C13.463 0.891 11.426 0 9 0C5.482 0 2.438 2.017 0.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </Button>
                
                <div className="relative my-6">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">
                    or sign up with
                  </span>
                </div>
                
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                    {/* First Name Field */}
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">First Name</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="First Name"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Last Name Field */}
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Last Name</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Last Name"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
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
                                className={`pl-10 ${fieldState.isDirty && !fieldState.invalid ? 'border-green-500 pr-10' : ''}`}
                                {...field}
                              />
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                                className={`pl-10 pr-10 ${
                                  fieldState.isDirty && 
                                  passwordValidation.minLength && 
                                  passwordValidation.hasUppercase && 
                                  passwordValidation.hasLowercase && 
                                  passwordValidation.hasNumber ? 'border-green-500' : ''
                                }`}
                                {...field}
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={togglePasswordVisibility}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <FormMessage />
                          
                          {/* Password validation indicators */}
                          {field.value && (
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                              <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`} />
                                <span>At least 8 characters</span>
                              </div>
                              <div className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-400'}`} />
                                <span>One uppercase letter</span>
                              </div>
                              <div className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-400'}`} />
                                <span>One lowercase letter</span>
                              </div>
                              <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                <CheckCircle className={`h-3.5 w-3.5 mr-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`} />
                                <span>One number</span>
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
                                className={`pl-10 pr-10 ${
                                  fieldState.isDirty && 
                                  field.value && 
                                  field.value === registerPassword ? 'border-green-500' : ''
                                }`}
                                {...field}
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={toggleConfirmPasswordVisibility}
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors h-11"
                      disabled={registerForm.formState.isSubmitting}
                    >
                      {registerForm.formState.isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </>
          ) : (
            // Forgot Password View
            <div className="space-y-6">
              <button
                onClick={() => {
                  setForgotPasswordMode(false);
                  setResetRequestSent(false);
                }}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to login
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                  Reset Your Password
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Enter your email to receive a reset link
                </p>
              </div>
              
              {resetRequestSent ? (
                <div className="text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We've sent a password reset link to your email. The link will expire in 24 hours.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="mx-auto"
                    onClick={() => {
                      setForgotPasswordMode(false);
                      setResetRequestSent(false);
                    }}
                  >
                    Return to login
                  </Button>
                </div>
              ) : (
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-5">
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="pl-10"
                                {...field}
                              />
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors h-11"
                      disabled={forgotPasswordForm.formState.isSubmitting}
                    >
                      {forgotPasswordForm.formState.isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedAuthScreen;