import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-selector";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";

export default function PetInsurancePage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <MainLayout>
      
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Pet insurance</span>
                  <span className="block text-primary">for your furry family</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Protect your pets with comprehensive coverage options. Compare plans from top providers and find the perfect fit for your pet's needs.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button 
                      className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10"
                      onClick={() => navigate("/pet-quote")}
                    >
                      Get Quote
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button 
                      variant="secondary"
                      className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10"
                      onClick={() => navigate("/learn-more")}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img 
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Dog and cat together"
            />
          </div>
        </div>
      </div>
      
      {/* Coverage Options */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Coverage Options
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Customize your pet's coverage based on their specific needs
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden shadow-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-5">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Accident & Illness</h3>
                  <CardContent className="p-0 mt-2">
                    <p className="text-base text-gray-500">
                      Comprehensive coverage for unexpected accidents and illnesses, including injuries, emergency care, surgeries, and hospitalization.
                    </p>
                  </CardContent>
                </div>
              </Card>
              
              <Card className="overflow-hidden shadow-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-5">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Wellness Care</h3>
                  <CardContent className="p-0 mt-2">
                    <p className="text-base text-gray-500">
                      Coverage for routine care, including annual check-ups, vaccinations, dental cleanings, and preventive medications.
                    </p>
                  </CardContent>
                </div>
              </Card>
              
              <Card className="overflow-hidden shadow-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-5">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Chronic Conditions</h3>
                  <CardContent className="p-0 mt-2">
                    <p className="text-base text-gray-500">
                      Special coverage for ongoing conditions such as allergies, diabetes, arthritis, and other long-term health issues.
                    </p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Get pet insurance in three simple steps
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white shadow rounded-lg px-6 py-8 relative">
                <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">1</div>
                <h3 className="text-xl font-medium text-gray-900 mt-2">Enter Pet Details</h3>
                <p className="mt-2 text-base text-gray-500">
                  Provide information about your pet, including species, breed, age, and any pre-existing conditions.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8 relative">
                <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">2</div>
                <h3 className="text-xl font-medium text-gray-900 mt-2">Compare Quotes</h3>
                <p className="mt-2 text-base text-gray-500">
                  Review and compare pet insurance quotes from top providers based on your pet's needs and your budget.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8 relative">
                <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">3</div>
                <h3 className="text-xl font-medium text-gray-900 mt-2">Purchase Your Policy</h3>
                <p className="mt-2 text-base text-gray-500">
                  Select the best plan for your pet and complete your purchase with secure online payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to protect your pet?</span>
            <span className="block text-blue-100">Get covered in minutes.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button 
                variant="secondary" 
                onClick={() => navigate("/pet-quote")}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
      
    </MainLayout>
  );
}