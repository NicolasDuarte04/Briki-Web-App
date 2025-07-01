import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { useQuoteStore } from "../../store/quote-store";
import { travelQuoteSchema, TravelQuote, INSURANCE_CATEGORIES } from "../../../../shared/schema";
import { formatDate, daysBetween, isDateWithinRange } from "../../lib/utils";

const POPULAR_DESTINATIONS = [
  "France",
  "Italy",
  "Spain",
  "United States",
  "Japan",
  "Thailand",
  "Australia",
  "Mexico",
  "United Kingdom",
  "Canada",
];

const TRAVEL_ACTIVITIES = [
  { id: "hiking", label: "Hiking" },
  { id: "skiing", label: "Skiing" },
  { id: "swimming", label: "Swimming" },
  { id: "scuba", label: "Scuba Diving" },
  { id: "surfing", label: "Surfing" },
  { id: "biking", label: "Mountain Biking" },
  { id: "extreme", label: "Extreme Sports" },
  { id: "safari", label: "Safari" },
  { id: "cruise", label: "Cruise" },
];

export default function TravelQuoteForm() {
  const [, navigate] = useLocation();
  const { travelQuote, updateTravelQuote, submitTravelQuote } = useQuoteStore();
  const [submitting, setSubmitting] = useState(false);
  const [tripDuration, setTripDuration] = useState<number | null>(null);

  // Initialize form with our Zod schema
  const form = useForm<TravelQuote>({
    resolver: zodResolver(travelQuoteSchema),
    defaultValues: {
      ...travelQuote,
      category: INSURANCE_CATEGORIES.TRAVEL
    },
  });

  // Watch the date fields to calculate trip duration
  const departureDate = form.watch("departureDate");
  const returnDate = form.watch("returnDate");

  // Update trip duration when dates change
  useEffect(() => {
    if (departureDate && returnDate) {
      setTripDuration(daysBetween(departureDate, returnDate));
    } else {
      setTripDuration(null);
    }
  }, [departureDate, returnDate]);

  // Handle form submission
  async function onSubmit(data: TravelQuote) {
    setSubmitting(true);
    
    try {
      // Apply final form data to the store
      updateTravelQuote(data);
      
      // Submit the travel quote to store
      submitTravelQuote();
      
      // Navigate to the plan selection page
      navigate("/insurance/travel/plans");
    } catch (error) {
      console.error('Error submitting travel quote:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Travel Insurance Quote</CardTitle>
        <CardDescription>
          Tell us about your trip to get tailored travel insurance options
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Destination */}
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where are you traveling to?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {POPULAR_DESTINATIONS.map((destination) => (
                          <SelectItem key={destination} value={destination}>
                            {destination}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trip dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
                        disablePastDates
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
                        disablePastDates
                        disabled={!departureDate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Trip duration display */}
            {tripDuration !== null && (
              <div className="bg-muted p-3 rounded-md text-sm">
                Trip duration: <span className="font-semibold">{tripDuration} days</span>
              </div>
            )}

            {/* Number of travelers */}
            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Travelers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Coverage options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Coverage Options</h3>
              
              <FormField
                control={form.control}
                name="coverageLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coverage Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select coverage level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="includesMedical"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Medical Coverage</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includesCancellation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Cancellation</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="includesValuables"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Valuables</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Activities */}
              <div className="space-y-3">
                <FormLabel>Planned Activities (Optional)</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TRAVEL_ACTIVITIES.map((activity) => (
                    <FormField
                      key={activity.id}
                      control={form.control}
                      name="activities"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={activity.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(activity.id)}
                                onCheckedChange={(checked) => {
                                  const updatedActivities = checked
                                    ? [...(field.value || []), activity.id]
                                    : field.value?.filter((value) => value !== activity.id) || [];
                                  field.onChange(updatedActivities);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {activity.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pb-0 pt-6">
              <Button 
                type="submit" 
                className="w-full" 
                variant="gradient"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Find Insurance Plans"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}