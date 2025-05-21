import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Building2, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/company")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </Button>
          
          <Card className="w-full backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl text-white">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-500/30 rounded-full">
                  <Building2 className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Partner Login</CardTitle>
              <CardDescription className="text-blue-200">
                Access the Briki Copilot platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-100">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@company.com"
                    {...register("email")}
                    className="bg-white/10 border-white/20 placeholder:text-blue-200/50 text-white focus:border-blue-400"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-300">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-blue-100">Password</Label>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-blue-300 hover:text-blue-100"
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
                      className="bg-white/10 border-white/20 placeholder:text-blue-200/50 text-white focus:border-blue-400 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-300">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rememberMe" 
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    {...register("rememberMe")}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm leading-none text-blue-100"
                  >
                    Remember me for 30 days
                  </label>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-none h-11"
                  >
                    {isSubmitting ? "Logging in..." : "Sign In"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-white/10 pt-6">
              <div className="text-sm text-center text-blue-200">
                Don't have a partner account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-300 hover:text-blue-100"
                  onClick={() => navigate("/company-register")}
                >
                  Register here
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}