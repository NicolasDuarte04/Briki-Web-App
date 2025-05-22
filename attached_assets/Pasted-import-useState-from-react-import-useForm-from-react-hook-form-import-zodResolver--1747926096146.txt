import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import CompanyLayout from "@/components/layout/company-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploader } from "@/components/ui/file-uploader";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock,
  Users,
  FileText,
  Building2,
  Mail,
  Phone,
  Globe,
  Upload,
  Shield,
  BadgeCheck
} from "lucide-react";

// Form schema
const pilotRequestSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().optional(),
  
  insuranceTypes: z.object({
    travel: z.boolean().optional(),
    auto: z.boolean().optional(),
    health: z.boolean().optional(),
    pet: z.boolean().optional()
  }),
  
  estimatedPlans: z.string().min(1, "Please select an option"),
  estimatedVolume: z.string().min(1, "Please select an option"),
  
  message: z.string().min(10, "Message is too short").max(1000, "Message is too long"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type PilotRequestFormValues = z.infer<typeof pilotRequestSchema>;

export default function CompanyRequestPilotPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PilotRequestFormValues>({
    resolver: zodResolver(pilotRequestSchema),
    defaultValues: {
      companyName: "",
      country: "",
      website: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      
      insuranceTypes: {
        travel: false,
        auto: false,
        health: false,
        pet: false
      },
      
      estimatedPlans: "",
      estimatedVolume: "",
      
      message: "",
      acceptTerms: false
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: PilotRequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Request Submitted Successfully",
        description: "Your pilot program request has been submitted. Our team at contact@briki.app will contact you shortly.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <CompanyLayout>
        <motion.div 
          className="max-w-2xl mx-auto py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto bg-[#002C7A]/50 rounded-full flex items-center justify-center mb-4 ring-4 ring-[#0074FF]/20">
                <CheckCircle2 className="h-8 w-8 text-[#33BFFF]" />
              </div>
              <CardTitle className="text-2xl text-white">Pilot Request Submitted</CardTitle>
              <CardDescription className="text-gray-300 text-base mt-2">
                Thank you for your interest in partnering with Briki!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#002050]/80 rounded-lg p-4 text-white border border-[#002C7A]">
                <h3 className="font-medium mb-2 text-[#33BFFF]">What happens next?</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#003087] text-[#33BFFF] flex items-center justify-center mr-2 text-xs font-medium border border-[#0074FF]/30">1</span>
                    <span className="text-gray-300">Our partnership team will review your request within 1-2 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#003087] text-[#33BFFF] flex items-center justify-center mr-2 text-xs font-medium border border-[#0074FF]/30">2</span>
                    <span className="text-gray-300">You'll receive an email with our decision and next steps</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#003087] text-[#33BFFF] flex items-center justify-center mr-2 text-xs font-medium border border-[#0074FF]/30">3</span>
                    <span className="text-gray-300">If approved, we'll schedule an onboarding call to set up your insurance plans</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#003087] text-[#33BFFF] flex items-center justify-center mr-2 text-xs font-medium border border-[#0074FF]/30">4</span>
                    <span className="text-gray-300">Your plans will go live on Briki within 5-7 business days</span>
                  </li>
                </ol>
              </div>
              
              <div className="border border-[#002C7A] rounded-lg p-4 bg-[#001E47]/50">
                <h3 className="font-medium mb-3 text-white">Your Pilot Request Details</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Company Name</p>
                    <p className="font-medium text-white">Your Insurance Company</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Contact Email</p>
                    <p className="font-medium text-white">contact@yourcompany.com</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Insurance Types</p>
                    <p className="font-medium text-white">Travel, Auto</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Request ID</p>
                    <p className="font-medium text-white">REQ-2023051301</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-between gap-3 border-t border-[#002C7A] pt-6">
              <Button 
                variant="outline"
                onClick={() => {
                  window.open('mailto:contact@briki.app', '_blank');
                }}
                className="border-[#002C7A] text-gray-300 hover:text-white hover:bg-[#002C7A]/50 hover:border-[#0074FF]/50"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support Team
              </Button>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                }}
                className="bg-[#0074FF] hover:bg-[#0055CC] text-white"
              >
                Return to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <Badge className="bg-gradient-to-r from-[#003087] to-[#0074FF] text-white border-none py-1 px-3 shadow-[0_0_10px_rgba(51,191,255,0.2)]">
                <Rocket className="h-3.5 w-3.5 mr-1" />
                Partner Program
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-white">Request a Pilot Program</h1>
            <p className="text-gray-400">Submit your request to join the Briki Partner Network</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
              <CardHeader>
                <CardTitle className="text-white">Partner Pilot Application</CardTitle>
                <CardDescription className="text-gray-400">
                  Please provide details about your company and insurance offerings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  id="pilot-request-form" 
                  onSubmit={handleSubmit(onSubmit)} 
                  className="space-y-8"
                >
                  {/* Company Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#33BFFF] font-medium">
                      <Building2 className="h-5 w-5" />
                      <h2 className="text-lg">Company Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                        <Input 
                          id="companyName" 
                          {...register("companyName")} 
                          className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                        />
                        {errors.companyName && (
                          <p className="text-sm text-red-400">{errors.companyName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-gray-300">Country</Label>
                        <Input 
                          id="country" 
                          {...register("country")}
                          className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                        />
                        {errors.country && (
                          <p className="text-sm text-red-400">{errors.country.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-gray-300">Company Website (optional)</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0074FF]" />
                        <Input 
                          id="website" 
                          {...register("website")} 
                          placeholder="https://"
                          className="bg-[#001E47] border-[#002C7A] text-white pl-10 placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                        />
                      </div>
                      {errors.website && (
                        <p className="text-sm text-red-400">{errors.website.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">Company Logo (optional)</Label>
                      <div className="bg-[#001E47]/80 border border-dashed border-[#002C7A] rounded-md p-6">
                        <Button
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="bg-[#002050] border-[#002C7A] text-white hover:bg-[#002C7A]/70 hover:border-[#0074FF]/50"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {logoFile ? "Replace Logo" : "Upload Logo"}
                        </Button>
                        <FileUploader
                          accept=".png,.jpg,.jpeg,.svg"
                          maxSize={5}
                          onFileSelected={(file) => setLogoFile(file)}
                          className="hidden"
                        />
                        {logoFile && (
                          <div className="mt-3 flex items-center text-sm text-[#33BFFF]">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            <span className="mr-1">Uploaded:</span>
                            <span className="font-medium">{logoFile.name}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-3">
                          Upload your company logo to be displayed on Briki. PNG, JPG, or SVG formats (max 5MB).
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-[#002C7A]" />
                  
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#33BFFF] font-medium">
                      <Users className="h-5 w-5" />
                      <h2 className="text-lg">Contact Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactName" className="text-gray-300">Contact Name</Label>
                        <Input 
                          id="contactName" 
                          {...register("contactName")} 
                          className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                        />
                        {errors.contactName && (
                          <p className="text-sm text-red-400">{errors.contactName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-gray-300">Contact Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0074FF]" />
                          <Input 
                            id="contactEmail" 
                            type="email"
                            {...register("contactEmail")} 
                            className="bg-[#001E47] border-[#002C7A] text-white pl-10 placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                          />
                        </div>
                        {errors.contactEmail && (
                          <p className="text-sm text-red-400">{errors.contactEmail.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="text-gray-300">Contact Phone (optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0074FF]" />
                        <Input 
                          id="contactPhone" 
                          {...register("contactPhone")} 
                          className="bg-[#001E47] border-[#002C7A] text-white pl-10 placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20"
                        />
                      </div>
                      {errors.contactPhone && (
                        <p className="text-sm text-red-400">{errors.contactPhone.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="bg-[#002C7A]" />
                  
                  {/* Insurance Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#33BFFF] font-medium">
                      <Shield className="h-5 w-5" />
                      <h2 className="text-lg">Insurance Information</h2>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">Insurance Types (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="travel" 
                            onCheckedChange={(checked) => {
                              setValue("insuranceTypes.travel", checked === true);
                            }}
                            className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                          />
                          <label
                            htmlFor="travel"
                            className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Travel Insurance
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="auto" 
                            onCheckedChange={(checked) => {
                              setValue("insuranceTypes.auto", checked === true);
                            }}
                            className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                          />
                          <label
                            htmlFor="auto"
                            className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Auto Insurance
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="health" 
                            onCheckedChange={(checked) => {
                              setValue("insuranceTypes.health", checked === true);
                            }}
                            className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                          />
                          <label
                            htmlFor="health"
                            className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Health Insurance
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="pet" 
                            onCheckedChange={(checked) => {
                              setValue("insuranceTypes.pet", checked === true);
                            }}
                            className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                          />
                          <label
                            htmlFor="pet"
                            className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Pet Insurance
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="estimatedPlans" className="text-gray-300">Number of Plans</Label>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="plans-1-5" 
                              checked={watch("estimatedPlans") === "1-5"}
                              onCheckedChange={(checked) => {
                                if (checked) setValue("estimatedPlans", "1-5");
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor="plans-1-5"
                              className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              1-5 plans
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="plans-6-10" 
                              checked={watch("estimatedPlans") === "6-10"}
                              onCheckedChange={(checked) => {
                                if (checked) setValue("estimatedPlans", "6-10");
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor="plans-6-10"
                              className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              6-10 plans
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="plans-10+" 
                              checked={watch("estimatedPlans") === "10+"}
                              onCheckedChange={(checked) => {
                                if (checked) setValue("estimatedPlans", "10+");
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor="plans-10+"
                              className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              10+ plans
                            </label>
                          </div>
                        </div>
                        {errors.estimatedPlans && (
                          <p className="text-sm text-red-400">{errors.estimatedPlans.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estimatedVolume" className="text-gray-300">Monthly Transaction Volume</Label>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="volume-low" 
                              checked={watch("estimatedVolume") === "low"}
                              onCheckedChange={(checked) => {
                                if (checked) setValue("estimatedVolume", "low");
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor="volume-low"
                              className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              &lt;100 transactions/month
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="volume-medium" 
                              checked={watch("estimatedVolume") === "medium"}
                              onCheckedChange={(checked) => {
                                if (checked) setValue("estimatedVolume", "medium");
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor="volume-medium"
                              className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              100-500 transactions/month
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="volume-high" 
                              checked={watch("estimatedVolume") === "high"}
                              onCheckedChange={(checked) => {
                                if (checked) setValue("estimatedVolume", "high");
                              }}
                              className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor="volume-high"
                              className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              500+ transactions/month
                            </label>
                          </div>
                        </div>
                        {errors.estimatedVolume && (
                          <p className="text-sm text-red-400">{errors.estimatedVolume.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">Additional Information</Label>
                      <Textarea 
                        id="message" 
                        {...register("message")} 
                        placeholder="Tell us more about your company and why you'd like to join the Briki Partner Network..."
                        className="bg-[#001E47] border-[#002C7A] text-white placeholder:text-gray-500 focus:border-[#0074FF] focus:ring-[#0074FF]/20 min-h-[120px]"
                      />
                      {errors.message && (
                        <p className="text-sm text-red-400">{errors.message.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="acceptTerms" 
                        {...register("acceptTerms")}
                        className="border-[#0074FF] data-[state=checked]:bg-[#0074FF] data-[state=checked]:text-white"
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I accept the{" "}
                        <a href="#" className="text-[#33BFFF] hover:underline">
                          terms and conditions
                        </a>
                        {" "}and{" "}
                        <a href="#" className="text-[#33BFFF] hover:underline">
                          privacy policy
                        </a>
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-400 mt-1">{errors.acceptTerms.message}</p>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t border-[#002C7A] pt-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center">
                  <div className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-[#33BFFF] mr-2" />
                    <p className="text-sm text-gray-300">All information is securely encrypted</p>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  form="pilot-request-form" 
                  disabled={isSubmitting}
                  className="bg-[#0074FF] hover:bg-[#0055CC] text-white w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Submit Request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </CompanyLayout>
  );
}