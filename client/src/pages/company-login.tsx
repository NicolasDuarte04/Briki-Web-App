import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { ArrowLeft, Building2, Eye, EyeOff, Shield, Zap, Lock } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function CompanyLogin() {
  const [, navigate] = useLocation();
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Call login with company role
      await loginMutation.mutateAsync({
        username: data.email,
        password: data.password,
        role: 'company'
      });
      
      // Show success message
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to your dashboard...",
        variant: "default",
      });
      
      // Navigation is handled by the auth hook automatically
      console.log("Login successful, redirecting to dashboard...");
      
      // Direct navigation to company dashboard
      navigate("/company-dashboard");
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_40%)]"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <div className="absolute top-10 left-10 w-1 h-20 bg-indigo-500/20"></div>
          <div className="absolute top-40 left-20 w-1 h-40 bg-indigo-500/20"></div>
          <div className="absolute top-10 left-30 w-1 h-30 bg-indigo-500/20"></div>
          <div className="absolute top-20 right-40 w-1 h-20 bg-indigo-500/20"></div>
          <div className="absolute top-50 right-20 w-1 h-40 bg-indigo-500/20"></div>
          <div className="absolute top-30 right-10 w-1 h-30 bg-indigo-500/20"></div>
        </motion.div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22rgba%2899%2C102%2C241%2C0.05%29%22%20stroke-width%3D%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%20/%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-indigo-200/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
            onClick={() => navigate("/company")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </Button>
          
          <Card className="w-full bg-slate-900/60 backdrop-blur-md border border-indigo-900/30 shadow-2xl">
            <CardHeader className="space-y-1 text-center relative">
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-4 bg-indigo-900/50 rounded-full border border-indigo-700/50 shadow-lg shadow-indigo-500/20 backdrop-blur-sm relative overflow-hidden">
                  <Lock className="h-8 w-8 text-indigo-400" />
                  <motion.div 
                    className="absolute inset-0 bg-indigo-600/20 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.2, 0.5],
                    }} 
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 text-transparent bg-clip-text">
                Partner Portal
              </CardTitle>
              <CardDescription className="text-indigo-200/80">
                Access your Briki Copilot dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-indigo-100">Company Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@company.com"
                      {...register("email")}
                      className="bg-slate-800/50 border-indigo-700/30 placeholder:text-indigo-300/30 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
                    />
                    <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400/40" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-indigo-100">Password</Label>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-indigo-300 hover:text-indigo-200"
                      onClick={() => {}}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className="bg-slate-800/50 border-indigo-700/30 placeholder:text-indigo-300/30 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 pr-10 transition-all"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400/60 hover:text-indigo-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rememberMe" 
                    className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 border-indigo-700/30"
                    {...register("rememberMe")}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm leading-none text-indigo-200/80 cursor-pointer"
                  >
                    Keep me logged in for 30 days
                  </label>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/30 border border-indigo-500/30 h-11 font-medium transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <motion.div className="flex items-center">
                        <motion.div
                          className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Authenticating...
                      </motion.div>
                    ) : (
                      <span className="flex items-center">
                        Sign In to Portal
                        <Zap className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Security badge */}
                <div className="flex items-center justify-center text-xs text-indigo-300/60 mt-4">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Enterprise-grade security with 256-bit encryption</span>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-indigo-800/30 pt-6">
              <div className="text-sm text-center text-indigo-200/80">
                New to Briki Partner Network?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-indigo-300 hover:text-indigo-100 font-medium"
                  onClick={() => navigate("/company-register")}
                >
                  Apply for partnership
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Additional info */}
          <motion.div 
            className="mt-8 text-center text-indigo-300/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Trusted by 500+ insurance companies worldwide</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}