import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
import { ArrowLeft, Building2, ChevronsUpDown, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Registration form schema with strong password requirements
const registerSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Industry is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Industry options for selection
const industries = [
  { label: "Insurance", value: "insurance" },
  { label: "Banking", value: "banking" },
  { label: "Financial Services", value: "financial-services" },
  { label: "Technology", value: "technology" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Travel", value: "travel" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Retail", value: "retail" },
  { label: "Transportation", value: "transportation" },
  { label: "Energy", value: "energy" },
];

export default function CompanyRegister() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { registerMutation } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const selectedIndustry = watch("industry");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Call registration API with company profile data
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: 'company',
        companyProfile: {
          name: data.companyName,
          industry: data.industry
        }
      });
      
      // Show success message
      toast({
        title: "Registration Successful",
        description: "Your company account has been created. Redirecting to dashboard...",
        variant: "default",
      });
      
      // Navigate to the company dashboard
      navigate("/company-dashboard");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Could not create your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for password strength indicators
  const getPasswordStrengthColor = () => {
    const password = watch("password");
    if (!password) return "bg-gray-300";
    if (password.length < 8) return "bg-red-500";
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) 
      return "bg-yellow-500";
    return "bg-green-500";
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
                Create your Briki Copilot account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-blue-100">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your company name"
                    {...register("companyName")}
                    className="bg-white/10 border-white/20 placeholder:text-blue-200/50 text-white focus:border-blue-400"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-300">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-blue-100">Industry</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                      >
                        {selectedIndustry
                          ? industries.find((industry) => industry.value === selectedIndustry)?.label
                          : "Select industry..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-slate-900 border-slate-700">
                      <Command className="bg-transparent">
                        <CommandInput placeholder="Search industry..." className="text-white" />
                        <CommandEmpty className="text-gray-400">No industry found.</CommandEmpty>
                        <CommandGroup>
                          {industries.map((industry) => (
                            <CommandItem
                              key={industry.value}
                              value={industry.value}
                              onSelect={(currentValue) => {
                                setValue("industry", currentValue);
                                setOpen(false);
                              }}
                              className={cn(
                                "text-white hover:bg-white/10",
                                selectedIndustry === industry.value && "bg-white/20"
                              )}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedIndustry === industry.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {industry.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <input
                    type="hidden"
                    {...register("industry")}
                  />
                  {errors.industry && (
                    <p className="text-sm text-red-300">{errors.industry.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-100">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register("email")}
                    className="bg-white/10 border-white/20 placeholder:text-blue-200/50 text-white focus:border-blue-400"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-300">{errors.email.message}</p>
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
                  
                  {/* Password strength indicator */}
                  {watch("password") && (
                    <div className="space-y-1 mt-2">
                      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`} 
                          style={{ width: `${Math.min(100, (watch("password").length / 12) * 100)}%` }} />
                      </div>
                      <ul className="text-xs text-blue-200 space-y-1">
                        <li className={watch("password").length >= 8 ? "text-green-300" : "text-red-300"}>
                          • At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(watch("password")) ? "text-green-300" : "text-red-300"}>
                          • At least one uppercase letter
                        </li>
                        <li className={/[a-z]/.test(watch("password")) ? "text-green-300" : "text-red-300"}>
                          • At least one lowercase letter
                        </li>
                        <li className={/[0-9]/.test(watch("password")) ? "text-green-300" : "text-red-300"}>
                          • At least one number
                        </li>
                      </ul>
                    </div>
                  )}
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
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeTerms" 
                    className="mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    {...register("agreeTerms")}
                  />
                  <div>
                    <label
                      htmlFor="agreeTerms"
                      className="text-sm leading-tight text-blue-100"
                    >
                      I agree to the{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-300 hover:text-blue-100"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("/terms", "_blank");
                        }}
                      >
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-300 hover:text-blue-100"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("/privacy", "_blank");
                        }}
                      >
                        Privacy Policy
                      </Button>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-sm text-red-300">{errors.agreeTerms.message}</p>
                    )}
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-none h-11"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Partner Account"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-white/10 pt-6">
              <div className="text-sm text-center text-blue-200">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-300 hover:text-blue-100"
                  onClick={() => navigate("/company-login")}
                >
                  Sign in here
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}