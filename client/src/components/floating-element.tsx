import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;    // How much it moves
  duration?: number;     // How long the animation cycle takes
  delay?: number;        // Offset for the animation
  onClick?: () => void;  // Optional click handler
  disabled?: boolean;    // Disable animation
}

/**
 * Creates an element that floats gently with a subtle animation
 * Perfect for creating ambient motion in the UI
 */
export default function FloatingElement({
  children,
  className = '',
  amplitude = 5,
  duration = 4,
  delay = 0,
  onClick,
  disabled = false,
}: FloatingElementProps) {
  // Animations are disabled
  if (disabled) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0, amplitude, 0],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: Infinity,
        delay
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/**
 * Creates an element that appears to "breathe" by scaling slightly
 */
export function PulsingElement({
  children,
  className = '',
  amplitude = 0.03,
  duration = 3,
  delay = 0,
  onClick,
  disabled = false,
}: FloatingElementProps) {
  // Animations are disabled
  if (disabled) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1 + amplitude, 1, 1 - amplitude/2, 1],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: Infinity,
        delay
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/**
 * Creates an element that subtly fades in opacity
 */
export function PulsingOpacity({
  children,
  className = '',
  amplitude = 0.2,
  duration = 3.5,
  delay = 0,
  onClick,
  disabled = false,
}: FloatingElementProps) {
  // Animations are disabled
  if (disabled) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  // Calculate opacity values to ensure we don't go below 0 or above 1
  const maxOpacity = Math.min(1, 1);
  const minOpacity = Math.max(0, 1 - amplitude);

  return (
    <motion.div
      className={className}
      animate={{
        opacity: [maxOpacity, minOpacity, maxOpacity],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        delay
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}