import React from 'react';
import { motion } from 'framer-motion';
import '@/styles/design-system.css';

type AnimatedCTAButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
  icon?: React.ReactNode;
  withSparkle?: boolean;
};

const AnimatedCTAButton = ({ 
  children, 
  onClick, 
  size = 'md', 
  variant = 'primary', 
  className = '',
  icon,
  withSparkle = false
}: AnimatedCTAButtonProps) => {
  // Size styles
  const sizeStyles = {
    sm: {
      height: '36px',
      padding: '0 16px',
      fontSize: '14px',
    },
    md: {
      height: '44px',
      padding: '0 20px',
      fontSize: '15px',
    },
    lg: {
      height: '52px',
      padding: '0 24px',
      fontSize: '16px',
    }
  };
  
  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
    },
    secondary: {
      backgroundColor: 'white',
      color: 'var(--color-text)',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
    }
  };

  const iconVariants = {
    initial: { x: 0 },
    hover: { 
      x: 5,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 0.6
      }
    }
  };

  // Sparkle component for background effect
  const Sparkle = ({ delay = 0, size = 4, top, left }: { delay: number; size: number; top: string; left: string }) => (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        top,
        left,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 3,
      }}
    />
  );

  // Generate a few random sparkles
  const sparkles = withSparkle ? Array.from({ length: 6 }).map((_, index) => (
    <Sparkle
      key={index}
      delay={Math.random() * 2}
      size={Math.random() * 3 + 2}
      top={`${Math.random() * 100}%`}
      left={`${Math.random() * 100}%`}
    />
  )) : null;

  return (
    <motion.button
      className={`relative overflow-hidden rounded-lg font-medium flex items-center justify-center gap-2 transition-transform ${className}`}
      onClick={onClick}
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)' 
      }}
      whileTap={{ scale: 0.98 }}
    >
      {sparkles}
      <span>{children}</span>
      {icon && (
        <motion.span
          variants={iconVariants}
          initial="initial"
          whileHover="hover"
          className="inline-flex items-center"
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

export default AnimatedCTAButton;