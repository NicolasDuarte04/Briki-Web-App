import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock,
  Users,
  FileText,
  Building2
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
        description: "Your pilot program request has been submitted. Our team will contact you shortly.",
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
        <div className="max-w-2xl mx-auto py-8">
          <Card className="bg-white border-blue-100 shadow-md">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Pilot Request Submitted</CardTitle>
              <CardDescription className="text-gray-600 text-base mt-2">
                Thank you for your interest in partnering with Briki!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center mr-2 text-xs font-medium">1</span>
                    <span>Our partnership team will review your request within 1-2 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center mr-2 text-xs font-medium">2</span>
                    <span>You'll receive an email with our decision and next steps</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center mr-2 text-xs font-medium">3</span>
                    <span>If approved, we'll schedule an onboarding call to set up your insurance plans</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center mr-2 text-xs font-medium">4</span>
                    <span>Your plans will go live on Briki within 5-7 business days</span>
                  </li>
                </ol>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Your Pilot Request Details</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Company Name</p>
                    <p className="font-medium">Your Insurance Company</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact Email</p>
                    <p className="font-medium">contact@yourcompany.com</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Insurance Types</p>
                    <p className="font-medium">Travel, Auto</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Request ID</p>
                    <p className="font-medium">REQ-2023051301</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-between gap-3">
              <Button 
                variant="outline"
                onClick={() => {
                  window.open('mailto:partnerships@briki.com', '_blank');
                }}
              >
                Contact Support Team
              </Button>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                }}
              >
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request a Pilot Program</h1>
            <p className="text-gray-600">Submit your request to join the Briki Partner Network</p>
          </div>
          
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle>Partner Pilot Application</CardTitle>
              <CardDescription>
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
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <Building2 className="h-5 w-5" />
                    <h2 className="text-lg">Company Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        {...register("companyName")} 
                        className="bg-white"
                      />
                      {errors.companyName && (
                        <p className="text-sm text-red-500">{errors.companyName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        {...register("country")} 
                        className="bg-white"
                      />
                      {errors.country && (
                        <p className="text-sm text-red-500">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website (optional)</Label>
                    <Input 
                      id="website" 
                      {...register("website")} 
                      placeholder="https://"
                      className="bg-white"
                    />
                    {errors.website && (
                      <p className="text-sm text-red-500">{errors.website.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Company Logo (optional)</Label>
                    <FileUploader
                      accept=".png,.jpg,.jpeg,.svg"
                      maxSize={5}
                      onFileSelected={(file) => setLogoFile(file)}
                    />
                    <p className="text-xs text-gray-500">
                      Upload your company logo to be displayed on Briki. PNG, JPG, or SVG formats (max 5MB).
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <Users className="h-5 w-5" />
                    <h2 className="text-lg">Contact Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input 
                        id="contactName" 
                        {...register("contactName")} 
                        className="bg-white"
                      />
                      {errors.contactName && (
                        <p className="text-sm text-red-500">{errors.contactName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        {...register("contactEmail")} 
                        className="bg-white"
                      />
                      {errors.contactEmail && (
                        <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone (optional)</Label>
                    <Input 
                      id="contactPhone" 
                      {...register("contactPhone")} 
                      className="bg-white"
                    />
                    {errors.contactPhone && (
                      <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Insurance Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <FileText className="h-5 w-5" />
                    <h2 className="text-lg">Insurance Information</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Insurance Types (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="travel" 
                          onCheckedChange={(checked) => {
                            setValue("insuranceTypes.travel", checked === true);
                          }}
                        />
                        <label
                          htmlFor="travel"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        />
                        <label
                          htmlFor="auto"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        />
                        <label
                          htmlFor="health"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        />
                        <label
                          htmlFor="pet"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Pet Insurance
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedPlans">Estimated Number of Plans</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["1-5", "6-10", "11-20", "21+"].map((option) => (
                          <div 
                            key={option} 
                            className={`border rounded-lg p-2 text-center cursor-pointer transition-colors ${
                              watch("estimatedPlans") === option ? "bg-blue-50 border-blue-200" : ""
                            }`}
                            onClick={() => setValue("estimatedPlans", option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      {errors.estimatedPlans && (
                        <p className="text-sm text-red-500">{errors.estimatedPlans.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estimatedVolume">Estimated Monthly Volume</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["< 100", "100-500", "501-1000", "1000+"].map((option) => (
                          <div 
                            key={option} 
                            className={`border rounded-lg p-2 text-center cursor-pointer transition-colors ${
                              watch("estimatedVolume") === option ? "bg-blue-50 border-blue-200" : ""
                            }`}
                            onClick={() => setValue("estimatedVolume", option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      {errors.estimatedVolume && (
                        <p className="text-sm text-red-500">{errors.estimatedVolume.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea 
                      id="message" 
                      {...register("message")} 
                      placeholder="Tell us about your company, your insurance plans, and what you hope to achieve with the Briki partnership."
                      className="min-h-[150px] bg-white"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Expected Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <Calendar className="h-5 w-5" />
                    <h2 className="text-lg">Expected Timeline</h2>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="space-y-6">
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">1</div>
                          <div className="h-full w-0.5 bg-blue-200 mt-2"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-900">Application Review</h3>
                          <p className="text-sm text-blue-700 mt-1">1-2 business days</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">2</div>
                          <div className="h-full w-0.5 bg-blue-200 mt-2"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-900">Partnership Agreement</h3>
                          <p className="text-sm text-blue-700 mt-1">3-5 business days</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">3</div>
                          <div className="h-full w-0.5 bg-blue-200 mt-2"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-900">Integration & Setup</h3>
                          <p className="text-sm text-blue-700 mt-1">1-2 weeks</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">4</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-900">Live on Briki</h3>
                          <p className="text-sm text-blue-700 mt-1">5-7 business days after setup</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="acceptTerms" 
                    onCheckedChange={(checked) => {
                      setValue("acceptTerms", checked === true);
                    }}
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open('/terms', '_blank');
                      }}
                    >
                      partner terms and conditions
                    </Button>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                form="pilot-request-form"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <span>Submitting</span>
                    <span className="ml-2 flex h-4 w-4 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                    </span>
                  </>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Rocket className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </CompanyLayout>
  );
}