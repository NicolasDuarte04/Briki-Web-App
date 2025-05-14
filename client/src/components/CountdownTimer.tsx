import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '@/styles/design-system.css';

type CountdownTimerProps = {
  targetDate: Date;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  className = '' 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft: TimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      return newTimeLeft;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Format a number to always be two digits
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    }
  };

  const digitVariants = {
    initial: { y: 0, opacity: 1 },
    animate: (custom: number) => ({
      y: [-2, 0],
      opacity: [0.5, 1],
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        delay: custom * 0.05
      }
    })
  };

  // Components for each time unit
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative glass-card p-3 sm:p-4 md:p-6 rounded-xl w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 flex items-center justify-center overflow-hidden">
        <motion.span 
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent"
          variants={digitVariants}
          initial="initial"
          animate="animate"
          custom={value}
          key={value} // Re-render when value changes
        >
          {formatNumber(value)}
        </motion.span>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-accent-purple/20 to-accent-blue/20"></div>
      </div>
      <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600">{label}</span>
    </motion.div>
  );

  return (
    <motion.div 
      className={`flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </motion.div>
  );
};

export default CountdownTimer;