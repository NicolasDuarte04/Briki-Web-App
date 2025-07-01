import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/animated-background";
import GlassCard from "../components/ui/glass-card";
import GradientButton from "../components/gradient-button";
import { ArrowRightIcon, BellIcon, LockIcon, ShieldCheckIcon, StarIcon } from "lucide-react";

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
  
  const features = [
    {
      title: "Personalized Insurance",
      description: "AI-powered recommendations based on your unique profile and needs",
      icon: <StarIcon className="w-5 h-5 text-indigo-500" />
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security to protect your sensitive information",
      icon: <LockIcon className="w-5 h-5 text-indigo-500" />
    },
    {
      title: "Real-Time Alerts",
      description: "Get instant notifications on policy changes and opportunities",
      icon: <BellIcon className="w-5 h-5 text-indigo-500" />
    },
    {
      title: "Trusted Partners",
      description: "We work with top-rated insurance providers for premium coverage",
      icon: <ShieldCheckIcon className="w-5 h-5 text-indigo-500" />
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground variant="auth" intensity="medium" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Logo & Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 drop-shadow-sm mb-4">
              briki
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-foreground/80">
              Global Launch Countdown - June 1, 2025
            </h2>
          </motion.div>
          
          {/* Countdown Timer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-14"
          >
            <div className="grid grid-cols-4 gap-4 md:gap-6">
              {Object.entries(timeLeft).map(([unit, value], index) => (
                <motion.div
                  key={unit}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + (index * 0.1),
                    type: "spring",
                    stiffness: 200
                  }}
                  className="flex flex-col items-center"
                >
                  <GlassCard
                    variant="primary"
                    size="none"
                    className="w-full aspect-square flex items-center justify-center"
                    hover="glow"
                  >
                    <motion.span 
                      className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-blue-500"
                      key={value}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      {value.toString().padStart(2, '0')}
                    </motion.span>
                  </GlassCard>
                  <p className="mt-3 text-sm font-medium capitalize text-foreground/70">{unit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mb-12"
          >
            <GlassCard className="mb-10 py-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 mb-4">
                The easiest way to compare and understand insurance plans
              </h2>
              <p className="text-foreground/80 max-w-2xl mx-auto mb-8">
                Powered by advanced AI technology to deliver personalized insurance recommendations tailored to your unique needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                    className="flex gap-3 items-start text-left"
                  >
                    <div className="bg-indigo-100 dark:bg-indigo-950/30 p-2 rounded-full">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{feature.title}</h3>
                      <p className="text-sm text-foreground/70">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
          
          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mb-10"
          >
            <GradientButton
              size="lg"
              onClick={handlePreTestClick}
              className="px-8 py-4 text-lg shadow-lg"
              gradientFrom="from-indigo-600"
              gradientTo="to-blue-500"
              icon={<ArrowRightIcon className="ml-2 h-5 w-5" />}
              iconPosition="right"
            >
              Pre-Test the App
            </GradientButton>
            
            <p className="mt-3 text-sm text-foreground/60">
              Early access for our community members
            </p>
          </motion.div>
          
          {/* Beta Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <GlassCard 
              variant="blue" 
              size="sm"
              className="max-w-md mx-auto text-sm"
            >
              <div className="flex items-center gap-2 font-medium text-primary mb-1">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Beta Notice</span>
              </div>
              <p className="text-foreground/80">
                You are accessing a beta version of Briki. Payments are currently disabled for testing purposes.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}