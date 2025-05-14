import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/language-selector";
import { FadeIn, SlideIn, StaggerChildren } from "@/components/ui/transition-effect";
import PopularPlansSlider from "@/components/popular-plans-slider";
import RecentlyViewedPlans from "@/components/recently-viewed-plans";
import AnimatedBackground from "@/components/animated-background";
import GlassCard from "@/components/glass-card";
import GradientButton from "@/components/gradient-button";
import FeaturesGrid from "@/components/features-grid";
import CTASection from "@/components/cta-section";
import BetaNotice from "@/components/beta-notice";
import Footer from "@/components/footer";
import { AIAssistant, getTravelInsuranceTips, getAutoInsuranceTips, getHealthInsuranceTips, getPetInsuranceTips } from "@/components/ui/ai-assistant";
import { ComparisonChart, RadarChart, CoverageComparison } from "@/components/ui/data-visualization";
import { 
  FuturisticTravelIcon, 
  FuturisticAutoIcon, 
  FuturisticPetIcon, 
  FuturisticHealthIcon 
} from "@/components/icons/futuristic-icons";
import { popularPlans } from "@/data/popular-plans";
import { ArrowRight, Shield, ShieldCheck, PieChart, Clock, Star, Sparkles, TrendingUp, Users, Check } from "lucide-react";

export default function HomePage() {
  const [location, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [showBeta, setShowBeta] = useState(true);
  
  // Add debugging information
  console.log("HomePage mounted, current location:", location);
  console.log("User data in home page:", user);
  
  // Monitor component mounting and user data changes
  useEffect(() => {
    console.log("HomePage useEffect running");
    console.log("Auth state in HomePage:", { user, isLoading });
  }, [user, isLoading, navigate, location]);

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

  const features = [
    {
      title: "Real-time Risk Assessment",
      description: "Get immediate analysis of potential risks based on your destination and travel plans",
      icon: <Shield className="w-8 h-8 text-primary/80" />
    },
    {
      title: "AI-Powered Recommendations",
      description: "Receive personalized insurance recommendations tailored to your specific needs",
      icon: <Sparkles className="w-8 h-8 text-primary/80" />
    },
    {
      title: "Dynamic Price Comparison",
      description: "Compare premiums and coverage across multiple providers in real-time",
      icon: <PieChart className="w-8 h-8 text-primary/80" />
    },
    {
      title: "Instant Policy Issuance",
      description: "Complete your purchase and receive policy documents immediately",
      icon: <Clock className="w-8 h-8 text-primary/80" />
    }
  ];

  const testimonials = [
    {
      quote: "Briki helped me find the perfect travel insurance for my backpacking trip across Europe. The AI recommendations were spot on!",
      author: "Sophia R.",
      location: "Mexico City",
      rating: 5,
    },
    {
      quote: "I needed auto insurance quickly after moving to a new city. Briki compared all the options and found me great coverage at an affordable price.",
      author: "Miguel L.",
      location: "Bogotá",
      rating: 5,
    },
    {
      quote: "The pet insurance options on Briki saved me when my dog needed emergency surgery. I'm so glad I found this platform!",
      author: "Ana M.",
      location: "Medellín",
      rating: 5,
    }
  ];

  const categories = [
    {
      id: 'travel',
      title: t('travelInsurance'),
      path: '/insurance-plans',
      description: "AI-powered protection for your journeys, with real-time risk assessment and emergency assistance.",
      icon: <FuturisticTravelIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />,
      color: "blue"
    },
    {
      id: 'auto',
      title: t('autoInsurance'),
      path: '/auto-insurance',
      description: "Smart coverage solutions that adapt to your driving patterns with predictive risk analysis.",
      icon: <FuturisticAutoIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />,
      color: "green"
    },
    {
      id: 'pet',
      title: t('petInsurance'),
      path: '/pet-insurance',
      description: "Innovative protection for your pets with customized coverage and quick claim processing.",
      icon: <FuturisticPetIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />,
      color: "amber"
    },
    {
      id: 'health',
      title: t('healthInsurance'),
      path: '/health-insurance',
      description: "Advanced health coverage with AI-driven health assessment and personalized plans.",
      icon: <FuturisticHealthIcon className="w-28 h-28 transition-transform duration-500 group-hover:scale-110" />,
      color: "rose"
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
    <div className="min-h-screen flex flex-col relative">      
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <AnimatedBackground intensity="high" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 drop-shadow-sm">
                <span className="block mb-2">AI-Powered</span>
                <span className="block">Insurance Platform</span>
              </h1>
              
              <motion.p 
                className="mt-6 text-base sm:text-lg sm:max-w-xl md:text-xl text-foreground/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Compare and analyze insurance options across multiple categories using our advanced AI technology. Get personalized recommendations based on your unique needs.
              </motion.p>
              
              <motion.div 
                className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
              >
                <GradientButton 
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 md:py-4 text-lg shadow-lg"
                  onClick={handleGetStarted}
                  gradientFrom="from-indigo-600"
                  gradientTo="to-blue-500"
                  icon={<Sparkles className="h-5 w-5" />}
                  iconPosition="left"
                >
                  Get Started
                </GradientButton>
                
                <GradientButton 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 md:py-4 text-lg mt-3 sm:mt-0"
                  onClick={() => navigate("/learn-more")}
                  gradientFrom="from-blue-500"
                  gradientTo="to-blue-500"
                >
                  Learn More
                </GradientButton>
              </motion.div>
              
              {/* Company button */}
              <motion.div 
                className="mt-6 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Button 
                  variant="ghost" 
                  className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/50 transition-all"
                  onClick={() => navigate("/company")}
                >
                  <span>For Insurance Companies</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Hero visual element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex justify-center lg:justify-end"
            >
              <GlassCard 
                variant="blue"
                size="lg"
                className="max-w-md w-full"
                hover="glow"
                motionProps={{
                  whileHover: { y: -5 },
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <h3 className="text-lg font-semibold text-primary mb-6">AI-Powered Insurance Analytics</h3>
                
                {/* Coverage comparison visualization */}
                <div className="space-y-5">
                  {['Coverage', 'Price', 'Benefits', 'Claims Process'].map((category, i) => (
                    <motion.div 
                      key={category}
                      className="space-y-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm font-medium text-primary">
                          {Math.floor(80 - (i * 10))}%
                        </span>
                      </div>
                      
                      <div className="h-2 w-full bg-blue-100/30 dark:bg-blue-900/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${80 - (i * 10)}%` }}
                          transition={{ duration: 0.8, delay: 1.0 + (i * 0.1), type: "spring" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Animated data dots */}
                  <div className="flex justify-between mt-8">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      <span className="ml-2 text-sm">Premium Plans</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-indigo-400"></div>
                      <span className="ml-2 text-sm">Standard Plans</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <FeaturesGrid 
        features={features} 
        title="Advanced Features for Smart Insurance"
        subtitle="Powered by AI technology to provide you with the best insurance experience"
        columns={4}
      />
      
      {/* Insurance Categories */}
      <div className="bg-white dark:bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <AnimatedBackground variant="consumer" intensity="low" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                AI-Powered Insurance Categories
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70">
                Explore different insurance types optimized using advanced analytics and risk assessment
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(category.path)}
                className="cursor-pointer group"
              >
                <GlassCard
                  className="h-full"
                  variant={category.color === "blue" ? "blue" : "default"}
                  hover="glow"
                  interactive
                >
                  <div className="h-32 flex items-center justify-center mb-6">
                    {category.icon}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">{category.title}</h3>
                    <p className="text-foreground/70 mb-4">{category.description}</p>
                    
                    <div className="pt-4 flex justify-center">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all"
                      >
                        Explore Plans
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Popular Plans Slider */}
      <div className="bg-indigo-50/50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Popular Insurance Plans
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70">
                Top-rated plans selected by our AI based on coverage quality and user satisfaction
              </p>
            </motion.div>
          </div>
          
          <PopularPlansSlider plans={popularPlans} />
          
          {user && <RecentlyViewedPlans category="travel" />}
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-white dark:bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <AnimatedBackground variant="consumer" intensity="low" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                What Our Users Are Saying
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70">
                Real experiences from users who found their perfect insurance match
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full flex flex-col justify-between" hover="lift">
                  <div>
                    {/* Rating stars */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-lg font-medium mb-6">"{testimonial.quote}"</p>
                  </div>
                  
                  {/* Author info */}
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-foreground/70">{testimonial.location}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <CTASection 
        title="Ready to find your perfect insurance match?"
        description="Let our AI technology guide you to the best coverage options for your needs"
        buttonText="Get Started Now"
        buttonIcon={<ArrowRight className="ml-2 h-5 w-5" />}
        onButtonClick={handleGetStarted}
        gradientColors={{
          from: "from-indigo-600",
          to: "to-blue-500"
        }}
        buttonGradient={{
          from: "from-white",
          to: "to-white/90"
        }}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}