import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from '@/components/countdown/countdown-timer';
import { FuturisticBackground } from '@/components/ui/futuristic-background';
import { ChevronRight, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function CountdownPage() {
  const [, navigate] = useLocation();
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Fixed target date: June 1, 2025
  const getFixedTargetDate = () => {
    // Using a fixed date (June 1, 2025) for the official launch
    return new Date(2025, 5, 1, 0, 0, 0);
  };

  const handlePreTestClick = () => {
    // Navigate to existing auth page
    console.log("Pre-test button clicked, navigating to auth page");
    navigate('/auth');
    
    // Double-check navigation with a small delay
    setTimeout(() => {
      console.log("Current location after pre-test click:", window.location.pathname);
      if (window.location.pathname !== '/auth') {
        console.log("Navigation seems to have failed, trying again...");
        window.location.href = '/auth';
      }
    }, 300);
  };

  const handleCountdownComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FuturisticBackground particleCount={60} />
      </div>
      
      {/* Content container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center px-4 py-16 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo/Branding */}
        <motion.div
          className="mb-12 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary/90 to-primary mb-4">
            Briki
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70">
            The Future of Insurance
          </p>
        </motion.div>
        
        {/* Countdown Timer */}
        <motion.div
          className="w-full mb-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CountdownTimer 
            targetDate={getFixedTargetDate()} 
            onComplete={handleCountdownComplete}
          />
        </motion.div>
        
        {/* Pre-Test Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full max-w-xs sm:max-w-md"
        >
          <Button 
            className="w-full py-6 text-lg group relative overflow-hidden"
            onClick={handlePreTestClick}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Pre-Test the App
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            
            {/* Button background effects */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </Button>
          
          <div className="mt-4 text-center text-sm text-foreground/50">
            Explore the future of insurance before launch
          </div>
        </motion.div>
        
        {/* Version info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute bottom-4 left-0 right-0 text-center text-foreground/40 text-xs"
        >
          Beta Version • All payment features disabled
        </motion.div>
      </motion.div>
    </div>
  );
}