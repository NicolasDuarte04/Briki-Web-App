import { MainLayout } from "../../../components/layout";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { useNavigation } from "../../../hooks/use-navigation";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  Plane, 
  Car, 
  Cat, 
  Heart, 
  CalendarDays, 
  MapPin, 
  Users, 
  Activity, 
  Shield,
  Calendar,
  Briefcase,
  Meh,
  Info 
} from "lucide-react";
import { useEffect, useState } from "react";
import { InsuranceCategory } from "../../../components/briki-ai-assistant/PlanCard";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useForm } from "react-hook-form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { useToast } from "../../../hooks/use-toast";
import { Separator } from "../../../components/ui/separator";
import { 
  useQuoteStore, 
  TravelQuoteData, 
  AutoQuoteData, 
  PetQuoteData, 
  HealthQuoteData 
} from "../../../store/quote-store";
import { format } from "date-fns";
import { Switch } from "../../../components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schemas for each category
const travelQuoteSchema = z.object({
  destination: z.string().min(2, { message: "Please enter a valid destination" }),
  departureDate: z.string().min(1, { message: "Please select a departure date" }),
  returnDate: z.string().min(1, { message: "Please select a return date" }),
  travelers: z.coerce.number().min(1).max(10),
  activities: z.array(z.string()).optional(),
  coverage: z.string()
});

const autoQuoteSchema = z.object({
  vehicleMake: z.string().min(1, { message: "Please enter the vehicle make" }),
  vehicleModel: z.string().min(1, { message: "Please enter the vehicle model" }),
  vehicleYear: z.coerce.number().min(1950).max(new Date().getFullYear() + 1),
  vehicleValue: z.coerce.number().min(1),
  primaryDriver: z.object({
    age: z.coerce.number().min(16).max(100),
    drivingExperience: z.coerce.number().min(0).max(80),
    accidentHistory: z.string()
  }),
  coverageType: z.string()
});

const petQuoteSchema = z.object({
  petType: z.string().min(1, { message: "Please select a pet type" }),
  breed: z.string().min(1, { message: "Please enter your pet's breed" }),
  age: z.coerce.number().min(0).max(30),
  medicalHistory: z.array(z.string()).optional(),
  coverageLevel: z.string()
});

const healthQuoteSchema = z.object({
  age: z.coerce.number().min(0).max(120),
  gender: z.string().min(1, { message: "Please select a gender" }),
  smoker: z.boolean(),
  preExistingConditions: z.array(z.string()).optional(),
  coverageNeeds: z.array(z.string()).min(1, { message: "Please select at least one coverage need" })
});

export default function InsuranceQuote() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { goBack } = useNavigation();
  const [planId, setPlanId] = useState<string | null>(null);
  const [category, setCategory] = useState<InsuranceCategory>("travel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Get state from quote store
  const {
    travelQuote, setTravelQuote, submitTravelQuote,
    autoQuote, setAutoQuote, submitAutoQuote,
    petQuote, setPetQuote, submitPetQuote,
    healthQuote, setHealthQuote, submitHealthQuote
  } = useQuoteStore();

  // Travel form setup
  const travelForm = useForm<TravelQuoteData>({
    resolver: zodResolver(travelQuoteSchema),
    defaultValues: travelQuote || {
      destination: '',
      departureDate: format(new Date(), 'yyyy-MM-dd'),
      returnDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      travelers: 1,
      activities: [],
      coverage: 'standard'
    }
  });

  // Auto form setup
  const autoForm = useForm<AutoQuoteData>({
    resolver: zodResolver(autoQuoteSchema),
    defaultValues: autoQuote || {
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: new Date().getFullYear(),
      vehicleValue: 0,
      primaryDriver: {
        age: 30,
        drivingExperience: 5,
        accidentHistory: 'none'
      },
      coverageType: 'comprehensive'
    }
  });

  // Pet form setup
  const petForm = useForm<PetQuoteData>({
    resolver: zodResolver(petQuoteSchema),
    defaultValues: petQuote || {
      petType: '',
      breed: '',
      age: 0,
      medicalHistory: [],
      coverageLevel: 'standard'
    }
  });

  // Health form setup
  const healthForm = useForm<HealthQuoteData>({
    resolver: zodResolver(healthQuoteSchema),
    defaultValues: healthQuote || {
      age: 30,
      gender: '',
      smoker: false,
      preExistingConditions: [],
      coverageNeeds: []
    }
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Extract category from URL (e.g., /insurance/travel/quote)
    const pathParts = location.split('/');
    if (pathParts.length >= 3) {
      const extractedCategory = pathParts[2] as InsuranceCategory;
      setCategory(extractedCategory);
    }
    
    // Extract planId from query string if present
    const queryParams = new URLSearchParams(window.location.search);
    const extractedPlanId = queryParams.get('planId');
    if (extractedPlanId) {
      setPlanId(extractedPlanId);
    }
  }, [location]);

  const getCategoryTitle = (): string => {
    switch (category) {
      case "travel":
        return "Travel Insurance Quote";
      case "auto":
        return "Auto Insurance Quote";
      case "pet":
        return "Pet Insurance Quote";
      case "health":
        return "Health Insurance Quote";
      default:
        return "Insurance Quote";
    }
  };

  const getFormDescription = (): string => {
    switch (category) {
      case "travel":
        return "Tell us about your trip to get personalized travel insurance quotes.";
      case "auto":
        return "Enter your vehicle details to find auto insurance plans that fit your needs.";
      case "pet":
        return "Provide information about your furry friend to find the right pet insurance coverage.";
      case "health":
        return "Share some basic health information to get personalized health insurance quotes.";
      default:
        return "Complete the form below to get a personalized quote for your insurance needs.";
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case "travel":
        return <Plane className="h-6 w-6 text-blue-600" />;
      case "auto":
        return <Car className="h-6 w-6 text-blue-600" />;
      case "pet":
        return <Cat className="h-6 w-6 text-blue-600" />;
      case "health":
        return <Heart className="h-6 w-6 text-blue-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const handleTravelSubmit = (data: TravelQuoteData) => {
    setIsSubmitting(true);
    setTravelQuote(data);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      submitTravelQuote();
      setIsSubmitting(false);
      navigate('/insurance/travel');
      
      toast({
        title: "Quote completed!",
        description: "We've found travel insurance plans based on your trip details.",
      });
    }, 1000);
  };

  const handleAutoSubmit = (data: AutoQuoteData) => {
    setIsSubmitting(true);
    setAutoQuote(data);
    
    setTimeout(() => {
      submitAutoQuote();
      setIsSubmitting(false);
      navigate('/insurance/auto');
      
      toast({
        title: "Quote completed!",
        description: "We've found auto insurance plans based on your vehicle details.",
      });
    }, 1000);
  };

  const handlePetSubmit = (data: PetQuoteData) => {
    setIsSubmitting(true);
    setPetQuote(data);
    
    setTimeout(() => {
      submitPetQuote();
      setIsSubmitting(false);
      navigate('/insurance/pet');
      
      toast({
        title: "Quote completed!",
        description: "We've found pet insurance plans for your furry friend.",
      });
    }, 1000);
  };

  const handleHealthSubmit = (data: HealthQuoteData) => {
    setIsSubmitting(true);
    setHealthQuote(data);
    
    setTimeout(() => {
      submitHealthQuote();
      setIsSubmitting(false);
      navigate('/insurance/health');
      
      toast({
        title: "Quote completed!",
        description: "We've found health insurance plans based on your profile.",
      });
    }, 1000);
  };

  // Define travel activities options
  const travelActivities = [
    { id: "hiking", label: "Hiking" },
    { id: "skiing", label: "Skiing" },
    { id: "scuba", label: "Scuba Diving" },
    { id: "adventure", label: "Adventure Sports" },
    { id: "cruise", label: "Cruise" }
  ];

  // Define pet medical conditions
  const petMedicalConditions = [
    { id: "allergies", label: "Allergies" },
    { id: "arthritis", label: "Arthritis" },
    { id: "diabetes", label: "Diabetes" },
    { id: "dental", label: "Dental Issues" },
    { id: "heart", label: "Heart Conditions" }
  ];

  // Define health conditions
  const healthConditions = [
    { id: "diabetes", label: "Diabetes" },
    { id: "hypertension", label: "Hypertension" },
    { id: "asthma", label: "Asthma" },
    { id: "heart", label: "Heart Disease" },
    { id: "cancer", label: "Cancer History" },
    { id: "mental", label: "Mental Health Condition" }
  ];

  // Define health coverage needs
  const healthCoverageNeeds = [
    { id: "preventive", label: "Preventive Care" },
    { id: "prescription", label: "Prescription Coverage" },
    { id: "specialist", label: "Specialist Visits" },
    { id: "emergency", label: "Emergency Services" },
    { id: "hospital", label: "Hospital Care" },
    { id: "dental", label: "Dental Coverage" },
    { id: "vision", label: "Vision Coverage" }
  ];

  // Render category-specific quote form
  const renderQuoteForm = () => {
    switch (category) {
      case "travel":
        return (
          <Form {...travelForm}>
            <form onSubmit={travelForm.handleSubmit(handleTravelSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={travelForm.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-10" 
                            placeholder="e.g., France, Japan, etc." 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter your primary travel destination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={travelForm.control}
                  name="travelers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Travelers</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-10" 
                            type="number" 
                            min={1} 
                            max={10} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        How many people are traveling
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={travelForm.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-10" 
                            type="date" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={travelForm.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-10" 
                            type="date" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              <FormField
                control={travelForm.control}
                name="activities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Planned Activities</FormLabel>
                      <FormDescription>
                        Select any activities you'll be participating in during your trip
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {travelActivities.map((activity) => (
                        <FormField
                          key={activity.id}
                          control={travelForm.control}
                          name="activities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={activity.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(activity.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), activity.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== activity.id) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="cursor-pointer">
                                    {activity.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={travelForm.control}
                name="coverage"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Coverage Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="basic" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Basic (Essential coverage for budget travelers)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="standard" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Standard (Comprehensive coverage for most travelers)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="premium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Premium (Maximum coverage for complete peace of mind)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-2 px-8"
                >
                  {isSubmitting ? (
                    <>Processing<span className="animate-pulse">...</span></>
                  ) : (
                    <>
                      Get My Quotes
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case "auto":
        return (
          <Form {...autoForm}>
            <form onSubmit={autoForm.handleSubmit(handleAutoSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={autoForm.control}
                  name="vehicleMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Toyota, Honda, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={autoForm.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Camry, Civic, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={autoForm.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Year</FormLabel>
                      <FormControl>
                        <Input type="number" min={1950} max={new Date().getFullYear() + 1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={autoForm.control}
                  name="vehicleValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Value (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} placeholder="e.g., 15000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium mb-4">Primary Driver Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={autoForm.control}
                  name="primaryDriver.age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver's Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={16} max={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={autoForm.control}
                  name="primaryDriver.drivingExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Driving Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={80} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={autoForm.control}
                  name="primaryDriver.accidentHistory"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Accident History (Last 5 Years)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accident history" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No accidents</SelectItem>
                          <SelectItem value="minor">Minor accidents (no claims)</SelectItem>
                          <SelectItem value="one">One accident with claim</SelectItem>
                          <SelectItem value="multiple">Multiple accidents with claims</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              <FormField
                control={autoForm.control}
                name="coverageType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Coverage Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="liability" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Liability Only (Basic legal requirement)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="collision" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Collision (Covers damage to your vehicle from accidents)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="comprehensive" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Comprehensive (Full coverage including theft, weather damage, etc.)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-2 px-8"
                >
                  {isSubmitting ? (
                    <>Processing<span className="animate-pulse">...</span></>
                  ) : (
                    <>
                      Get My Quotes
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case "pet":
        return (
          <Form {...petForm}>
            <form onSubmit={petForm.handleSubmit(handlePetSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={petForm.control}
                  name="petType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pet type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={petForm.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Labrador, Persian, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={petForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet's Age (Years)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={30} step={0.5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              <FormField
                control={petForm.control}
                name="medicalHistory"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Pre-existing Conditions</FormLabel>
                      <FormDescription>
                        Select any conditions your pet has been diagnosed with
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {petMedicalConditions.map((condition) => (
                        <FormField
                          key={condition.id}
                          control={petForm.control}
                          name="medicalHistory"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={condition.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(condition.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), condition.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== condition.id) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="cursor-pointer">
                                    {condition.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={petForm.control}
                name="coverageLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Coverage Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="basic" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Basic (Accident coverage only)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="standard" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Standard (Accident and illness coverage)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="premium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Premium (Comprehensive coverage including wellness care)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-2 px-8"
                >
                  {isSubmitting ? (
                    <>Processing<span className="animate-pulse">...</span></>
                  ) : (
                    <>
                      Get My Quotes
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case "health":
        return (
          <Form {...healthForm}>
            <form onSubmit={healthForm.handleSubmit(handleHealthSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={healthForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={120} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={healthForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={healthForm.control}
                  name="smoker"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-full">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Tobacco Use
                        </FormLabel>
                        <FormDescription>
                          Do you currently use tobacco products?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              <FormField
                control={healthForm.control}
                name="preExistingConditions"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Pre-existing Conditions</FormLabel>
                      <FormDescription>
                        Select any conditions you've been diagnosed with
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {healthConditions.map((condition) => (
                        <FormField
                          key={condition.id}
                          control={healthForm.control}
                          name="preExistingConditions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={condition.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(condition.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), condition.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== condition.id) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="cursor-pointer">
                                    {condition.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-4" />
              
              <FormField
                control={healthForm.control}
                name="coverageNeeds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Coverage Needs</FormLabel>
                      <FormDescription>
                        Select the types of coverage important to you
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {healthCoverageNeeds.map((need) => (
                        <FormField
                          key={need.id}
                          control={healthForm.control}
                          name="coverageNeeds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={need.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(need.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), need.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== need.id) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="cursor-pointer">
                                    {need.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-2 px-8"
                >
                  {isSubmitting ? (
                    <>Processing<span className="animate-pulse">...</span></>
                  ) : (
                    <>
                      Get My Quotes
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <Meh className="h-16 w-16 text-primary opacity-80" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Category Not Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find the requested insurance category. Please try one of our available categories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate('/insurance/travel/quote')}>Travel Insurance</Button>
              <Button onClick={() => navigate('/insurance/auto/quote')}>Auto Insurance</Button>
              <Button onClick={() => navigate('/insurance/pet/quote')}>Pet Insurance</Button>
              <Button onClick={() => navigate('/insurance/health/quote')}>Health Insurance</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8 px-4 md:py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-1"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 mb-1"
          >
            {getCategoryIcon()}
            <h1 className="text-3xl font-bold tracking-tight">{getCategoryTitle()}</h1>
          </motion.div>
          <p className="text-muted-foreground">
            {getFormDescription()}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              {renderQuoteForm()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}