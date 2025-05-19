import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "wouter";
import { useQuoteStore } from "@/store/quote-store";

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Validation schema for travel insurance quote
const travelQuoteSchema = z.object({
  destination: z.string().min(2, { message: "Please select a destination" }),
  departureDate: z.date({ required_error: "Departure date is required" }),
  returnDate: z.date({ required_error: "Return date is required" }),
  travelers: z.string().min(1, { message: "Number of travelers is required" }),
  travelerAge: z.string().min(1, { message: "Primary traveler age is required" }),
  tripCost: z.string().min(1, { message: "Trip cost is required" }),
  activities: z.array(z.string()).optional(),
  medicalConditions: z.boolean().optional(),
  cancellationCoverage: z.boolean().optional(),
  baggageCoverage: z.boolean().optional(),
  medicalCoverage: z.boolean().optional(),
  adventureActivities: z.boolean().optional()
});

type TravelQuoteFormValues = z.infer<typeof travelQuoteSchema>;

export const TravelQuoteForm = () => {
  const navigate = useNavigate();
  const { setTravelQuote } = useQuoteStore();

  // Default form values
  const defaultValues: Partial<TravelQuoteFormValues> = {
    destination: "",
    travelers: "1",
    travelerAge: "30",
    tripCost: "1000",
    activities: [],
    medicalConditions: false,
    cancellationCoverage: true,
    baggageCoverage: true,
    medicalCoverage: true,
    adventureActivities: false
  };

  const form = useForm<TravelQuoteFormValues>({
    resolver: zodResolver(travelQuoteSchema),
    defaultValues,
  });

  const onSubmit = (data: TravelQuoteFormValues) => {
    // Store form data in Zustand store
    setTravelQuote({
      destination: data.destination,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      travelers: parseInt(data.travelers),
      travelerAge: parseInt(data.travelerAge),
      tripCost: parseFloat(data.tripCost),
      activities: data.activities || [],
      medicalConditions: data.medicalConditions || false,
      cancellationCoverage: data.cancellationCoverage || false,
      baggageCoverage: data.baggageCoverage || false,
      medicalCoverage: data.medicalCoverage || false,
      adventureActivities: data.adventureActivities || false
    });

    // Navigate to the travel plans page
    navigate("/insurance/travel/plans");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Travel Insurance Quote</CardTitle>
        <CardDescription>Fill out the form below to get tailored travel insurance quotes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="south-america">South America</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="mexico">Mexico</SelectItem>
                        <SelectItem value="caribbean">Caribbean</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Travelers */}
              <FormField
                control={form.control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Travelers</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of travelers" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Departure Date */}
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departure Date</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Return Date */}
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return Date</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age */}
              <FormField
                control={form.control}
                name="travelerAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Traveler Age</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0-17</SelectItem>
                        <SelectItem value="18">18-29</SelectItem>
                        <SelectItem value="30">30-39</SelectItem>
                        <SelectItem value="40">40-49</SelectItem>
                        <SelectItem value="50">50-59</SelectItem>
                        <SelectItem value="60">60-69</SelectItem>
                        <SelectItem value="70">70-79</SelectItem>
                        <SelectItem value="80">80+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trip Cost */}
              <FormField
                control={form.control}
                name="tripCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Trip Cost (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Coverage Options</h3>

              {/* Trip Cancellation Coverage */}
              <FormField
                control={form.control}
                name="cancellationCoverage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Trip Cancellation Coverage</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Reimburses prepaid, non-refundable expenses if you need to cancel your trip.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Baggage Coverage */}
              <FormField
                control={form.control}
                name="baggageCoverage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Baggage & Personal Items Coverage</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Covers loss, theft, or damage to your luggage and personal effects.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Medical Coverage */}
              <FormField
                control={form.control}
                name="medicalCoverage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Emergency Medical Coverage</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Covers medical expenses if you get sick or injured during your trip.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Adventure Activities */}
              <FormField
                control={form.control}
                name="adventureActivities"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Adventure Activities Coverage</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Additional coverage for activities like skiing, scuba diving, or hiking.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Pre-existing Medical Conditions */}
              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pre-existing Medical Conditions</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Do you or any travelers have pre-existing medical conditions?
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">Get Quotes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};