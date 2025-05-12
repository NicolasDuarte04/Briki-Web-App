import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CountdownTimerProps = {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, onComplete, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) {
        if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, isComplete]);

  const timeSegments = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-6", className)}>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {timeSegments.map((segment, index) => (
          <div 
            key={segment.label} 
            className="flex flex-col items-center"
          >
            <motion.div
              className="bg-background/20 backdrop-blur-md border border-primary/30 rounded-xl p-4 w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center shadow-glow-sm overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.5,
                type: "spring"
              }}
            >
              <motion.span 
                key={segment.value} 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="text-4xl sm:text-5xl font-bold text-primary"
              >
                {segment.value.toString().padStart(2, '0')}
              </motion.span>
              
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-primary/5 rounded-xl blur-md" />
            </motion.div>
            <motion.span 
              className="mt-2 text-xs sm:text-sm font-medium text-foreground/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            >
              {segment.label}
            </motion.span>
          </div>
        ))}
      </div>
      
      {!isComplete ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-sm sm:text-base text-foreground/70 max-w-md"
        >
          Countdown to the future of insurance
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center text-xl sm:text-2xl font-bold text-primary mt-4"
        >
          Briki is now live! Welcome to the Future of Insurance.
        </motion.div>
      )}
    </div>
  );
}