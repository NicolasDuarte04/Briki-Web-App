import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/language-selector";
import { FadeIn, SlideIn, StaggerChildren } from "@/components/ui/transition-effect";
import PopularPlansSlider from "@/components/popular-plans-slider";
import RecentlyViewedPlans from "@/components/recently-viewed-plans";
import { FuturisticBackground } from "@/components/ui/futuristic-background";
import { AIAssistant, getTravelInsuranceTips, getAutoInsuranceTips, getHealthInsuranceTips, getPetInsuranceTips } from "@/components/ui/ai-assistant";
import { ComparisonChart, RadarChart, CoverageComparison } from "@/components/ui/data-visualization";
import { 
  FuturisticTravelIcon, 
  FuturisticAutoIcon, 
  FuturisticPetIcon, 
  FuturisticHealthIcon 
} from "@/components/icons/futuristic-icons";
import { popularPlans } from "@/data/popular-plans";

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  // Featured destinations data
  const destinations = [
    {
      id: 1,
      name: "Italy",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: "4.8",
      travelers: "300+"
    },
    {
      id: 2,
      name: "Bali",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: "4.9",
      travelers: "450+"
    },
    {
      id: 3,
      name: "Thailand",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: "4.7",
      travelers: "275+"
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate("/trip-info");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section - Futuristic AI-driven design */}
      <div className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <FuturisticBackground particleCount={80} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 pt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-7xl section-header">
                  <span className="block mb-2">AI-Powered</span>
                  <span className="block">Insurance Platform</span>
                </h1>
                
                <motion.p 
                  className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-foreground/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  Compare and analyze insurance options across multiple categories using our advanced AI technology. Get personalized recommendations based on your unique needs and preferences.
                </motion.p>
                
                <motion.div 
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
                >
                  <motion.div 
                    className="rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10 briki-button"
                      onClick={handleGetStarted}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-3 sm:mt-0 sm:ml-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="secondary"
                      className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10 briki-button-secondary"
                      onClick={() => navigate("/learn-more")}
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.7, type: "spring" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Insurance comparison visualization */}
              <div className="max-w-md w-full ai-data-visual p-6 backdrop-blur-md bg-opacity-30">
                <h3 className="text-lg font-semibold text-foreground mb-4">Smart Insurance Comparison</h3>
                
                <div className="space-y-4">
                  {/* Coverage bars with animated growth */}
                  {['Coverage', 'Price', 'Benefits', 'Claims Process'].map((category, i) => (
                    <motion.div 
                      key={category}
                      className="space-y-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/80">{category}</span>
                        <span className="text-sm font-medium text-primary">
                          {Math.floor(80 - (i * 10))}%
                        </span>
                      </div>
                      
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${80 - (i * 10)}%` }}
                          transition={{ duration: 0.8, delay: 1.0 + (i * 0.1), type: "spring" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Animated data dots */}
                  <div className="absolute">
                    <motion.div 
                      className="ai-data-particle" 
                      style={{ top: '20%', left: '10%' }}
                      animate={{ 
                        x: [0, 10, 5, 0],
                        y: [0, -10, 5, 0],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 4,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div 
                      className="ai-data-particle" 
                      style={{ top: '70%', right: '20%' }}
                      animate={{ 
                        x: [0, -15, -5, 0],
                        y: [0, 5, 15, 0],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Insurance Categories - Futuristic Design */}
      <div className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 z-0 opacity-30">
            <DataVisualizationBackground />
          </div>
          
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl section-header">
                AI-Powered Insurance Categories
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70 sm:mt-4">
                Explore different insurance types optimized using advanced analytics and risk assessment
              </p>
            </motion.div>
          </div>
          
          <div className="mt-16 relative z-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Travel Insurance - Futuristic Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 30px rgba(59, 130, 246, 0.2)",
                }}
                onClick={() => navigate("/insurance-plans")} 
                className="cursor-pointer group"
                role="button"
                aria-label="View travel insurance plans"
              >
                <div className="h-full bg-card rounded-xl overflow-hidden border border-border p-6 transition-all duration-300 briki-card">
                  <div className="h-32 flex items-center justify-center mb-6">
                    <FuturisticTravelIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <h3 className="text-xl font-bold section-header">{t('travelInsurance')}</h3>
                      <p className="mt-2 text-foreground/70">AI-powered protection for your journeys, with real-time risk assessment and emergency assistance.</p>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <motion.div
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium transition-colors hover:bg-primary/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore Plans
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Auto Insurance - Futuristic Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 30px rgba(16, 185, 129, 0.2)",
                }}
                onClick={() => navigate("/auto-insurance")} 
                className="cursor-pointer group"
                role="button"
                aria-label="View auto insurance plans"
              >
                <div className="h-full bg-card rounded-xl overflow-hidden border border-border p-6 transition-all duration-300 briki-card">
                  <div className="h-32 flex items-center justify-center mb-6">
                    <FuturisticAutoIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <h3 className="text-xl font-bold section-header">{t('autoInsurance')}</h3>
                      <p className="mt-2 text-foreground/70">Smart coverage solutions that adapt to your driving patterns with predictive risk analysis.</p>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <motion.div
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium transition-colors hover:bg-green-500/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore Plans
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Pet Insurance - Futuristic Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 30px rgba(245, 158, 11, 0.2)",
                }}
                onClick={() => navigate("/pet-insurance")} 
                className="cursor-pointer group"
                role="button"
                aria-label="View pet insurance plans"
              >
                <div className="h-full bg-card rounded-xl overflow-hidden border border-border p-6 transition-all duration-300 briki-card">
                  <div className="h-32 flex items-center justify-center mb-6">
                    <FuturisticPetIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <h3 className="text-xl font-bold section-header">{t('petInsurance')}</h3>
                      <p className="mt-2 text-foreground/70">Advanced pet health coverage with breed-specific analysis and preventative care recommendations.</p>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <motion.div
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 text-sm font-medium transition-colors hover:bg-amber-500/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore Plans
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Health Insurance - Futuristic Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 30px rgba(239, 68, 68, 0.2)",
                }}
                onClick={() => navigate("/health-insurance")} 
                className="cursor-pointer group"
                role="button"
                aria-label="View health insurance plans"
              >
                <div className="h-full bg-card rounded-xl overflow-hidden border border-border p-6 transition-all duration-300 briki-card">
                  <div className="h-32 flex items-center justify-center mb-6">
                    <FuturisticHealthIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <h3 className="text-xl font-bold section-header">{t('healthInsurance')}</h3>
                      <p className="mt-2 text-foreground/70">Personalized health protection using AI to match your medical needs with optimal coverage solutions.</p>
                    </div>
                    
                    <div className="pt-4 flex justify-center">
                      <motion.div
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium transition-colors hover:bg-red-500/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore Plans
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Plans - Futuristic Design */}
      <div className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl section-header">
                AI-Recommended Insurance Plans
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70 sm:mt-4">
                Personalized recommendations based on comprehensive risk analysis and user data
              </p>
            </motion.div>
          </div>
          
          {/* Data visualization comparing plans */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ComparisonChart 
                title="Coverage Comparison"
                datasets={[
                  {
                    name: "Premium Plan",
                    color: "#3B82F6",
                    points: [
                      { label: "Medical", value: 95 },
                      { label: "Evacuation", value: 90 },
                      { label: "Trip Cancel", value: 85 },
                      { label: "Baggage", value: 80 },
                    ]
                  },
                  {
                    name: "Standard Plan",
                    color: "#10B981",
                    points: [
                      { label: "Medical", value: 70 },
                      { label: "Evacuation", value: 65 },
                      { label: "Trip Cancel", value: 75 },
                      { label: "Baggage", value: 60 },
                    ]
                  },
                  {
                    name: "Basic Plan",
                    color: "#F59E0B",
                    points: [
                      { label: "Medical", value: 50 },
                      { label: "Evacuation", value: 40 },
                      { label: "Trip Cancel", value: 55 },
                      { label: "Baggage", value: 45 },
                    ]
                  }
                ]}
                height={300}
                animated={true}
              />
              
              <RadarChart
                title="Risk Protection Analysis"
                categories={["Medical", "Evacuation", "Delays", "Cancellation", "Lost Items", "Liability"]}
                datasets={[
                  {
                    name: "Premium Protection",
                    color: "#3B82F6",
                    values: [90, 95, 85, 90, 80, 85]
                  },
                  {
                    name: "Standard Protection",
                    color: "#10B981",
                    values: [70, 75, 65, 80, 60, 65]
                  }
                ]}
                size={300}
                animated={true}
              />
            </div>
          </motion.div>
          
          <div className="rounded-xl overflow-hidden border border-border backdrop-blur-sm bg-card/50 p-6">
            <div className="mb-8">
              <h3 className="text-xl font-bold section-header mb-2">Trending Insurance Plans</h3>
              <p className="text-foreground/70">Our most popular plans based on real user selections</p>
            </div>
            
            <PopularPlansSlider plans={popularPlans} />
          </div>

          <div className="mt-12 rounded-xl overflow-hidden border border-border backdrop-blur-sm bg-card/50 p-6">
            <div className="mb-8">
              <h3 className="text-xl font-bold section-header mb-2">Recently Viewed Plans</h3>
              <p className="text-foreground/70">Continue exploring plans you've viewed</p>
            </div>
            
            <RecentlyViewedPlans category="travel" />
          </div>
          
          {/* AI Assistant */}
          <AIAssistant tips={getTravelInsuranceTips()} position="bottom-right" />
        </div>
      </div>
      
      {/* Features */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why choose Briki for all your insurance needs?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We've got you covered with the best insurance options across multiple categories
            </p>
          </div>
          
          <div className="mt-12">
            <StaggerChildren className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Compare Plans</h3>
                <p className="mt-2 text-base text-gray-500">
                  Easily compare plans from multiple providers to find the best coverage at the best price.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Comprehensive Coverage</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get coverage for all your needs with plans tailored to your specific requirements across all categories.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Fast & Simple</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get insurance quotes in minutes, not hours. Our simple process makes finding the right coverage quick and easy.
                </p>
              </div>
              
              <div className="bg-white shadow rounded-lg px-6 py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-5">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">24/7 Support</h3>
                <p className="mt-2 text-base text-gray-500">
                  Our support team is available around the clock to assist you with any questions or claims across all insurance types.
                </p>
              </div>
            </StaggerChildren>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to secure what matters most?</span>
              <span className="block text-blue-100">Compare and save across all insurance types.</span>
            </h2>
          </FadeIn>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <FadeIn delay={0.2}>
              <div className="inline-flex rounded-md shadow">
                <Button 
                  variant="secondary" 
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                >
                  Get Started
                </Button>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Button
                  variant="default"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/learn-more")}
                >
                  Learn more
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}