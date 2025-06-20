import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { InsurancePlan, Trip } from "@shared/schema";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";

import PaymentSuccess from "@/components/payment-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { Loader2, ShieldCheck, Calendar, Briefcase, HelpCircle } from "lucide-react";
import { FuturisticBackground } from "@/components/ui/futuristic-background";
import { AIAssistant, getCheckoutTips } from "@/components/ui/ai-assistant";
import { AuthenticatedLayout } from "@/components/layout";

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
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Initialize Stripe only when a publishable key is configured
// The Stripe SDK throws an error that surfaces as `pk.match` when the key is undefined.
// To prevent the entire frontend from crashing in development environments where
// the `VITE_STRIPE_PUBLIC_KEY` env variable may be missing, we guard the call.
const stripePromise = (import.meta as any).env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe((import.meta as any).env.VITE_STRIPE_PUBLIC_KEY as string)
  // When no key is set we return `null` so that the checkout flow is disabled instead of crashing.
  : null;

// Stripe Checkout Form Component
function StripeCheckoutForm({ 
  totalAmount, 
  planId, 
  onSuccess, 
  tripId,
  form
}: { 
  totalAmount: number; 
  planId: number; 
  onSuccess: () => void;
  tripId: number;
  form: any; // Using 'any' for simplicity, in a real app would properly type this
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment system not ready",
        description: "Please wait a moment and try again",
        variant: "default",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Show processing message
      toast({
        title: "Processing payment",
        description: "Please do not close this window",
        duration: 6000,
      });

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/checkout-success",
          payment_method_data: {
            billing_details: {
              name: form.getValues("firstName") + " " + form.getValues("lastName"),
              email: form.getValues("email"),
              phone: form.getValues("phone"),
              address: {
                line1: form.getValues("address"),
                city: form.getValues("city"),
                state: form.getValues("state"),
                postal_code: form.getValues("zip"),
                country: form.getValues("country"),
              }
            }
          }
        },
        redirect: "if_required",
      });

      if (error) {
        // Handle specific error cases
        if (error.type === 'card_error' || error.type === 'validation_error') {
          toast({
            title: "Payment failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "An unexpected error occurred",
            description: "Please try again or use a different payment method",
            variant: "destructive",
          });
        }
        setIsProcessing(false);
      } else {
        // Payment succeeded!
        toast({
          title: "Payment successful!",
          description: "Your order has been processed",
          variant: "default",
        });

        // Create an order record
        onSuccess();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment processing error",
        description: err.message || "An unknown error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${totalAmount}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { planId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);

  // Fetch selected insurance plan
  const { data: plan, isLoading: planLoading } = useQuery<InsurancePlan>({
    queryKey: [`/api/insurance-plans/${planId}`],
    enabled: !!planId,
  });

  // Fetch latest trip data
  const { data: trips, isLoading: tripsLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
    enabled: !!user,
    initialData: []
  });

  // Get the most recent trip
  const tripArray = Array.isArray(trips) ? trips : [];
  const latestTrip = tripArray.length > 0 ? tripArray[tripArray.length - 1] : null;

  // Log trip data for debugging
  useEffect(() => {
    console.log("Current user:", user);
    console.log("All trips:", trips);
    console.log("Latest trip:", latestTrip);
    console.log("Selected plan:", plan);
  }, [user, trips, latestTrip, plan]);

  // Calculate total amount including taxes
  const basePrice = plan?.basePrice || 0;
  const taxesFees = Math.round(basePrice * 0.0825); // 8.25% tax
  const totalAmount = basePrice + taxesFees;

  // Create payment intent when plan and trip are available
  useEffect(() => {
    async function createPaymentIntent() {
      if (!planId || !user || !latestTrip || isLoadingPaymentIntent) return;

      try {
        setIsLoadingPaymentIntent(true);

        const res = await apiRequest("POST", "/api/create-payment-intent", {
          planId: parseInt(planId, 10),
          amount: totalAmount
        });

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Error setting up payment",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoadingPaymentIntent(false);
      }
    }

    if (plan && latestTrip && !clientSecret && planId) {
      createPaymentIntent();
    }
  }, [planId, plan, latestTrip, user, totalAmount, toast, clientSecret, isLoadingPaymentIntent]);

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
    },
  });

  function handlePaymentSuccess() {
    createOrderMutation.mutate();
  }

  if (showSuccess) {
    return <PaymentSuccess onClose={() => navigate("/")} />;
  }

  return (
    <AuthenticatedLayout>
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FuturisticBackground particleCount={40} interactive={false} />
      </div>

      <div className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold section-header">Checkout</h1>
            <p className="mt-2 text-lg text-foreground/70">Complete your purchase to secure your travel insurance</p>
          </motion.div>

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
                  <form className="space-y-6">
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
                                  <Input {...field} />
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
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 pb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Address</h2>
                        <div className="space-y-4">
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

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="zip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP/Postal Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <Select 
                                    value={field.value} 
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select country" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="us">United States</SelectItem>
                                      <SelectItem value="ca">Canada</SelectItem>
                                      <SelectItem value="uk">United Kingdom</SelectItem>
                                      <SelectItem value="au">Australia</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </Form>

                <Card className="mt-6">
                  <CardContent className="pt-6 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                    {clientSecret && planId ? (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripeCheckoutForm 
                          totalAmount={totalAmount} 
                          planId={parseInt(planId!, 10)} 
                          onSuccess={handlePaymentSuccess}
                          tripId={latestTrip?.id || 0}
                          form={form}
                        />
                      </Elements>
                    ) : (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-6 space-y-6">
                  <Card>
                    <CardContent className="pt-6 pb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                      <div className="space-y-4">
                        <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                          <div>
                            <h3 className="font-medium">{plan?.name}</h3>
                            <p className="text-sm text-gray-600">{plan?.description}</p>
                          </div>
                          <span className="font-medium">${plan?.basePrice}</span>
                        </div>

                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Taxes & Fees</span>
                          <span className="font-medium">${taxesFees}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="font-semibold text-lg">Total</span>
                          <span className="font-bold text-lg">${totalAmount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 pb-6">
                      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        Coverage Details
                      </h2>

                      <div className="space-y-4 text-sm">
                        {plan?.features?.map((highlight: string, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="text-primary">•</div>
                            <div>{highlight}</div>
                          </div>
                        ))}

                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h3 className="font-medium flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            Travel Dates
                          </h3>
                          <p className="text-gray-700">
                            {latestTrip?.startDate && new Date(latestTrip.startDate).toLocaleDateString()} to {latestTrip?.endDate && new Date(latestTrip.endDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium flex items-center gap-2 mb-2">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            Destination
                          </h3>
                          <p className="text-gray-700">{latestTrip?.destination}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 pb-6">
                      <div className="flex gap-3 items-start">
                        <div className="shrink-0">
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Need Help?</h3>
                          <p className="text-sm text-gray-600">Our support team is available 24/7. Contact us at support@briki.travel or call 1-800-BRIKI-HELP.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <AIAssistant
                      tips={getCheckoutTips()}
                      helpMode={true}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}