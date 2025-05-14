import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-selector";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";

export default function HealthInsurancePage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Health insurance</span>
                  <span className="block text-primary">that puts you first</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Compare health insurance plans from top providers in Colombia and Mexico. Find the perfect coverage for you and your family with plans tailored to your needs.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button 
                      className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10"
                      onClick={() => navigate("/health-quote")}
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
              src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Doctor with patient"
            />
          </div>
        </div>
      </div>
      
      {/* Coverage Options */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Plan Types
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Choose the right health insurance plan for your needs
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
                  <h3 className="text-lg font-medium text-gray-900">Basic Plan</h3>
                  <CardContent className="p-0 mt-2">
                    <p className="text-base text-gray-500">
                      Affordable coverage for essential medical services, including doctor visits, preventive care, and emergency services. Ideal for individuals in good health.
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
                  <h3 className="text-lg font-medium text-gray-900">Family Plan</h3>
                  <CardContent className="p-0 mt-2">
                    <p className="text-base text-gray-500">
                      Comprehensive coverage for families, including pediatric care, maternity services, and preventive care for all family members.
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
                  <h3 className="text-lg font-medium text-gray-900">Premium Plan</h3>
                  <CardContent className="p-0 mt-2">
                    <p className="text-base text-gray-500">
                      Top-tier coverage with low deductibles, comprehensive benefits, and access to specialized care. Includes coverage for prescription drugs, dental, and vision.
                    </p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Key Benefits
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Why choose health insurance through Briki
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Easy Claims</h3>
                <p className="mt-2 text-base text-gray-500">
                  Submit and track claims easily through our online portal or mobile app.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Flexible Payments</h3>
                <p className="mt-2 text-base text-gray-500">
                  Various payment options available, including monthly, quarterly, or annual payments.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Network Access</h3>
                <p className="mt-2 text-base text-gray-500">
                  Access to extensive networks of hospitals, clinics, and specialists throughout Colombia and Mexico.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Digital Services</h3>
                <p className="mt-2 text-base text-gray-500">
                  Access to telemedicine, digital health records, and 24/7 medical hotline for all policyholders.
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
            <span className="block">Ready to secure your health?</span>
            <span className="block text-blue-100">Get covered in minutes.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button 
                variant="secondary" 
                onClick={() => navigate("/health-quote")}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}