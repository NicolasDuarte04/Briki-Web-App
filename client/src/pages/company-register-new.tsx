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
import { Building2, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema with enhanced password validation
const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  country: z.string().min(1, "Please select a country"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type FormValues = z.infer<typeof formSchema>;

export default function CompanyRegisterNew() {
  const [, navigate] = useLocation();
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      agreeToTerms: false
    },
  });

  const watchAgreeToTerms = watch("agreeToTerms");
  const watchPassword = watch("password");

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "No password" };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character checks
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    // Determine label
    let label = "Weak";
    if (strength >= 75) label = "Strong";
    else if (strength >= 50) label = "Medium";
    
    return { strength, label };
  };

  const { strength, label } = getPasswordStrength(watchPassword || "");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Add company role flag to registration
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        name: data.companyName,
        role: 'company',
        firstName: data.companyName.split(' ')[0],
        lastName: data.companyName.split(' ').slice(1).join(' '),
        companyProfile: {
          name: data.companyName,
          country: data.country
        }
      });
      
      // Show success message
      toast({
        title: "Registration Successful",
        description: "Welcome to Briki Copilot! We're redirecting you to your dashboard...",
        variant: "default",
      });
      
      // Log successful registration
      console.log("Registration successful, redirecting to redesigned dashboard...");
      
      // Navigate directly to the dashboard
      navigate("/company-dashboard-redesigned");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
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
              <CardTitle className="text-2xl font-bold text-white">Partner Registration</CardTitle>
              <CardDescription className="text-blue-200">
                Join the Briki Copilot platform to showcase your insurance plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-blue-100">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company Ltd."
                    {...register("companyName")}
                    className="bg-white/10 border-white/20 placeholder:text-blue-200/50 text-white focus:border-blue-400"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-300">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-100">Company Email</Label>
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
                  <Label htmlFor="country" className="text-blue-100">Country</Label>
                  <Select 
                    onValueChange={(value) => setValue("country", value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-900 border-white/20 text-white">
                      <SelectItem value="Colombia" className="focus:bg-indigo-800 focus:text-white">Colombia</SelectItem>
                      <SelectItem value="Mexico" className="focus:bg-indigo-800 focus:text-white">Mexico</SelectItem>
                      <SelectItem value="Brazil" className="focus:bg-indigo-800 focus:text-white">Brazil</SelectItem>
                      <SelectItem value="Argentina" className="focus:bg-indigo-800 focus:text-white">Argentina</SelectItem>
                      <SelectItem value="Chile" className="focus:bg-indigo-800 focus:text-white">Chile</SelectItem>
                      <SelectItem value="Peru" className="focus:bg-indigo-800 focus:text-white">Peru</SelectItem>
                      <SelectItem value="Other" className="focus:bg-indigo-800 focus:text-white">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-300">{errors.country.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-100">Password</Label>
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
                  
                  {/* Password strength meter */}
                  {watchPassword && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-blue-200">Password strength: {label}</span>
                        <span className="text-xs text-blue-200">{strength}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            strength >= 75 ? 'bg-green-500' : 
                            strength >= 50 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-blue-200 mt-2">
                    <p>Password requirements:</p>
                    <ul className="mt-1 space-y-1">
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1.5 ${watchPassword?.length >= 8 ? 'text-green-400' : 'text-blue-400/50'}`} 
                        />
                        <span className={watchPassword?.length >= 8 ? 'text-green-400' : ''}>
                          At least 8 characters
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1.5 ${/[A-Z]/.test(watchPassword || '') ? 'text-green-400' : 'text-blue-400/50'}`} 
                        />
                        <span className={/[A-Z]/.test(watchPassword || '') ? 'text-green-400' : ''}>
                          One uppercase letter
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1.5 ${/[a-z]/.test(watchPassword || '') ? 'text-green-400' : 'text-blue-400/50'}`} 
                        />
                        <span className={/[a-z]/.test(watchPassword || '') ? 'text-green-400' : ''}>
                          One lowercase letter
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1.5 ${/[0-9]/.test(watchPassword || '') ? 'text-green-400' : 'text-blue-400/50'}`} 
                        />
                        <span className={/[0-9]/.test(watchPassword || '') ? 'text-green-400' : ''}>
                          One number
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-100">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className="bg-white/10 border-white/20 placeholder:text-blue-200/50 text-white focus:border-blue-400 pr-10"
                    />
                    <button
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="agreeToTerms" 
                    checked={watchAgreeToTerms}
                    onCheckedChange={(checked) => {
                      setValue("agreeToTerms", checked === true);
                    }}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm leading-none text-blue-100"
                  >
                    I agree to the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-300 hover:text-blue-100"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/terms");
                      }}
                    >
                      terms and conditions
                    </Button>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-300">{errors.agreeToTerms.message}</p>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-none mt-4 h-11"
                  >
                    {isSubmitting ? "Creating account..." : "Create Partner Account"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-white/10 pt-6">
              <div className="text-sm text-center text-blue-200">
                Already have a partner account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-300 hover:text-blue-100"
                  onClick={() => navigate("/company-login-new")}
                >
                  Log in here
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}