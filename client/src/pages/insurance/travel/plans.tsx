import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { QuoteSummary } from "../../../components/quote-summary";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { useQuoteStore } from "../../../store/quote-store";
import { TravelPlan, INSURANCE_CATEGORIES } from "../../../../../shared/schema";
import { formatPrice } from "../../../lib/utils";

// Sample travel plans for demonstration
const SAMPLE_TRAVEL_PLANS: TravelPlan[] = [
  {
    planId: "tp-basic-123",
    name: "Basic Coverage",
    basePrice: 59.99,
    coverageAmount: 50000,
    category: INSURANCE_CATEGORIES.TRAVEL,
    destinations: ["All destinations"],
    coversMedical: true,
    coversCancellation: false,
    coversValuables: false,
    maxTripDuration: 30,
    provider: "SafeTravel Insurance",
    features: [
      "Emergency medical coverage up to $50,000",
      "24/7 travel assistance",
      "Emergency evacuation",
      "Trip delay coverage ($200)",
    ],
    description: "Affordable coverage for essential travel protection.",
    rating: "4.2"
  },
  {
    planId: "tp-standard-456",
    name: "Standard Coverage",
    basePrice: 89.99,
    coverageAmount: 100000,
    category: INSURANCE_CATEGORIES.TRAVEL,
    destinations: ["All destinations"],
    coversMedical: true,
    coversCancellation: true,
    coversValuables: false,
    maxTripDuration: 60,
    provider: "GlobalGuard",
    features: [
      "Emergency medical coverage up to $100,000",
      "Trip cancellation insurance up to $2,500",
      "Lost baggage compensation up to $1,000",
      "Travel delay coverage ($300)",
      "24/7 travel assistance",
      "Emergency evacuation",
    ],
    description: "Comprehensive coverage for worry-free travel.",
    rating: "4.5"
  },
  {
    planId: "tp-premium-789",
    name: "Premium Coverage",
    basePrice: 149.99,
    coverageAmount: 250000,
    category: INSURANCE_CATEGORIES.TRAVEL,
    destinations: ["All destinations"],
    coversMedical: true,
    coversCancellation: true,
    coversValuables: true,
    maxTripDuration: 90,
    provider: "VoyageElite",
    features: [
      "Emergency medical coverage up to $250,000",
      "Trip cancellation insurance up to $5,000",
      "Lost baggage compensation up to $2,500",
      "Valuables and electronics coverage up to $1,500",
      "Travel delay coverage ($500)",
      "24/7 premium travel assistance with concierge",
      "Emergency evacuation and repatriation",
      "Rental car damage coverage",
      "Adventure activities coverage",
    ],
    description: "Elite protection for discerning travelers.",
    rating: "4.8"
  }
];

export default function TravelPlansPage() {
  const [, navigate] = useLocation();
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { submittedQuotes } = useQuoteStore();
  
  // Simulate fetching and filtering plans based on the submitted quote
  useEffect(() => {
    setLoading(true);
    
    // Check if there's a submitted travel quote
    const travelQuotes = submittedQuotes.filter(
      q => q.category === INSURANCE_CATEGORIES.TRAVEL
    );
    
    if (travelQuotes.length === 0) {
      // If no travel quote found, navigate back to the quote form
      navigate("/insurance/travel/quote");
      return;
    }
    
    // Simulate API call to fetch plans
    const timer = setTimeout(() => {
      // Filter plans based on quote parameters
      const mostRecentQuote = travelQuotes[travelQuotes.length - 1];
      
      // Apply filtering logic
      // This is just a simple example - a real implementation would have more sophisticated filtering
      let filteredPlans = SAMPLE_TRAVEL_PLANS;
      
      // Price calculation based on travelers and trip duration
      filteredPlans = filteredPlans.map(plan => {
        // Calculate days between departure and return
        const departureDate = new Date(mostRecentQuote.departureDate);
        const returnDate = new Date(mostRecentQuote.returnDate);
        const diffTime = Math.abs(returnDate.getTime() - departureDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate price based on trip duration and travelers
        const durationFactor = diffDays / 7; // Per week price factor
        const travelerMultiplier = mostRecentQuote.travelers;
        
        // Calculate adjusted price
        const adjustedPrice = plan.basePrice * durationFactor * travelerMultiplier;
        
        // Return updated plan with calculated price
        return {
          ...plan,
          calculatedPrice: adjustedPrice
        };
      });
      
      setPlans(filteredPlans);
      setLoading(false);
    }, 1000); // 1 second delay to simulate API call
    
    return () => clearTimeout(timer);
  }, [submittedQuotes, navigate]);

  // Handle selection of a plan
  const handleSelectPlan = (plan: TravelPlan) => {
    // In a real app, this would save the selection to state or navigate to a checkout page
    console.log("Selected plan:", plan);
    navigate("/insurance/travel/checkout");
  };

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold">Recommended Travel Insurance Plans</h1>
        <p className="text-muted-foreground">
          Based on your trip details, we've found these insurance options for you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-4">
            <QuoteSummary />
            
            <div className="mt-4">
              <Button 
                onClick={() => navigate("/insurance/travel/quote")} 
                variant="outline" 
                className="w-full"
              >
                Edit Quote
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-7 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 bg-slate-200 rounded w-full"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => (
                <Card key={plan.planId} className="overflow-hidden">
                  <div className={
                    plan.name.includes("Premium") 
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 h-2" 
                      : plan.name.includes("Standard")
                        ? "bg-gradient-to-r from-blue-500 to-blue-400 h-2"
                        : "bg-gradient-to-r from-blue-400 to-blue-300 h-2"
                  }></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">by {plan.provider}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {formatPrice(plan.calculatedPrice || plan.basePrice)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total price</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm mb-4">{plan.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className={plan.coversMedical ? "text-green-500" : "text-red-400"}>
                          {plan.coversMedical ? "✓" : "✗"}
                        </div>
                        <span className="text-sm">Medical Coverage</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={plan.coversCancellation ? "text-green-500" : "text-red-400"}>
                          {plan.coversCancellation ? "✓" : "✗"}
                        </div>
                        <span className="text-sm">Trip Cancellation</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={plan.coversValuables ? "text-green-500" : "text-red-400"}>
                          {plan.coversValuables ? "✓" : "✗"}
                        </div>
                        <span className="text-sm">Valuables Protection</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-green-500">✓</div>
                        <span className="text-sm">24/7 Support</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Coverage Details</h4>
                      <ul className="text-sm space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <div className="w-full flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                      <div className="flex items-center text-sm">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(parseFloat(plan.rating || "0")) ? "text-yellow-400" : "text-gray-300"}`}
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1">{plan.rating}/5.0</span>
                      </div>
                      
                      <Button 
                        onClick={() => handleSelectPlan(plan)}
                        variant={plan.name.includes("Premium") ? "gradient" : "default"}
                        className={plan.name.includes("Premium") 
                          ? "sm:px-8" 
                          : ""
                        }
                      >
                        {plan.name.includes("Premium") ? "Select Premium Plan" : "Select This Plan"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}