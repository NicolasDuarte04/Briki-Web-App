import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/components/language-selector";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Form schema
const formSchema = z.object({
  vehicleMake: z.string().min(1, { message: "Vehicle make is required" }),
  vehicleModel: z.string().min(1, { message: "Vehicle model is required" }),
  vehicleYear: z.string().min(4, { message: "Valid year is required" }),
  vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
  ownerName: z.string().min(2, { message: "Owner name is required" }),
  ownerAge: z.string().min(1, { message: "Owner age is required" }),
  vehicleValue: z.string().min(1, { message: "Vehicle value is required" }),
  coverageType: z.string().min(1, { message: "Coverage type is required" }),
});

export default function AutoQuotePage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      vehicleType: "",
      ownerName: user?.name || "",
      ownerAge: "",
      vehicleValue: "",
      coverageType: "",
    },
  });

  // Submit handler
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    
    // Show toast
    toast({
      title: "Quote information saved",
      description: "We're finding the best auto insurance plans for your vehicle.",
    });
    
    // Navigate to results page (placeholder for now)
    setTimeout(() => {
      navigate("/auto-insurance");
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Auto Insurance Quote
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Enter your vehicle details to get personalized quotes
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>
              Please provide accurate details about your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Vehicle Make */}
                  <FormField
                    control={form.control}
                    name="vehicleMake"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Make</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Toyota, Honda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Vehicle Model */}
                  <FormField
                    control={form.control}
                    name="vehicleModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Corolla, Civic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Vehicle Year */}
                  <FormField
                    control={form.control}
                    name="vehicleYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Vehicle Type */}
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="coupe">Coupe</SelectItem>
                            <SelectItem value="hatchback">Hatchback</SelectItem>
                            <SelectItem value="convertible">Convertible</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Owner Name */}
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Owner Age */}
                  <FormField
                    control={form.control}
                    name="ownerAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Vehicle Value */}
                  <FormField
                    control={form.control}
                    name="vehicleValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Value (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 15000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Coverage Type */}
                  <FormField
                    control={form.control}
                    name="coverageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select coverage type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="liability">Basic Liability</SelectItem>
                            <SelectItem value="collision">Collision Coverage</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive Coverage</SelectItem>
                            <SelectItem value="full">Full Coverage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <CardFooter className="flex justify-end space-x-4 px-0">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => navigate("/auto-insurance")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Get Quotes</Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}