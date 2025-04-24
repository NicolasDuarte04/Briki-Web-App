import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { InsurancePlan, Trip } from "@shared/schema";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PaymentSuccess from "@/components/payment-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2, Check, ShieldCheck, Calendar, Briefcase } from "lucide-react";

const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["credit-card", "paypal"]),
  cardNumber: z.string().optional(),
  expiration: z.string().optional(),
  cvv: z.string().optional(),
  cardName: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === "credit-card") {
    return !!data.cardNumber && !!data.expiration && !!data.cvv && !!data.cardName;
  }
  return true;
}, {
  message: "Credit card information is required",
  path: ["paymentMethod"],
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const { planId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Fetch selected insurance plan
  const { data: plan, isLoading: planLoading } = useQuery<InsurancePlan>({
    queryKey: [`/api/insurance-plans/${planId}`],
    enabled: !!planId,
  });
  
  // Fetch latest trip data
  const { data: trips, isLoading: tripsLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
    enabled: !!user,
    initialData: [],
  });
  
  // Get the most recent trip
  const latestTrip = trips && trips.length > 0 ? trips[trips.length - 1] : null;
  
  // Calculate total amount including taxes
  const basePrice = plan?.basePrice || 0;
  const taxesFees = Math.round(basePrice * 0.0825); // 8.25% tax
  const totalAmount = basePrice + taxesFees;
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!planId || !latestTrip?.id) return null;
      
      // Verify authentication first
      const authCheck = await fetch("/api/user", { credentials: "include" });
      if (authCheck.status === 401) {
        toast({
          title: "Authentication required",
          description: "Please log in to complete your purchase",
          variant: "destructive",
        });
        navigate("/auth");
        return null;
      }
      
      const orderData = {
        tripId: latestTrip.id,
        planId: parseInt(planId),
        totalAmount,
        status: "completed"
      };
      
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        setShowSuccess(true);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Initialize form with user data if available
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "us",
      paymentMethod: "credit-card",
    },
  });
  
  function onSubmit(data: CheckoutFormValues) {
    // Process the payment and create order
    createOrderMutation.mutate();
  }
  
  if (showSuccess) {
    return <PaymentSuccess onClose={() => navigate("/")} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-lg text-gray-600">Complete your purchase to secure your travel insurance</p>
          </div>
          
          {(planLoading || tripsLoading) ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : !plan || !latestTrip ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              Error loading plan or trip data. Please go back and try again.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="col-span-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                      <CardContent className="pt-6 pb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Traveler Information</h2>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State/Province</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="zip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP / Postal Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6 pb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Payment Method</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="space-y-2"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="credit-card" />
                                      </FormControl>
                                      <FormLabel className="font-normal flex items-center">
                                        Credit Card
                                        <span className="ml-2 flex items-center space-x-1">
                                          <svg className="h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="currentColor" d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z" />
                                          </svg>
                                          <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="currentColor" d="M482.9 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm-310.8-11.7c-7.1 0-11.2 5.2-11.2 11.7 0 6.5 4.1 11.7 11.2 11.7 6.5 0 10.9-4.9 10.9-11.7-.1-6.5-4.4-11.7-10.9-11.7zm117.5-.3c-5.4 0-8.7 3.5-9.5 8.7h19.1c-.9-5.7-4.4-8.7-9.6-8.7zm107.8.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm105.9 26.1c0 .3.3.5.3 1.1 0 .3-.3.5-.3 1.1-.3.3-.3.5-.5.8-.3.3-.5.5-1.1.5-.3.3-.5.3-1.1.3-.3 0-.5 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.5-.3-.8-.3-1.1 0-.5 0-.8.3-1.1 0-.5.3-.8.5-.8.3-.3.5-.5.8-.5.5-.3.8-.3 1.1-.3.5 0 .8 0 1.1.3.5.3.8.3.8.5.5.3.5.5.5.8zm-291.1 3.5c0 .3 0 .5-.3.8 0 .3-.3.5-.3.8-.3.3-.5.3-.8.5-.3 0-.5.3-1.1.3-.3 0-.5 0-.8-.3-.3 0-.5-.3-.8-.5-.3-.3-.3-.5-.3-.8 0-.3 0-.5-.3-.8 0-.3 0-.5.3-.8.3-.3.3-.5.3-.8.3 0 .5-.3.8-.3.3 0 .5-.3.8-.3.3 0 .5 0 .8.3.5 0 .5.3.8.3.3.3.5.5.5.8.3.3.3.5.3.8zm-87-4.2c-.3 0-.5.3-.8.3-.3 0-.3.3-.5.3 0 .3-.3.3-.3.5s-.3.3-.3.5-.3.3-.3.5c0 .5-.3.5-.3.8-.3.3 0 .5 0 .8 0 .3 0 .5.3.8 0 .3.3.3.3.5s.3.3.3.5.3.3.5.3c.3.3.3.3.5.3.3 0 .5.3.8.3.3 0 .5 0 .8-.3.3 0 .5-.3.8-.3.3 0 .3-.3.5-.3s.3-.3.3-.5.3-.3.3-.5c0-.3.3-.5.3-.8 0-.3 0-.5-.3-.8 0-.3 0-.5-.3-.5 0-.3-.3-.3-.3-.5s-.3-.3-.5-.3c-.3 0-.5-.3-.8-.3-.3 0-.5 0-.8.3zm551.5-5.6c0 .8-.3 1.6-.8 2.4s-1.1 1.1-1.9 1.1-.8-.3-1.4-.8c-.5-.3-.8-1.1-.8-1.9 0-.8.3-1.6.8-2.4s1.1-1.1 1.9-1.1.8.3 1.4.8c.5.3.8 1.1.8 1.9zm-528.2-12.2c-.8-.8-1.9-1.1-3.5-1.1-1.1 0-1.9.3-2.7.8-.8.5-1.3 1.1-1.9 2.4h-2.7c.8-2.4 1.6-3.5 2.4-4.2.8-.8 2.2-1.1 3.8-1.1 1.6 0 3 .3 3.8 1.1.8.8 1.1 1.9 1.1 3.3v10.6c0 .5 0 1.1.3 1.4.3.3.5.5 1.1.5.3 0 .5 0 .8-.3l.3 1.9c-.8.3-1.4.3-1.9.3-.8 0-1.6-.3-1.9-.5-.5-.5-.5-1.1-.5-1.6-.5.8-1.1 1.4-1.9 1.6-.8.3-1.6.5-2.7.5s-1.9-.3-2.7-.8c-.8-.5-1.1-1.4-1.1-2.7s.3-1.9 1.1-2.7c.8-.8 1.9-1.1 3.5-1.4l4.6-.8v-1.4c-.3-2.4-.3-3.3-1.1-4.1zm-160.8 0c0 .3.3.5.3.8 0 .3-.3.5-.3.8-.3.3-.3.5-.5.8-.3.3-.5.5-.8.5-.5.3-.8.3-1.1.3-.5 0-.8 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.3-.3-.5-.3-.8 0-.3 0-.5.3-.8.3-.3.3-.5.5-.8.3-.3.5-.5.8-.5.3-.3.5-.3 1.1-.3.5 0 .8 0 1.1.3.3 0 .5.3.8.5.3.3.3.5.5.8zm280.6 5.2c0-.5 0-.8-.3-1.1-.3-.3-.3-.5-.5-.8-.3-.3-.5-.3-.8-.5-.3 0-.5-.3-.8-.3H447v-1.9h-4.2v-1.6c-.3.3-.8.5-1.1.5-.5.3-.8.3-1.4.3-.5 0-.8 0-1.4-.3-.3 0-.8-.3-1.1-.5s-.5-.5-.8-.8c-.3-.3-.3-.8-.3-1.1h-1.9v3.5h-5.2v1.9h5.2v7.9c0 .8.3 1.6.8 1.9.5.5 1.1.8 1.9.8s1.6-.3 2.4-.8l.8 1.9c-1.1.5-2.2.8-3.3.8-1.4 0-2.4-.3-3-1.1-.8-.8-1.1-1.9-1.1-3v-9.3h-2.2v-1.9h2.2v-3.5h-3.8v1.6c0 1.1-.3 1.9-.8 2.7-.5.5-1.3.8-2.4.8h-1.1v-7c1.1.3 1.9.3 2.7.3 1.6 0 3.5-.3 5.7-.8h.3v3.5h4.1c-.8-1.1-1.1-2.2-1.1-3.5v-.8l2.7-1.1c0 .3-.3.5-.3.8v.8c0 1.4.5 2.4 1.6 3 1.1.5 2.2.8 3.8.8h.8v1.9h2.2v-3.5h3.8v3.5h5.7v1.9h-5.7v7.3c0 1.1.3 1.9.8 2.4s1.1.8 1.9.8c.5 0 1.1-.3 1.6-.5l.5 1.6c-.8.5-1.9.8-3 .8-1.3 0-2.2-.3-3-1.1-.8-.8-1.1-1.9-1.1-3.5v-7.9h-3.8v4.9c0 1.6.5 3 1.4 3.8.8.8 2.2 1.4 3.5 1.4.8 0 1.6-.3 2.4-.5l.5 1.9c-1.1.3-1.9.5-3 .5-1.9 0-3.5-.5-4.6-1.6-1.4-1.1-1.9-2.7-1.9-4.9v-5.4zm-256.1-5.2c0-.3 0-.5-.3-.8 0-.3-.3-.5-.3-.8-.3-.3-.5-.3-.8-.5-.3 0-.5-.3-1.1-.3-.3 0-.5 0-.8.3-.3 0-.5.3-.8.5-.3.3-.3.5-.3.8 0 .3 0 .5-.3.8 0 .3 0 .5.3.8.3.3.3.5.3.8.3 0 .5.3.8.3.3 0 .5.3.8.3.3 0 .5 0 .8-.3.5 0 .5-.3.8-.3.3-.3.5-.5.5-.8.3-.3.3-.5.3-.8zm-176-2.2c0 .8-.3 1.6-.8 2.4s-1.1 1.1-1.9 1.1-.8-.3-1.4-.8c-.5-.3-.8-1.1-.8-1.9 0-.8.3-1.6.8-2.4s1.1-1.1 1.9-1.1.8.3 1.4.8c.5.3.8 1.1.8 1.9zm458.2-11.1c-12.5-59.2-74.3-103-146.5-103-39.1 0-75.6 11.7-105.6 31.2h-8.7C284.5 345.9 226.1 320 160 320c-70.6 0-128 57.4-128 128s57.4 128 128 128c59.7 0 109.3-41 123.6-96h54.8c12.8 56.9 63.8 99.2 124.6 99.2 69.9 0 128-58.8 128-130.4 0-27.9-9-55.8-26.1-79.6zM160 544c-52.9 0-96-42.9-96-96 0-53.1 42.9-96 96-96 49.4 0 89.7 37.5 95.4 85.6 0 .3-.3.5-.3.8-.3 0-.3.3-.3.5-.3.3-.3.5-.3.8-.3.3-.3.5-.3.8v1.9c0 1.1.3 1.9.8 2.7-.5.3-.5.5-.8.8 0 .3-.3.5-.3.8-.8 1.1-1.6 1.9-2.4 2.7-1.1 1.1-2.2 1.9-3.3 2.7l-2.4-1.6c-.3 1.1-1.1 1.9-1.9 2.7-.5.5-1.3.8-1.9 1.1 0 0-.3 0-.3-.3-.5-.3-1.1-.5-1.6-.8-.5-.3-1.1-.5-1.6-.8h-.3c-1.6-.5-3.5-1.1-5.4-1.1h-.8c-.3 0-.3 0-.5.3-.3 0-.3.3-.3.3-.3 0-.3 0-.3.3l-.8.8c-.3.3-.5.5-.5.8-.3.3-.5.5-.5.8l-.8.8c-.3.3-.3.5-.5.8-.3.3-.3.8-.3 1.1 0 .3-.3.5-.3.8 0 .3 0 .8-.3 1.1 0 .3 0 .8-.3 1.1v1.1c0 .3 0 .8.3 1.1v.5c.3 3.5 1.6 6.5 3.8 8.7 2.2 2.2 5.4 3.5 8.7 3.5 2.7 0 5.2-.8 7.3-2.4 2.2-1.6 3.8-4.1 4.1-6.8v-.3c0-.3 0-.3.3-.3 0-.3.3-.3.3-.3.3 0 .3-.3.5-.3.3 0 .3-.3.5-.3.8-.3 1.9-.5 2.7-.5.5 0 .8.3 1.1.5l.3.3c.3.3.3.5.3.8s.3.5.3.8c0 .3.3.5.3.8 0 .3.3.8.3 1.1 0 .5 0 .8.3 1.1 0 .5 0 .8.3 1.4v1.1c0 .3-.3.8-.3 1.1 0 .3-.3.8-.3 1.1-.3.3-.3.8-.3 1.1-.3.3-.3.5-.5.8-.3.5-.5.8-.8 1.1-.3.3-.5.5-.8.8-.8.5-1.4 1.1-2.2 1.4-.8.3-1.9.5-2.7.5-1.4 0-2.7-.3-3.8-1.1-.3-.3-.5-.3-.8-.5-.3 0-.5-.3-.8-.5-.5-.5-1.1-1.1-1.6-1.9-.5-.8-.8-1.6-1.1-2.7v-1.1c-.3-1.1-.3-1.9-.3-3 0-1.6.3-3 .8-4.4.5-1.4 1.4-2.7 2.2-3.8 0-.3.3-.3.3-.5s.3-.3.3-.5c0 0 .3-.3.3-.3.3-.3.5-.5.8-.8.3-.3.5-.3.8-.5.3 0 .5-.3.8-.3s.8-.3 1.1-.3c.5 0 .8 0 1.4-.3 1.6 0 3.3.3 4.9 1.1h.3c.5.3 1.1.5 1.6.8.5.3 1.1.5 1.6.8h.3c-1.1-.3-1.6-.8-1.9-1.1-.3-.3-.5-.8-.5-1.4 0-.5.3-1.1.5-1.4.3-.3.8-.5 1.4-.5h.3c.3 0 .3 0 .5.3h.5c.3 0 .5.3.8.3.3 0 .5.3.8.3 1.1.5 1.9 1.1 2.7 1.6v-.3c0-.3.3-.5.3-.8.3-.3.3-.5.5-.8.3-.3.3-.5.5-.8.3-.3.5-.5.8-.8.3-.3.5-.5.8-.5.3-.3.5-.3.8-.5.3 0 .5-.3.8-.3.3 0 .5-.3.8-.3h1.3c-3.8-39.1-36.9-69.6-77.3-69.6zm462.9 77.9c0 56.5-45.7 102.2-101.9 102.2-56.5 0-101.9-46-101.9-102.2 0-57.2 45.7-103.8 101.9-103.8 56.5 0 101.9 46.5 101.9 103.8z" />
                                          </svg>
                                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="currentColor" d="M576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM64 144c0 19.9-16.1 36-36 36-9.7 0-18.5-3.9-25-10.1V169c0-6.6-5.4-12-12-12H5c-2.8 0-5 2.2-5 5v68c0 2.8 2.2 5 5 5h6c6.6 0 12-5.4 12-12v-4.9c6.5-6.2 15.3-10.1 25-10.1 19.9 0 36 16.1 36 36 0 19.9-16.1 36-36 36-9.7 0-18.5-3.9-25-10.1V237c0-6.6-5.4-12-12-12H5c-2.8 0-5 2.2-5 5v68c0 2.8 2.2 5 5 5h6c6.6 0 12-5.4 12-12v-4.9c6.5-6.2 15.3-10.1 25-10.1 19.9 0 36 16.1 36 36V400c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V256c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 19.9-16.1 36-36 36-9.7 0-18.5-3.9-25-10.1V277c0-6.6-5.4-12-12-12H5c-2.8 0-5 2.2-5 5v68c0 2.8 2.2 5 5 5h6c6.6 0 12-5.4 12-12v-4.9c6.5-6.2 15.3-10.1 25-10.1 19.9 0 36 16.1 36 36 0 19.9-16.1 36-36 36-9.7 0-18.5-3.9-25-10.1V333c0-6.6-5.4-12-12-12H5c-2.8 0-5 2.2-5 5v68c0 2.8 2.2 5 5 5h6c6.6 0 12-5.4 12-12v-4.9c6.5-6.2 15.3-10.1 25-10.1 19.9 0 36 16.1 36 36v28c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16v32zm448 0c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-32zm-96 0c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-32zm-128 0c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-32zm-128 0c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-32zm128 192c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-32zm-128 0c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-32z" />
                                          </svg>
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="paypal" />
                                      </FormControl>
                                      <FormLabel className="font-normal flex items-center">
                                        PayPal
                                        <svg className="h-6 w-6 text-blue-800 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                          <path fill="currentColor" d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z" />
                                        </svg>
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch("paymentMethod") === "credit-card" && (
                            <div className="space-y-4" id="credit-card-fields">
                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="•••• •••• •••• ••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="expiration"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiration Date</FormLabel>
                                      <FormControl>
                                        <Input placeholder="MM / YY" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="cvv"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVV</FormLabel>
                                      <FormControl>
                                        <Input placeholder="123" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={form.control}
                                name="cardName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name on Card</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </div>
              
              <div className="col-span-1">
                <div className="sticky top-6 bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="border-t border-b border-gray-200 py-4 mb-4">
                    <div className="flex items-start">
                      <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center mr-4">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500">
                          {latestTrip.travelers} {latestTrip.travelers === 1 ? 'traveler' : 'travelers'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(latestTrip.departureDate).toLocaleDateString()} - {new Date(latestTrip.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Plan Cost</span>
                      <span className="text-gray-900">${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Taxes & Fees</span>
                      <span className="text-gray-900">${taxesFees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-3 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Complete Purchase"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/insurance-plans")}
                    >
                      Back to Plans
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-xs text-gray-500">
                    <p>
                      By completing this purchase, you agree to our{" "}
                      <Button variant="link" className="p-0 h-auto text-xs">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-xs">
                        Privacy Policy
                      </Button>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
