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
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <FuturisticBackground particleCount={30} interactive={false} />
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
      
      {/* Features - Futuristic Design */}
      <div className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 z-0 opacity-30">
            <FuturisticBackground particleCount={60} interactive={false} />
          </div>
          
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl section-header">
                AI-Powered Insurance Technology
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70 sm:mt-4">
                Experience the future of insurance with our innovative platform features
              </p>
            </motion.div>
          </div>
          
          <div className="mt-16 relative z-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl border border-border p-6 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Decorative gradient background */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-5 shadow-md">
                    <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold section-header">AI Risk Analysis</h3>
                  <p className="mt-3 text-foreground/70">
                    Our AI technology analyzes thousands of risk factors in real-time to recommend the perfect coverage.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl border border-border p-6 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Decorative gradient background */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-green-500/10 blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white mb-5 shadow-md">
                    <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold section-header">Smart Pricing</h3>
                  <p className="mt-3 text-foreground/70">
                    Dynamic pricing algorithms find the optimal balance between comprehensive coverage and affordability.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl border border-border p-6 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Decorative gradient background */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-5 shadow-md">
                    <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold section-header">Data Visualization</h3>
                  <p className="mt-3 text-foreground/70">
                    Interactive visualizations help you understand coverage details and compare options with clarity.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl border border-border p-6 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Decorative gradient background */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-orange-500/10 blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white mb-5 shadow-md">
                    <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold section-header">Tailored Coverage</h3>
                  <p className="mt-3 text-foreground/70">
                    Modular insurance components that adapt to your specific needs across multiple categories.
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Cross-category coverage bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-16 p-8 rounded-xl border border-border backdrop-blur-sm bg-card/50"
            >
              <h3 className="text-xl font-bold section-header mb-6">Cross-Category Coverage Analysis</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4">
                    <FuturisticTravelIcon className="w-full h-full" />
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-blue-500">92% Coverage</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4">
                    <FuturisticAutoIcon className="w-full h-full" />
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-green-500">85% Coverage</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4">
                    <FuturisticPetIcon className="w-full h-full" />
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "78%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-amber-500">78% Coverage</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4">
                    <FuturisticHealthIcon className="w-full h-full" />
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      transition={{ duration: 1, delay: 0.9 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-red-500">95% Coverage</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* CTA Section - Futuristic Style */}
      <div className="bg-gradient-to-r from-primary/80 to-blue-700/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 z-0 opacity-20">
            <FuturisticBackground particleCount={40} interactive={false} />
          </div>
          
          <div className="lg:flex lg:items-center lg:justify-between relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">AI-Powered Protection</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                  For Everything That Matters
                </span>
              </h2>
              <p className="mt-3 text-lg text-blue-100">
                Experience the future of insurance across multiple categories with our cutting-edge platform.
              </p>
            </motion.div>
            
            <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:ml-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleGetStarted}
                    className="briki-button w-full"
                    variant="default"
                  >
                    Get Started
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="secondary"
                    className="briki-button-secondary w-full border border-blue-100 text-blue-100"
                    onClick={() => navigate("/learn-more")}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}