import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Form schema
const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  message: z.string().min(10, "Please provide some details about your inquiry"),
  interests: z.object({
    travelInsurance: z.boolean().optional(),
    autoInsurance: z.boolean().optional(),
    healthInsurance: z.boolean().optional(),
    petInsurance: z.boolean().optional()
  }),
  agreeToContact: z.boolean().refine(val => val === true, {
    message: "You must agree to be contacted"
  })
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSalesPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      country: "",
      message: "",
      interests: {
        travelInsurance: false,
        autoInsurance: false,
        healthInsurance: false,
        petInsurance: false
      },
      agreeToContact: false
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Request Received",
        description: "Our sales team will contact you shortly.",
        variant: "default",
      });
      
      // Update UI to show success state
      setIsSubmitted(true);
      
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-white p-4">
        <div className="w-full max-w-md">
          <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl border-blue-100 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
              <CardDescription className="text-lg">
                Your inquiry has been received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                A member of our partner sales team will be in touch with you shortly to discuss
                how we can work together.
              </p>
              <Button
                onClick={() => navigate("/company")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Return to Partner Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-white p-4">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 text-gray-500 hover:text-blue-600"
          onClick={() => navigate("/company")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Partners
        </Button>
        
        <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl border-blue-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Contact Sales</CardTitle>
            <CardDescription>
              Interested in becoming a Briki partner? Fill out the form below and our team will get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company Ltd."
                    {...register("companyName")}
                    className="bg-white"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    placeholder="Your Name"
                    {...register("contactName")}
                    className="bg-white"
                  />
                  {errors.contactName && (
                    <p className="text-sm text-red-500">{errors.contactName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register("email")}
                    className="bg-white"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    {...register("phone")}
                    className="bg-white"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  onValueChange={(value) => setValue("country", value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                    <SelectItem value="Peru">Peru</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Insurance Types (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="travelInsurance" 
                      onCheckedChange={(checked) => {
                        setValue("interests.travelInsurance", checked === true);
                      }}
                    />
                    <label
                      htmlFor="travelInsurance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Travel Insurance
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="autoInsurance" 
                      onCheckedChange={(checked) => {
                        setValue("interests.autoInsurance", checked === true);
                      }}
                    />
                    <label
                      htmlFor="autoInsurance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Auto Insurance
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="healthInsurance" 
                      onCheckedChange={(checked) => {
                        setValue("interests.healthInsurance", checked === true);
                      }}
                    />
                    <label
                      htmlFor="healthInsurance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Health Insurance
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="petInsurance" 
                      onCheckedChange={(checked) => {
                        setValue("interests.petInsurance", checked === true);
                      }}
                    />
                    <label
                      htmlFor="petInsurance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pet Insurance
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your company and how you'd like to partner with us..."
                  className="min-h-[100px] bg-white"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreeToContact" 
                  onCheckedChange={(checked) => {
                    setValue("agreeToContact", checked === true);
                  }}
                />
                <label
                  htmlFor="agreeToContact"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to be contacted about Briki partner opportunities
                </label>
              </div>
              {errors.agreeToContact && (
                <p className="text-sm text-red-500">{errors.agreeToContact.message}</p>
              )}
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
              >
                {isSubmitting ? "Sending..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}