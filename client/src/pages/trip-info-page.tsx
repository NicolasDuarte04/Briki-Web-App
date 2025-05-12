import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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
  
  const createTripMutation = useMutation({
    mutationFn: async (tripData: TripFormValues) => {
      // Check if the user is logged in first via a quick auth check
      try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          console.log("No auth token found, user needs to log in");
          throw new Error("Authentication required. Please log in to save trip details.");
        }
        
        const authCheck = await fetch("/api/user", { 
          headers: {
            "Authorization": `Bearer ${token}`,
            "Cache-Control": "no-cache"
          }
        });
        
        if (authCheck.status === 401) {
          console.log("Auth token invalid or expired");
          localStorage.removeItem('auth_token'); // Clear invalid token
          throw new Error("Authentication required. Please log in to save trip details.");
        }
        
        // Map the form data to match the updated schema
        const apiData = {
          destination: tripData.destination,
          countryOfOrigin: tripData.countryOfOrigin, // Use actual country of origin
          departureDate: format(tripData.departureDate, "yyyy-MM-dd"),
          returnDate: format(tripData.returnDate, "yyyy-MM-dd"),
          travelers: tripData.travelers, // Already transformed by schema
        };
        
        console.log("Sending trip data to API:", apiData);
        // Get token again to make sure it's the latest
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken) {
          throw new Error("Authentication token missing");
        }
        
        // Use the token in the request
        const res = await fetch("/api/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentToken}`,
            "Cache-Control": "no-cache"
          },
          body: JSON.stringify(apiData)
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
        
        // If we get here, the request was successful
        let responseData;
        try {
          responseData = await res.json();
          console.log("Trip creation successful:", responseData);
          return responseData;
        } catch (parseError) {
          console.error("Error parsing success response:", parseError);
          throw new Error("Received invalid response from server");
        }
      } catch (error) {
        console.error("Error submitting trip data:", error);
        if (error instanceof Error && error.message.includes("Authentication required")) {
          // If it's an auth error, redirect to login
          navigate("/auth");
          throw error;
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: t('tripInfoSaved'),
        description: t('findingBestPlans'),
      });
      navigate("/insurance-plans");
    },
    onError: (error: Error) => {
      toast({
        title: t('failedToSaveTrip'),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: z.infer<typeof tripFormInputSchema>) {
    // Transform the form data using our schema before passing to the mutation
    const transformedData = tripFormSchema.parse(data);
    console.log("Form data before transformation:", data);
    console.log("Form data after transformation:", transformedData);
    createTripMutation.mutate(transformedData);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FuturisticBackground particleCount={50} />
      </div>
      
      <div className="flex-grow relative z-10">
        <div className="briki-mobile-container">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <Link href="/">
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
                  
                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('departureDate')}</FormLabel>
                        <FormAnimationWrapper
                          isValid={fieldState.isDirty && !fieldState.error}
                          isInvalid={!!fieldState.error && fieldState.isTouched}
                          animationType="glow"
                        >
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                    fieldState.isDirty && !fieldState.error && "border-green-500 hover:border-green-600 focus-visible:ring-green-500/30",
                                    !!fieldState.error && fieldState.isTouched && "border-destructive hover:border-destructive/90 focus-visible:ring-destructive/30"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t('selectDestination')}</span>
                                  )}
                                  <motion.div
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </motion.div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                    name="returnDate"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('returnDate')}</FormLabel>
                        <FormAnimationWrapper
                          isValid={fieldState.isDirty && !fieldState.error}
                          isInvalid={!!fieldState.error && fieldState.isTouched}
                          animationType="glow"
                        >
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                    fieldState.isDirty && !fieldState.error && "border-green-500 hover:border-green-600 focus-visible:ring-green-500/30",
                                    !!fieldState.error && fieldState.isTouched && "border-destructive hover:border-destructive/90 focus-visible:ring-destructive/30"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <motion.div
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </motion.div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || (form.watch("departureDate") && date < form.watch("departureDate"))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                    name="travelers"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('numTravelers')}</FormLabel>
                        <FormAnimationWrapper
                          isValid={fieldState.isDirty && !fieldState.error}
                          isInvalid={!!fieldState.error && fieldState.isTouched}
                          animationType="glow"
                        >
                          <FormControl>
                            <AnimatedSelect
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              placeholder={t('selectNumTravelers')}
                              isValid={fieldState.isDirty && !fieldState.error}
                              isInvalid={!!fieldState.error && fieldState.isTouched}
                            >
                              <SelectItem value="1" className="hover:bg-primary/10 transition-colors duration-150 cursor-pointer">1 Traveler</SelectItem>
                              <SelectItem value="2" className="hover:bg-primary/10 transition-colors duration-150 cursor-pointer">2 Travelers</SelectItem>
                              <SelectItem value="3" className="hover:bg-primary/10 transition-colors duration-150 cursor-pointer">3 Travelers</SelectItem>
                              <SelectItem value="4" className="hover:bg-primary/10 transition-colors duration-150 cursor-pointer">4 Travelers</SelectItem>
                              <SelectItem value="5" className="hover:bg-primary/10 transition-colors duration-150 cursor-pointer">5 Travelers</SelectItem>
                              <SelectItem value="6" className="hover:bg-primary/10 transition-colors duration-150 cursor-pointer">6+ Travelers</SelectItem>
                            </AnimatedSelect>
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
                    name="primaryAge"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('primaryTravelerAge')}</FormLabel>
                        <FormControl>
                          <FormAnimationWrapper
                            isValid={fieldState.isDirty && !fieldState.error}
                            isInvalid={!!fieldState.error && fieldState.isTouched}
                            animationType="shake"
                          >
                            <AnimatedInput
                              type="number"
                              min="0"
                              max="120"
                              placeholder={t('age')}
                              isValid={fieldState.isDirty && !fieldState.error}
                              isInvalid={!!fieldState.error && fieldState.isTouched}
                              {...field}
                            />
                          </FormAnimationWrapper>
                        </FormControl>
                        <AnimatedFormMessage 
                          isValid={fieldState.isDirty && !fieldState.error}
                        >
                          {fieldState.error?.message}
                        </AnimatedFormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="hasMedicalConditions"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Do you have any pre-existing medical conditions?</FormLabel>
                      <FormAnimationWrapper
                        isValid={fieldState.isDirty && !fieldState.error}
                        isInvalid={!!fieldState.error && fieldState.isTouched}
                        animationType="glow"
                      >
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-6"
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem 
                                    value="yes" 
                                    className={fieldState.isDirty && field.value === "yes" ? "border-green-500 text-green-500" : ""}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem 
                                    value="no" 
                                    className={fieldState.isDirty && field.value === "no" ? "border-green-500 text-green-500" : ""}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                            </motion.div>
                          </RadioGroup>
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
                
                <div className="space-y-3">
                  <FormLabel>Coverage Priorities (select up to 3)</FormLabel>
                  <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="priorities.medical"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Medical Coverage</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priorities.cancellation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Trip Cancellation</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priorities.baggage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Baggage Loss</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priorities.emergency"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Emergency Evacuation</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priorities.activities"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Adventure Activities</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priorities.rental"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Rental Car Protection</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <AnimatedButton
                    type="submit"
                    className="briki-button w-full"
                    isLoading={createTripMutation.isPending}
                    loadingText="Finding options..."
                    successText="Great choices found!"
                  >
                    Show my options
                  </AnimatedButton>
                  
                  <div className="briki-help-link mt-4 flex justify-center">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                    We're here to help!
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        {/* Help button that triggers AI Assistant */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <AIAssistant 
            tips={getTripFormTips()}
            position="bottom-right"
            contextAware={true}
            formData={form.getValues()}
            helpMode={true}
            autoShow={false}
            onUserQuery={(query) => {
              // Handle user query - for now just showing a toast with the query
              toast({
                title: "Question received",
                description: `We'll help with: "${query}"`,
              });
            }}
          />
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
