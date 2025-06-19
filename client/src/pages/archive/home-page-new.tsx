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
import { GlassCard } from "@/components/auth/GlassCard";
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
      {/* Beta Notice */}
      {showBeta && (
        <BetaNotice 
          message="Briki is currently in beta. We're constantly adding new insurance options!"
          detailText="Your feedback helps us improve."
          variant="beta"
          position="top"
          dismissible={true}
          icon={<Sparkles size={18} />}
        />
      )}
      
      {/* Hero Section with Enhanced Animated Background */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Enhanced Background with Floating Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Large primary gradient orb */}
          <motion.div 
            className="absolute top-[20%] right-[20%] bg-gradient-to-br from-indigo-400/30 to-blue-500/30 w-[500px] h-[500px] rounded-full blur-3xl"
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.05, 1],
              opacity: [0.25, 0.35, 0.25],
            }}
            transition={{ 
              duration: 10,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          
          {/* Secondary floating gradient orb */}
          <motion.div 
            className="absolute bottom-[10%] left-[15%] bg-gradient-to-br from-purple-400/20 to-indigo-500/20 w-[400px] h-[400px] rounded-full blur-3xl"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ 
              duration: 12,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 1,
            }}
          />
          
          {/* Soft glow accent */}
          <motion.div 
            className="absolute top-[40%] left-[30%] bg-gradient-to-br from-blue-300/10 to-cyan-400/10 w-[300px] h-[300px] rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ 
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 2,
            }}
          />
          
          <div className="absolute inset-0">
            <AnimatedBackground intensity="medium" variant="consumer" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content with Enhanced Animations and Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 50,
                damping: 20
              }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 drop-shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.1,
                  type: "spring"
                }}
              >
                <motion.span 
                  className="block mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  AI-Powered
                </motion.span>
                <motion.span 
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Insurance Platform
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="mt-6 text-base sm:text-lg sm:max-w-xl md:text-xl text-foreground/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Compare and analyze insurance options across multiple categories using our advanced AI technology. Get personalized recommendations based on your unique needs.
              </motion.p>
              
              <motion.div 
                className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <GradientButton 
                    size="lg"
                    className="w-full sm:w-auto px-8 py-3 md:py-4 text-lg shadow-xl"
                    onClick={handleGetStarted}
                    gradientFrom="from-indigo-600"
                    gradientTo="to-blue-500"
                    icon={<Sparkles className="h-5 w-5" />}
                    iconPosition="left"
                  >
                    Get Started
                  </GradientButton>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <GradientButton 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-3 md:py-4 text-lg mt-3 sm:mt-0"
                    onClick={() => navigate("/learn-more")}
                    gradientFrom="from-blue-500"
                    gradientTo="to-indigo-600"
                  >
                    Learn More
                  </GradientButton>
                </motion.div>
              </motion.div>
              
              {/* Enhanced Company button with subtle animation */}
              <motion.div 
                className="mt-8 flex justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button 
                    variant="ghost" 
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all px-4 py-2 rounded-full"
                    onClick={() => navigate("/company")}
                  >
                    <span>For Insurance Companies</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        ease: "easeInOut", 
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Hero Visual with Apple-style floating card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4, 
                type: "spring", 
                stiffness: 50,
                damping: 20
              }}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 6, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <GlassCard 
                  variant="blue"
                  size="lg"
                  className="max-w-md w-full shadow-xl backdrop-blur-lg"
                  hover="glow"
                  motionProps={{
                    whileHover: { y: -5 },
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  <div className="flex items-center mb-6">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, 0, -10, 0],
                        scale: [1, 1.1, 1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 5, 
                        ease: "easeInOut", 
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="mr-3"
                    >
                      <Sparkles className="h-6 w-6 text-blue-500" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-primary">AI-Powered Insurance Analytics</h3>
                  </div>
                  
                  {/* Enhanced Coverage comparison visualization with Apple-style bars */}
                  <div className="space-y-6">
                    {['Coverage', 'Price', 'Benefits', 'Claims Process'].map((category, i) => (
                      <motion.div 
                        key={category}
                        className="space-y-2.5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground/90">{category}</span>
                          <span className="text-sm font-medium text-primary">
                            {Math.floor(80 - (i * 10))}%
                          </span>
                        </div>
                        
                        <div className="h-2.5 w-full bg-blue-100/30 dark:bg-blue-900/20 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${80 - (i * 10)}%` }}
                            transition={{ duration: 0.8, delay: 1.0 + (i * 0.1), type: "spring" }}
                          >
                            <motion.div 
                              className="absolute right-0 top-0 h-full w-1.5 bg-white/30 blur-[1px]"
                              animate={{ opacity: [0, 0.7, 0] }}
                              transition={{ duration: 2, delay: 2 + (i * 0.2), repeat: Infinity, repeatDelay: 5 }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Animated data indicators with Apple-style design */}
                    <div className="flex justify-between mt-8 pt-2 border-t border-blue-200/20">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/20"></div>
                        <span className="ml-2 text-sm font-medium">Premium Plans</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 shadow-lg shadow-blue-400/20"></div>
                        <span className="ml-2 text-sm font-medium">Standard Plans</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
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
      
      {/* Insurance Categories - Apple Style */}
      <div className="bg-gradient-to-b from-white via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20 py-24 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <AnimatedBackground variant="consumer" intensity="low" />
        </div>
        
        {/* Decorative gradient orbs */}
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-blue-300/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-purple-300/10 to-blue-300/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1,
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                AI-Powered Insurance Categories
              </motion.h2>
              
              <motion.p 
                className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Explore different insurance types optimized using advanced analytics and risk assessment
              </motion.p>
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
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(category.path)}
                className="cursor-pointer group"
              >
                <GlassCard
                  className="h-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md"
                  variant={category.color === "blue" ? "blue" : "default"}
                  hover="glow"
                  interactive
                >
                  {/* Category icon with enhanced animations */}
                  <div className="h-32 flex items-center justify-center mb-8 relative">
                    {/* Decorative background circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className={`w-24 h-24 rounded-full bg-${category.color}-500/10 blur-md`}
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.6, 0.8, 0.6]
                        }}
                        transition={{ 
                          duration: 4, 
                          ease: "easeInOut", 
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      />
                    </div>
                    
                    {/* Actual icon with hover animation */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, 2, 0, -2, 0],
                        transition: { 
                          duration: 0.8,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "loop"
                        }
                      }}
                      className="relative z-10"
                    >
                      {category.icon}
                    </motion.div>
                  </div>
                  
                  <div className="text-center px-2">
                    <h3 className="text-xl font-bold text-foreground mb-3">{category.title}</h3>
                    <p className="text-foreground/70 mb-6 text-sm md:text-base">{category.description}</p>
                    
                    <div className="pt-4 flex justify-center">
                      {/* Apple-style button */}
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline"
                          size="sm"
                          className="group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all rounded-full px-4 py-2 shadow-sm group-hover:shadow"
                        >
                          <span>Explore Plans</span>
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              ease: "easeInOut", 
                              repeat: Infinity,
                              repeatDelay: 2
                            }}
                            className="inline-block"
                          >
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Popular Plans Slider - Apple Style */}
      <div className="bg-gradient-to-b from-blue-50/30 to-white dark:from-blue-950/10 dark:to-gray-900 py-24 relative overflow-hidden">
        {/* Decorative light beams - Apple style */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <motion.div 
            className="absolute top-0 left-1/4 w-[300px] h-[600px] bg-gradient-to-b from-blue-400/10 to-transparent transform -rotate-45 origin-top"
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 8, 
              ease: "easeInOut", 
              repeat: Infinity,
            }}
          />
          
          <motion.div 
            className="absolute top-1/4 right-1/3 w-[400px] h-[700px] bg-gradient-to-b from-indigo-400/10 to-transparent transform rotate-45 origin-top"
            animate={{ 
              opacity: [0.15, 0.35, 0.15],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 10, 
              ease: "easeInOut", 
              repeat: Infinity,
              delay: 2,
            }}
          />
        </div>
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Popular Insurance Plans
              </motion.h2>
              
              <motion.p 
                className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Top-rated plans selected by our AI based on coverage quality and user satisfaction
              </motion.p>
            </motion.div>
          </div>
          
          {/* Wrapper with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative pb-4"
          >
            <div className="absolute inset-x-0 -bottom-6 h-16 bg-gradient-to-r from-blue-50/0 via-indigo-100/30 to-blue-50/0 dark:from-blue-950/0 dark:via-indigo-900/20 dark:to-blue-950/0 blur-xl rounded-full"></div>
            
            <PopularPlansSlider plans={popularPlans} />
          </motion.div>
          
          {/* Recently Viewed Plans with enhanced styling */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 pt-8 border-t border-indigo-100/50 dark:border-indigo-900/30"
            >
              <RecentlyViewedPlans category="travel" />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Testimonials - Apple Style */}
      <div className="bg-gradient-to-b from-white to-indigo-50/20 dark:from-gray-900 dark:to-indigo-950/10 py-24 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <AnimatedBackground variant="consumer" intensity="low" />
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-indigo-50/30 to-transparent dark:from-indigo-950/10 dark:to-transparent"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                What Our Users Are Saying
              </motion.h2>
              
              <motion.p 
                className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Real experiences from users who found their perfect insurance match
              </motion.p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 50,
                  damping: 20
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
              >
                <GlassCard 
                  className="h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md relative overflow-hidden" 
                  hover="glow"
                >
                  {/* Apple-style highlight corner */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                    {/* Rating stars with enhanced Apple-style */}
                    <div className="flex mb-5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { 
                              delay: 0.3 + (i * 0.1),
                              type: "spring",
                              stiffness: 300
                            }
                          }}
                          viewport={{ once: true }}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                : "text-gray-300"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Quote with enhanced typography */}
                    <p className="text-lg font-medium mb-6 leading-relaxed text-foreground/90 italic">"{testimonial.quote}"</p>
                  </div>
                  
                  {/* Author info with Apple-style design */}
                  <div className="pt-4 border-t border-indigo-100/20 dark:border-indigo-900/20 mt-auto">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-foreground/60">{testimonial.location}</p>
                      </div>
                    </div>
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