import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './glass-card';

interface CountdownUnit {
  value: number;
  label: string;
}

interface CountdownTimerProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
  showLabels?: boolean;
}

/**
 * A modern, animated countdown timer component
 */
export default function CountdownTimer({
  timeLeft,
  className = '',
  variant = 'default',
  showLabels = true,
}: CountdownTimerProps) {
  const units: CountdownUnit[] = [
    { value: timeLeft.days, label: 'days' },
    { value: timeLeft.hours, label: 'hours' },
    { value: timeLeft.minutes, label: 'minutes' },
    { value: timeLeft.seconds, label: 'seconds' },
  ];

  if (variant === 'compact') {
    // Compact layout for the timer (horizontal, small)
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {units.map((unit, index) => (
          <div key={unit.label} className="flex flex-col items-center">
            <GlassCard
              variant="primary"
              size="sm"
              className="w-14 h-14 flex items-center justify-center"
              hover="none"
            >
              <motion.span
                key={unit.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-mono font-bold text-primary"
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.span>
            </GlassCard>
            {showLabels && (
              <span className="text-xs font-medium text-foreground/70 mt-1 capitalize">
                {unit.label.charAt(0)}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    // Inline layout for the timer (all on one line)
    return (
      <div className={`flex items-center space-x-1 font-mono ${className}`}>
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="flex items-center">
              <motion.span
                key={unit.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-sm sm:text-base font-bold text-primary"
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.span>
              {showLabels && (
                <span className="text-xs font-medium text-foreground/70 ml-1">
                  {unit.label.charAt(0)}
                </span>
              )}
            </div>
            {index < units.length - 1 && (
              <span className="text-sm text-foreground/40 mx-0.5">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Default layout (grid of cards)
  return (
    <div className={`grid grid-cols-4 gap-2 sm:gap-4 ${className}`}>
      {units.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.1 * index,
            type: "spring",
            stiffness: 200,
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
              key={unit.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-blue-500"
            >
              {unit.value.toString().padStart(2, '0')}
            </motion.span>
          </GlassCard>
          {showLabels && (
            <p className="mt-2 text-xs sm:text-sm font-medium capitalize text-foreground/70">
              {unit.label}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}