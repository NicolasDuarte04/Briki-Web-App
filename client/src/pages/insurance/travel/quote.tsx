import React from "react";
import { useLocation } from "wouter";
import TravelQuoteForm from "../../../components/forms/travel-quote-form";
import { INSURANCE_CATEGORIES } from "../../../../../shared/schema";

export default function TravelQuotePage() {
  const [location] = useLocation();
  
  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold">Travel Insurance Quote</h1>
        <p className="text-muted-foreground">
          Tell us about your trip and get personalized travel insurance options from top providers.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <TravelQuoteForm />
        </div>
        
        <div className="hidden md:block">
          <div className="bg-slate-50 p-6 rounded-lg shadow-sm border space-y-4">
            <h3 className="font-semibold text-lg">Why Choose Briki for Travel Insurance?</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Compare quotes from multiple insurers in seconds</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Instant coverage for your trip with digital policies</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">24/7 emergency assistance worldwide</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Coverage for medical emergencies, trip cancellations, lost baggage, and more</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Simple claims process with fast payouts</p>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Need help?</h4>
              <p className="text-sm text-muted-foreground">
                Our insurance experts are available to assist you with your travel insurance needs.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium">1-800-555-BRIKI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}