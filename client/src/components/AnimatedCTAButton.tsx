import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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

const AnimatedCTAButton: React.FC<AnimatedCTAButtonProps> = ({
  children,
  onClick,
  size = 'md',
  variant = 'primary',
  className = '',
  icon = <ArrowRight />,
  withSparkle = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size variants
  const sizeVariants = {
    sm: 'px-4 py-2 text-sm gap-1',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  // Style variants
  const styleVariants = {
    primary: 'bg-gradient-to-r from-accent-blue to-accent-purple text-white',
    secondary: 'bg-white bg-opacity-20 backdrop-blur-md text-gray-800 border border-white/30',
  };

  // Animation variants
  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)'
    },
    tap: { 
      scale: 0.98,
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
    }
  };

  const iconVariants = {
    initial: { x: 0 },
    hover: { 
      x: 5,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const, // Type assertion to fix the issue
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
        scale: [0, 1, 0]
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1
      }}
    />
  );

  return (
    <motion.button
      className={`
        relative overflow-hidden
        rounded-full font-medium
        ${styleVariants[variant]}
        ${sizeVariants[size]}
        flex items-center justify-center
        ${className}
      `}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Sparkles animation (visible when hovered if withSparkle is true) */}
      {withSparkle && isHovered && (
        <>
          <Sparkle delay={0.1} size={3} top="20%" left="10%" />
          <Sparkle delay={0.3} size={4} top="60%" left="15%" />
          <Sparkle delay={0.2} size={2} top="30%" left="85%" />
          <Sparkle delay={0.5} size={3} top="70%" left="80%" />
          <Sparkle delay={0.4} size={2} top="10%" left="30%" />
          <Sparkle delay={0.6} size={3} top="50%" left="50%" />
          <Sparkle delay={0.2} size={4} top="80%" left="35%" />
          <Sparkle delay={0.4} size={3} top="15%" left="65%" />
        </>
      )}
      
      {/* Text content */}
      <span>{children}</span>
      
      {/* Icon animation */}
      {icon && (
        <motion.span
          variants={iconVariants}
          className="inline-flex items-center"
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

export default AnimatedCTAButton;