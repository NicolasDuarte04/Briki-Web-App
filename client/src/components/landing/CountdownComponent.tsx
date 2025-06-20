import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COUNTDOWN_DATE, FEATURES } from "@/config";
import GlassCard from "@/components/ui/GlassCard";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownComponentProps {
  hideIfExpired?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

/**
 * A reusable countdown component that can be used on various pages
 */
export default function CountdownComponent({ 
  hideIfExpired = true,
  className = "",
  size = "medium"
}: CountdownComponentProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  // Calculate time difference from config target date
  useEffect(() => {
    // Get stored countdown date or use default from config
    const savedCountdown = localStorage.getItem('countdown_date') || COUNTDOWN_DATE;
    const targetDate = new Date(savedCountdown);
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Countdown finished
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
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

  // Hide component if expired and hideIfExpired is true
  if (isExpired && hideIfExpired && !FEATURES.SHOW_COUNTDOWN) {
    return null;
  }

  // Determine sizing based on the size prop
  const getSize = () => {
    switch(size) {
      case "small":
        return {
          container: "gap-2",
          card: "aspect-square",
          number: "text-xl sm:text-2xl",
          label: "text-xs"
        };
      case "large":
        return {
          container: "gap-4 sm:gap-6",
          card: "aspect-square",
          number: "text-3xl sm:text-4xl md:text-5xl",
          label: "text-xs sm:text-sm"
        };
      case "medium":
      default:
        return {
          container: "gap-3 sm:gap-4",
          card: "aspect-square",
          number: "text-2xl sm:text-3xl md:text-4xl",
          label: "text-xs sm:text-sm"
        };
    }
  };

  const sizeClasses = getSize();
  
  return (
    <div className={`flex justify-center ${className}`}>
      <div className={`grid grid-cols-4 ${sizeClasses.container}`}>
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
              className={`w-full ${sizeClasses.card} flex items-center justify-center shadow-md relative overflow-hidden`}
              hover="glow"
              disableMotion
            >
              {/* Enhanced glow effect inside the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {/* Interior shadow for depth */}
              <div className="absolute inset-0 shadow-inner rounded-xl pointer-events-none"></div>
              
              <motion.span 
                className={`font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-blue-500 ${sizeClasses.number}`}
                key={value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                {value.toString().padStart(2, '0')}
              </motion.span>
            </GlassCard>
            <p className={`mt-1 font-medium capitalize text-foreground/70 ${sizeClasses.label}`}>{unit}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}