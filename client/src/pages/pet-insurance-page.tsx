import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-selector";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { MinimalPetIcon } from "@/components/icons/minimal-icons";

export default function PetInsurancePage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-950/50 dark:to-black/20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-teal-300 dark:bg-teal-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-40 -right-20 w-96 h-96 bg-violet-300 dark:bg-violet-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10"
                >
                  <div className="lg:flex-1">
                    <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                      <span className="block text-foreground">Pet insurance</span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-400 dark:to-green-400">for your furry family</span>
                    </h1>
                    <p className="mt-3 text-base text-foreground/70 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                      Protect your pets with comprehensive coverage options. Compare plans from top providers and find the perfect fit for your pet's needs.
                    </p>
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <Button 
                          className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white border-0"
                          onClick={() => navigate("/pet-quote")}
                        >
                          Get Quote
                        </Button>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Button 
                          variant="outline"
                          className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10 border-teal-200 dark:border-teal-900 text-teal-700 dark:text-teal-300"
                          onClick={() => navigate("/learn-more")}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-shrink-0 flex items-center justify-center"
                  >
                    <div className="w-48 h-48 lg:w-64 lg:h-64 relative">
                      <MinimalPetIcon className="w-full h-full" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Coverage Options */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-400 dark:to-green-400 sm:text-4xl">
              Coverage Options
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70 sm:mt-4">
              Customize your pet's coverage based on their specific needs
            </p>
          </motion.div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="overflow-hidden shadow-lg bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white mb-5">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Accident & Illness</h3>
                    <CardContent className="p-0 mt-2">
                      <p className="text-base text-foreground/70">
                        Comprehensive coverage for unexpected accidents and illnesses, including injuries, emergency care, surgeries, and hospitalization.
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="overflow-hidden shadow-lg bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-5">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Wellness Care</h3>
                    <CardContent className="p-0 mt-2">
                      <p className="text-base text-foreground/70">
                        Coverage for routine care, including annual check-ups, vaccinations, dental cleanings, and preventive medications.
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="overflow-hidden shadow-lg bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white mb-5">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Chronic Conditions</h3>
                    <CardContent className="p-0 mt-2">
                      <p className="text-base text-foreground/70">
                        Special coverage for ongoing conditions such as allergies, diabetes, arthritis, and other long-term health issues.
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="py-16 relative">
        {/* Background gradient element */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/30 to-indigo-50/30 dark:from-teal-950/30 dark:to-indigo-950/30 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-400 dark:to-green-400 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Get pet insurance in three simple steps
            </p>
          </motion.div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-lg rounded-2xl px-6 py-8 relative"
              >
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">1</div>
                <h3 className="text-xl font-medium text-foreground mt-2">Enter Pet Details</h3>
                <p className="mt-2 text-base text-foreground/70">
                  Provide information about your pet, including species, breed, age, and any pre-existing conditions.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-lg rounded-2xl px-6 py-8 relative"
              >
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">2</div>
                <h3 className="text-xl font-medium text-foreground mt-2">Compare Quotes</h3>
                <p className="mt-2 text-base text-foreground/70">
                  Review and compare pet insurance quotes from top providers based on your pet's needs and your budget.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-lg rounded-2xl px-6 py-8 relative"
              >
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">3</div>
                <h3 className="text-xl font-medium text-foreground mt-2">Purchase Your Policy</h3>
                <p className="mt-2 text-base text-foreground/70">
                  Select the best plan for your pet and complete your purchase with secure online payment.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative py-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-teal-500/90 dark:from-green-600/90 dark:to-teal-600/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-40 -right-20 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:flex lg:items-center lg:justify-between"
          >
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to protect your pet?</span>
                <span className="block text-teal-100">Get covered in minutes.</span>
              </h2>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <motion.div 
                className="inline-flex rounded-md shadow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  onClick={() => navigate("/pet-quote")}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-teal-50 shadow-lg"
                >
                  Get Quote Now
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}