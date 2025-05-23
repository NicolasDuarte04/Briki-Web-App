import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useAnonymousUser } from "@/hooks/use-anonymous-user";
import { generateQuoteTrackingId } from "@/lib/anonymous-data-migration";

// Layout is handled by App.tsx
import { useLanguage } from "@/components/language-selector";
import { CountryCombobox } from "@/components/country-combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FuturisticBackground } from "@/components/ui/futuristic-background";
import { AIAssistant, getTripFormTips } from "@/components/ui/ai-assistant";

// Import our new animated components
import { AnimatedInput } from "@/components/ui/animated-input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedFormMessage } from "@/components/ui/animated-form-message";
import { AnimatedSelect } from "@/components/ui/animated-select";
import { FormAnimationWrapper } from "@/components/ui/form-animation-wrapper";

// Define the base schema (form input)
const tripFormInputSchema = z.object({
  destination: z.string({
    required_error: "Please select a destination country.",
  }),
  countryOfOrigin: z.string({
    required_error: "Please select your country of origin.",
  }),
  departureDate: z.date({
    required_error: "Please select a departure date.",
  }),
  returnDate: z.date({
    required_error: "Please select a return date.",
  }),
  travelers: z.string({
    required_error: "Please select number of travelers.",
  }),
  primaryAge: z.string({
    required_error: "Please enter your age.",
  }),
  hasMedicalConditions: z.enum(["yes", "no"], {
    required_error: "Please indicate if you have medical conditions.",
  }),
  priorities: z.object({
    medical: z.boolean().default(false),
    cancellation: z.boolean().default(false),
    baggage: z.boolean().default(false),
    emergency: z.boolean().default(false),
    activities: z.boolean().default(false),
    rental: z.boolean().default(false),
  }),
}).refine((data) => {
  return data.returnDate >= data.departureDate;
}, {
  message: "Return date must be after departure date",
  path: ["returnDate"],
});

// API submission schema with transformations for the backend
const tripFormSchema = tripFormInputSchema.transform((data) => ({
  ...data,
  travelers: parseInt(data.travelers),
  primaryAge: parseInt(data.primaryAge),
  hasMedicalConditions: data.hasMedicalConditions === "yes",
}));

type TripFormValues = z.infer<typeof tripFormSchema>;

export default function TripInfoPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    updateTempData, 
    tempUserData, 
    anonymousId
  } = useAnonymousUser();
  
  const form = useForm<z.infer<typeof tripFormInputSchema>>({
    resolver: zodResolver(tripFormInputSchema),
    defaultValues: {
      travelers: "1",
      hasMedicalConditions: "no",
      priorities: {
        medical: false,
        cancellation: false,
        baggage: false,
        emergency: false,
        activities: false,
        rental: false,
      },
    },
  });
  
  // Load previous data from anonymous storage if available
  useEffect(() => {
    if (!authLoading && !user && form) {
      if (tempUserData.tempQuoteData?.tripInfo) {
        // Restore previous trip info data from anonymous storage
        const savedData = tempUserData.tempQuoteData.tripInfo;
        
        try {
          // Only set values if they exist in the previous data
          const formValues: Partial<z.infer<typeof tripFormInputSchema>> = {};
          
          if (savedData.destination) formValues.destination = savedData.destination;
          if (savedData.countryOfOrigin) formValues.countryOfOrigin = savedData.countryOfOrigin;
          if (savedData.departureDate) formValues.departureDate = new Date(savedData.departureDate);
          if (savedData.returnDate) formValues.returnDate = new Date(savedData.returnDate);
          if (savedData.travelers) formValues.travelers = String(savedData.travelers);
          if (savedData.primaryAge) formValues.primaryAge = String(savedData.primaryAge);
          if (savedData.hasMedicalConditions !== undefined) {
            formValues.hasMedicalConditions = savedData.hasMedicalConditions ? 'yes' : 'no';
          }
          if (savedData.priorities) {
            formValues.priorities = savedData.priorities;
          }
          
          form.reset(formValues);
        } catch (error) {
          console.error("Error restoring anonymous trip data:", error);
        }
      }
    }
  }, [authLoading, user, tempUserData, form]);
  
  const createTripMutation = useMutation({
    mutationFn: async (tripData: TripFormValues) => {
      try {
        // Format the data for storage
        const formattedTripData = {
          destination: tripData.destination,
          countryOfOrigin: tripData.countryOfOrigin,
          departureDate: format(tripData.departureDate, "yyyy-MM-dd"),
          returnDate: format(tripData.returnDate, "yyyy-MM-dd"),
          travelers: tripData.travelers,
          primaryAge: tripData.primaryAge,
          hasMedicalConditions: tripData.hasMedicalConditions,
          priorities: tripData.priorities,
          quoteTrackingId: generateQuoteTrackingId(), // Generate a unique ID for this quote
          createdAt: new Date().toISOString()
        };
        
        // If user is authenticated, save trip to their account
        if (user) {
          console.log("Saving trip data for authenticated user:", user.id);
          
          const res = await fetch("/api/trips", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache"
            },
            credentials: 'include',
            body: JSON.stringify(formattedTripData)
          });
          
          console.log("Trip API response status:", res.status);
          
          if (!res.ok) {
            // Try to get a detailed error message from the server
            let errorMessage = "Failed to save trip information";
            try {
              const errorData = await res.json();
              console.log("Server error response:", errorData);
              
              // Handle the different error formats we might receive
              if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = typeof errorData.error === 'string' 
                  ? errorData.error 
                  : JSON.stringify(errorData.error);
              }
            } catch (parseError) {
              console.error("Error parsing error response:", parseError);
              errorMessage = res.statusText || "Failed to save trip";
            }
            
            throw new Error(errorMessage);
          }
          
          // Parse and return response
          try {
            const responseData = await res.json();
            console.log("Trip creation successful:", responseData);
            return { ...responseData, authenticated: true };
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            // Even though we can't parse the response, we know the request was successful
            return { success: true, authenticated: true };
          }
        } 
        // For anonymous users, save to anonymous storage
        else {
          console.log("Saving trip data for anonymous user:", anonymousId);
          
          // Save the trip details to anonymous storage
          updateTempData({
            tripInfo: formattedTripData,
            insuranceType: "travel"
          });
          
          // There's no server request for anonymous users, so return success
          return { 
            success: true, 
            authenticated: false,
            quoteTrackingId: formattedTripData.quoteTrackingId
          };
        }
      } catch (error) {
        console.error("Error in trip submission:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Show appropriate message based on authentication status
      if (data.authenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
        toast({
          title: "Trip details saved!",
          description: "Your trip details have been saved to your account. We'll find the best insurance options for you.",
        });
      } else {
        toast({
          title: "Trip details processed!",
          description: "We'll find the best insurance options for your trip.",
        });
      }
      
      // Navigate to insurance options page
      setTimeout(() => {
        navigate("/insurance/travel");
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Error processing trip details",
        description: error.message || "There was a problem with your trip details. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = async (data: z.infer<typeof tripFormInputSchema>) => {
    try {
      const transformedData = tripFormSchema.parse(data);
      await createTripMutation.mutateAsync(transformedData);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };
  
  const { 
    destination, 
    countryOfOrigin, 
    departureDate,
    returnDate,
    hasMedicalConditions,
  } = form.watch();
  
  const formState = useFormState({ control: form.control });
  
  // Futuristic background animation states
  const [animationVisible, setAnimationVisible] = useState(true);
  
  return (
    <div>
      <div className="relative bg-white dark:bg-gray-950 min-h-screen mb-10">
        {/* Visual background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {animationVisible && <FuturisticBackground />}
        </div>
        
        {/* Main content area */}
        <div className="container max-w-screen-xl mx-auto px-4 py-8 relative z-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <Link href="/home">
                <motion.div 
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </Link>
            </div>
            <h2 className="text-3xl font-bold section-header mb-2">{t('tripDetails')}</h2>
            <p className="text-foreground/70">Tell us about your trip to get personalized insurance options</p>
          </motion.div>
            
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Form fields would go here - abbreviated for clarity */}
                  <FormField
                    control={form.control}
                    name="countryOfOrigin"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('countryOfOrigin')}</FormLabel>
                        <FormAnimationWrapper
                          isValid={fieldState.isDirty && !fieldState.error}
                          isInvalid={!!fieldState.error && fieldState.isTouched}
                          animationType="glow"
                        >
                          <FormControl>
                            <CountryCombobox 
                              value={field.value || ""} 
                              onChange={field.onChange}
                              placeholder={t('selectCountryOfOrigin')}
                              label={t('countryOfOrigin')}
                              emptyMessage={t('noCountryFound')}
                              searchPlaceholder={t('searchCountry')}
                              isOrigin={true}
                            />
                          </FormControl>
                        </FormAnimationWrapper>
                        <AnimatedFormMessage 
                          isValid={fieldState.isDirty && !fieldState.error}
                        >
                          {fieldState.error?.message}
                        </AnimatedFormMessage>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('destination')}</FormLabel>
                        <FormAnimationWrapper
                          isValid={fieldState.isDirty && !fieldState.error}
                          isInvalid={!!fieldState.error && fieldState.isTouched}
                          animationType="glow"
                        >
                          <FormControl>
                            <CountryCombobox 
                              value={field.value || ""} 
                              onChange={field.onChange}
                              placeholder={t('selectDestination')}
                              label={t('destination')}
                              emptyMessage={t('noCountryFound')}
                              searchPlaceholder={t('searchCountry')}
                              isOrigin={false}
                            />
                          </FormControl>
                        </FormAnimationWrapper>
                        <AnimatedFormMessage 
                          isValid={fieldState.isDirty && !fieldState.error}
                        >
                          {fieldState.error?.message}
                        </AnimatedFormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Additional form fields would go here */}
                </div>
                
                {/* Submit button that works for both authenticated and anonymous users */}
                <motion.div 
                  className="mt-8 flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatedButton
                    type="submit"
                    disabled={formState.isSubmitting}
                    isLoading={createTripMutation.isPending}
                    animationType="pulse"
                    className="w-full md:w-auto text-lg px-8 py-6"
                  >
                    {user ? 'Save and Continue' : 'Continue as Guest'}
                  </AnimatedButton>
                </motion.div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}