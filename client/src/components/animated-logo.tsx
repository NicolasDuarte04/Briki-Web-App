import React from 'react';
import { motion } from 'framer-motion';
import { PulsingElement } from './floating-element';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'dark';
  animated?: boolean;
  className?: string;
}

/**
 * Animated logo component for Briki
 * Creates a modern, visually appealing brand display with optional animation
 */
export default function AnimatedLogo({
  size = 'md',
  variant = 'primary',
  animated = true,
  className = '',
}: AnimatedLogoProps) {
  // Set the size of the logo based on the size prop
  const sizeClass = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  }[size];

  // Set the color of the logo based on the variant prop
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent',
    white: 'text-white',
    dark: 'text-slate-900 dark:text-white',
  }[variant];

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 10,
      },
    },
  };

  // Static logo rendering (no animation)
  if (!animated) {
    return (
      <h1 className={`font-extrabold ${sizeClass} ${variantStyles} ${className}`}>
        briki
      </h1>
    );
  }

  // Animated logo rendering
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <h1 className={`font-extrabold ${sizeClass} tracking-tight ${variantStyles}`}>
          {['b', 'r', 'i', 'k', 'i'].map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </div>
    </div>
  );
}

/**
 * Creates a Briki logo with a dot that pulses
 */
export function DynamicLogo({
  size = 'md',
  variant = 'primary',
  className = '',
}: AnimatedLogoProps) {
  // Set the size of the logo based on the size prop
  const sizeClass = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  }[size];

  // Set the color of the logo based on the variant prop
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent',
    white: 'text-white',
    dark: 'text-slate-900 dark:text-white',
  }[variant];

  // Set the dot color
  const dotColor = {
    primary: 'bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF]',
    white: 'bg-white',
    dark: 'bg-slate-900 dark:bg-white',
  }[variant];

  // Dot size based on logo size
  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  }[size];

  return (
    <div className={`relative inline-flex items-end ${className}`}>
      <h1 className={`font-extrabold ${sizeClass} tracking-tight ${variantStyles}`}>
        briki
      </h1>
      <PulsingElement 
        amplitude={0.15} 
        duration={2.5}
        className={`absolute -right-2 bottom-0 rounded-full ${dotSize} ${dotColor}`}
      >
        <div />
      </PulsingElement>
    </div>
  );
}