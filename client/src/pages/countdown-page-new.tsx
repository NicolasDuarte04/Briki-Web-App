import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/animated-background";
import GlassCard from "@/components/glass-card";
import { ArrowRight, BellIcon, LockIcon, ShieldCheckIcon, StarIcon, Sparkles } from "lucide-react";
import CountdownTimer from "@/components/countdown-timer";
import AnimatedLogo, { DynamicLogo } from "@/components/animated-logo";
import AnimatedCTAButton, { AnimatedOutlineButton } from "@/components/animated-cta-button";
import FloatingElement, { PulsingElement, PulsingOpacity } from "@/components/floating-element";
import { FaBuilding } from "react-icons/fa";

export default function CountdownPageNew() {
  const [, navigate] = useLocation();
  const [timeLeft, setTimeLeft] = useState({
    days: 20,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time difference from a fixed global launch date
  useEffect(() => {
    // Set a fixed global launch date (June 1, 2025)
    const targetDate = new Date('2025-06-01T00:00:00');
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Countdown finished
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handlePreTestClick = () => {
    navigate('/auth');
  };
  
  const handleBrikiPilotClick = () => {
    navigate('/briki-pilot');
  };
  
  const features = [
    {
      title: "Personalized Insurance",
      description: "AI-powered recommendations based on your unique profile and needs",
      icon: <StarIcon className="w-6 h-6 text-[#4C6EFF]" />
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security to protect your sensitive information",
      icon: <LockIcon className="w-6 h-6 text-[#4C6EFF]" />
    },
    {
      title: "Real-Time Alerts",
      description: "Get instant notifications on policy changes and opportunities",
      icon: <BellIcon className="w-6 h-6 text-[#4C6EFF]" />
    },
    {
      title: "Trusted Partners",
      description: "We work with top-rated insurance providers for premium coverage",
      icon: <ShieldCheckIcon className="w-6 h-6 text-[#4C6EFF]" />
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background - using Stripe-inspired animation */}
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground 
          variant="countdown" 
          intensity="medium" 
          animationStyle="stripe" 
        />
      </div>
      
      {/* Ambient animated bubbles */}
      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-60 -z-5">
        <AnimatedBackground 
          variant="landing" 
          intensity="low" 
          animationStyle="bubble" 
        />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-12">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Section with Logo & Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6"
            >
              <DynamicLogo size="xl" className="mx-auto mb-6" />
              
              <h2 className="text-xl md:text-2xl font-medium text-slate-700">
                Global Launch Countdown - June 1, 2025
              </h2>
            </motion.div>
            
            {/* Headline & Countdown Timer - rearranged side by side on larger screens */}
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mt-10 mb-16">
              {/* Main headline - improved with larger font and gradient */}
              <motion.div
                className="lg:w-1/2 text-center lg:text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#3D70F5] to-[#5F9FFF] drop-shadow-sm mb-6">
                  The easiest way to compare and understand insurance plans
                </h1>
                
                {/* Compact/inline timer for larger screens */}
                <div className="lg:block hidden">
                  <CountdownTimer 
                    timeLeft={timeLeft} 
                    variant="inline" 
                    className="inline-flex bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-white/30 mt-4"
                  />
                </div>
              </motion.div>
              
              {/* Countdown Timer - main grid version */}
              <motion.div 
                className="lg:w-1/2 w-full lg:max-w-none max-w-md lg:block hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <CountdownTimer timeLeft={timeLeft} />
              </motion.div>
              
              {/* Mobile-only compact timer */}
              <motion.div 
                className="w-full max-w-md lg:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <CountdownTimer timeLeft={timeLeft} variant="compact" />
              </motion.div>
            </div>
          </div>
          
          {/* Value Proposition Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mb-16"
          >
            <GlassCard className="mb-12 py-8 px-6 md:px-8 shadow-lg border border-white/30">
              <div className="max-w-3xl mx-auto">
                <p className="text-slate-700 text-lg mb-10">
                  Powered by advanced AI technology to deliver personalized insurance recommendations tailored to your unique needs.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                      className="flex gap-4 items-start text-left group"
                    >
                      <div className="bg-white p-3 rounded-xl shadow-md border border-white/30 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                        <PulsingElement amplitude={0.05} duration={3 + index} delay={index * 0.5}>
                          {feature.icon}
                        </PulsingElement>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{feature.title}</h3>
                        <p className="text-slate-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
          
          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col items-center mb-16 relative"
          >
            {/* Main CTA button */}
            <AnimatedCTAButton
              onClick={handlePreTestClick}
              className="px-8 py-4 text-lg"
              arrowAnimation={true}
              glowEffect={true}
            >
              Pre-Test the App
            </AnimatedCTAButton>
            
            <p className="mt-3 text-sm text-foreground/60">
              Early access for our community members
            </p>
            
            {/* Briki Pilot floating button */}
            <FloatingElement 
              className="absolute -right-10 -top-6 md:right-0 md:top-0" 
              amplitude={6}
              duration={5}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-full shadow-lg cursor-pointer text-sm"
                onClick={handleBrikiPilotClick}
              >
                <FaBuilding className="text-xs" />
                <span className="font-medium">Briki Pilot</span>
                <ArrowRight className="h-3 w-3" />
              </motion.div>
            </FloatingElement>
          </motion.div>
          
          {/* Beta Notice - now more compact and semi-transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4"
          >
            <GlassCard 
              variant="blue" 
              size="sm"
              className="text-sm bg-white/70 backdrop-blur-md border border-white/30 shadow-md"
            >
              <div className="flex items-center gap-2 font-medium text-primary mb-1">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Beta Notice</span>
              </div>
              <p className="text-slate-600">
                You are accessing a beta version of Briki. Payments are currently disabled for testing purposes.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}