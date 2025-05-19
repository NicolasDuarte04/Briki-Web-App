import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});

const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
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

// Type definitions
type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface UnifiedAuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
}

export default function UnifiedAuthForm({ mode, onSuccess }: UnifiedAuthFormProps) {
  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Auth context and toast
  const auth = useAuth();
  const { isLoading } = auth;
  const { toast } = useToast();

  // Form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const registerForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false
    }
  });

  // Get form values for validation
  const registerPassword = registerForm.watch("password");
  
  // Login submission handler
  const handleLoginSubmit = async (data: LoginFormValues) => {
    try {
      await auth.login(data.email, data.password);
      trackEvent("login_success", "authentication", "email");
      toast({
        title: "Login successful",
        description: "Welcome back to Briki!",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Login error:", error);
      trackEvent("login_error", "authentication", "email");
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Registration submission handler
  const handleRegisterSubmit = async (data: RegistrationFormValues) => {
    try {
      await auth.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName
      });
      
      trackEvent("registration_success", "authentication", "email");
      toast({
        title: "Registration successful",
        description: "Welcome to Briki! Your account has been created.",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      trackEvent("registration_error", "authentication", "email");
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

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
  
  // Component for rendering password requirements
  const PasswordRequirement = ({ fulfilled, text }: { fulfilled: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${fulfilled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      <span className={fulfilled ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  );

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    trackEvent("login_initiated", "authentication", "google");
    window.location.href = "/api/auth/google";
  };

  // Render login form
  if (mode === "login") {
    return (
      <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-800 dark:text-gray-200 font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            autoComplete="email"
            className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11"
            {...loginForm.register("email")}
          />
          {loginForm.formState.errors.email && (
            <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-gray-800 dark:text-gray-200 font-medium">Password</Label>
            <button
              type="button"
              onClick={() => {/* Handle forgot password */}}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 pr-10"
              {...loginForm.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          {loginForm.formState.errors.password && (
            <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={loginForm.watch("rememberMe")}
            onCheckedChange={(checked) => {
              loginForm.setValue("rememberMe", checked === true);
            }}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="briki-button w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 text-white font-medium shadow-md hover:shadow-lg shadow-blue-500/10"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin mr-2" size={18} />
          ) : null}
          Log In
        </Button>
        
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
          onClick={handleGoogleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-gray-800 dark:text-gray-200 font-medium">Continue with Google</span>
        </Button>
      </form>
    );
  }

  // Render signup form
  return (
    <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-800 dark:text-gray-200 font-medium">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11"
            {...registerForm.register("firstName")}
          />
          {registerForm.formState.errors.firstName && (
            <p className="text-sm text-red-500">{registerForm.formState.errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-800 dark:text-gray-200 font-medium">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11"
            {...registerForm.register("lastName")}
          />
          {registerForm.formState.errors.lastName && (
            <p className="text-sm text-red-500">{registerForm.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-gray-800 dark:text-gray-200 font-medium">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="your.email@example.com"
          autoComplete="email"
          className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11"
          {...registerForm.register("email")}
        />
        {registerForm.formState.errors.email && (
          <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-gray-800 dark:text-gray-200 font-medium">Password</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 pr-10"
            {...registerForm.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        
        {/* Password strength meter */}
        {registerPassword && (
          <div className="mt-3 space-y-2">
            <PasswordRequirement 
              fulfilled={passwordValidation.minLength} 
              text="At least 8 characters" 
            />
            <PasswordRequirement 
              fulfilled={passwordValidation.hasUppercase} 
              text="At least one uppercase letter" 
            />
            <PasswordRequirement 
              fulfilled={passwordValidation.hasLowercase} 
              text="At least one lowercase letter" 
            />
            <PasswordRequirement 
              fulfilled={passwordValidation.hasNumber} 
              text="At least one number" 
            />
          </div>
        )}
        
        {registerForm.formState.errors.password && (
          <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-800 dark:text-gray-200 font-medium">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 pr-10"
            {...registerForm.register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        {registerForm.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
        )}
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox
          id="acceptTerms"
          checked={registerForm.watch("acceptTerms")}
          onCheckedChange={(checked) => {
            registerForm.setValue("acceptTerms", checked === true);
          }}
          className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <div className="flex flex-col space-y-1">
          <div className="flex flex-wrap items-center">
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-none"
            >
              I accept the 
            </label>
            <a 
              href="/terms" 
              className="text-sm font-medium text-blue-600 hover:underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>
          </div>
          {registerForm.formState.errors.acceptTerms && (
            <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.acceptTerms.message}</p>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 text-white font-medium shadow-md hover:shadow-lg shadow-indigo-500/10"
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin mr-2" size={18} />
        ) : null}
        Create Account
      </Button>
      
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
        onClick={handleGoogleLogin}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="text-gray-800 dark:text-gray-200 font-medium">Continue with Google</span>
      </Button>
    </form>
  );
}