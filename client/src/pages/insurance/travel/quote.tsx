import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane, ArrowRight, MapPin, CalendarDays, Users, Activity, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useQuoteStore } from '@/store/quote-store';
import { Badge } from '@/components/ui/badge';

// Define the form schema
const travelQuoteSchema = z.object({
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  departureDate: z.date({
    required_error: "Departure date is required.",
  }),
  returnDate: z.date({
    required_error: "Return date is required.",
  }).refine(
    (date) => date > new Date(),
    {
      message: "Return date must be in the future",
    }
  ),
  travelers: z.coerce.number().int().min(1, {
    message: "At least one traveler is required.",
  }).max(10, {
    message: "Maximum 10 travelers per quote.",
  }),
  activities: z.array(z.string()).optional(),
  coverage: z.enum(['basic', 'standard', 'premium'], {
    required_error: "Please select coverage level.",
  }),
}).refine((data) => data.returnDate > data.departureDate, {
  message: "Return date must be after departure date",
  path: ["returnDate"],
});

// Define the activities options
const activitiesOptions = [
  { id: 'hiking', label: 'Hiking' },
  { id: 'skiing', label: 'Skiing / Snowboarding' },
  { id: 'diving', label: 'Scuba Diving' },
  { id: 'surfing', label: 'Surfing' },
  { id: 'biking', label: 'Mountain Biking' },
  { id: 'climbing', label: 'Rock Climbing' },
];

// Component for travel quote
export default function TravelQuoteForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { travelQuote, updateTravelQuote, submitTravelQuote } = useQuoteStore();
  
  // Define form
  const form = useForm<z.infer<typeof travelQuoteSchema>>({
    resolver: zodResolver(travelQuoteSchema),
    defaultValues: {
      destination: travelQuote?.destination || '',
      departureDate: travelQuote?.departureDate ? new Date(travelQuote.departureDate) : new Date(),
      returnDate: travelQuote?.returnDate ? new Date(travelQuote.returnDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      travelers: travelQuote?.travelers || 1,
      activities: travelQuote?.activities || [],
      coverage: travelQuote?.coverage || 'standard',
    },
  });

  // Submit handler
  function onSubmit(values: z.infer<typeof travelQuoteSchema>) {
    // Update the store with form values
    updateTravelQuote({
      ...values,
      departureDate: values.departureDate.toISOString(),
      returnDate: values.returnDate.toISOString(),
    });
    
    // Submit the quote to show on the main page
    submitTravelQuote();
    
    // Show success toast
    toast({
      title: "Quote submitted!",
      description: "We've personalized travel insurance plans for you.",
    });
    
    // Navigate to the travel insurance page
    navigate('/insurance/travel');
  }

  return (
    <div className="container py-12 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-blue-600">
            <Plane className="h-3.5 w-3.5 mr-1.5" />
            Travel
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Get Your Travel Insurance Quote</h1>
        <p className="text-lg text-gray-600">
          Tell us about your trip to get personalized travel insurance recommendations.
        </p>
      </div>
      
      <Card className="border-blue-100 shadow-md">
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-600" />
            Trip Details
          </CardTitle>
          <CardDescription>
            Enter the details of your upcoming trip
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Destination */}
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        Destination
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. France, Japan, etc." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your main travel destination.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Number of travelers */}
                <FormField
                  control={form.control}
                  name="travelers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-blue-500" />
                        Number of Travelers
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormDescription>
                        How many people are traveling?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departure Date */}
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        Departure Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker 
                          date={field.value} 
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        When does your trip begin?
                      </FormDescription>
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
                      <FormLabel className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        Return Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker 
                          date={field.value} 
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        When does your trip end?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Activities */}
              <FormField
                control={form.control}
                name="activities"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-blue-500" />
                        Activities
                      </FormLabel>
                      <FormDescription>
                        Select any high-risk activities you plan to do during your trip
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {activitiesOptions.map((activity) => (
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
                                      return checked
                                        ? field.onChange([...field.value || [], activity.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== activity.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {activity.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Coverage */}
              <FormField
                control={form.control}
                name="coverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Coverage Level
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coverage level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic - Essential coverage only</SelectItem>
                        <SelectItem value="standard">Standard - Balanced protection</SelectItem>
                        <SelectItem value="premium">Premium - Comprehensive coverage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the level of coverage that fits your needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                >
                  Show Personalized Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}