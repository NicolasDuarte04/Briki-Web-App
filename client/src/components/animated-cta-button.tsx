import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface AnimatedCTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  arrowAnimation?: boolean;
  glowEffect?: boolean; 
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}

/**
 * A modern, animated call-to-action button with hover effects
 * Features an optional animated arrow and glow effect
 */
export default function AnimatedCTAButton({
  children,
  onClick,
  className = '',
  arrowAnimation = true,
  glowEffect = true,
  icon,
  iconPosition = 'right',
  disabled = false,
}: AnimatedCTAButtonProps) {
  // Icon to display (custom icon or default arrow)
  const displayIcon = icon || <ArrowRight className="h-5 w-5" />;
  
  // Base button style
  const baseClasses = `
    relative group flex items-center justify-center gap-2 px-6 py-3 
    rounded-xl font-semibold text-white transition-all duration-300
    bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] shadow-md
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}
    ${className}
  `;
  
  // If disabled, render a static button
  if (disabled) {
    return (
      <button className={baseClasses} disabled>
        {iconPosition === 'left' && displayIcon}
        <span>{children}</span>
        {iconPosition === 'right' && displayIcon}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background glow effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] rounded-xl opacity-0 blur-xl transition-opacity duration-300"
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 0.7 }}
        />
      )}
      
      {/* Left icon */}
      {iconPosition === 'left' && (
        <span className="flex items-center justify-center">
          {displayIcon}
        </span>
      )}
      
      {/* Button text */}
      <span>{children}</span>
      
      {/* Right icon with animation */}
      {iconPosition === 'right' && (
        <motion.span 
          className="flex items-center justify-center"
          animate={{ x: arrowAnimation ? 0 : 0 }}
          whileHover={{ x: arrowAnimation ? 3 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {displayIcon}
        </motion.span>
      )}
    </motion.button>
  );
}

/**
 * A secondary version with outline style
 */
export function AnimatedOutlineButton({
  children,
  onClick,
  className = '',
  arrowAnimation = true,
  glowEffect = true,
  icon,
  iconPosition = 'right',
  disabled = false,
}: AnimatedCTAButtonProps) {
  // Icon to display (custom icon or default arrow)
  const displayIcon = icon || <ArrowRight className="h-5 w-5" />;
  
  // Base button style for outline variant
  const baseClasses = `
    relative group flex items-center justify-center gap-2 px-6 py-3 
    rounded-xl font-semibold text-[#4C6EFF] transition-all duration-300
    border-2 border-[#4C6EFF] bg-white/80 shadow-sm backdrop-blur-sm
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:border-[#5F9FFF] hover:text-[#5F9FFF] hover:-translate-y-0.5'}
    ${className}
  `;
  
  // If disabled, render a static button
  if (disabled) {
    return (
      <button className={baseClasses} disabled>
        {iconPosition === 'left' && displayIcon}
        <span>{children}</span>
        {iconPosition === 'right' && displayIcon}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background glow effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 -z-10 bg-[#4C6EFF]/10 rounded-xl opacity-0 blur-md transition-opacity duration-300"
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 0.7 }}
        />
      )}
      
      {/* Left icon */}
      {iconPosition === 'left' && (
        <span className="flex items-center justify-center">
          {displayIcon}
        </span>
      )}
      
      {/* Button text */}
      <span>{children}</span>
      
      {/* Right icon with animation */}
      {iconPosition === 'right' && (
        <motion.span 
          className="flex items-center justify-center"
          animate={{ x: arrowAnimation ? 0 : 0 }}
          whileHover={{ x: arrowAnimation ? 3 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {displayIcon}
        </motion.span>
      )}
    </motion.button>
  );
}