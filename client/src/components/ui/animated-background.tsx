import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "auth" | "home";
}

export function AnimatedBackground({
  children,
  className = "",
  variant = "default"
}: AnimatedBackgroundProps) {
  // Add variant-specific classes
  const variantClasses = {
    default: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
    auth: "auth-layout bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800",
    home: "home-layout bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800"
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${variantClasses[variant]} ${className}`}>
      {variant === "auth" && (
        <>
          <div className="blob-1"></div>
          <div className="blob-2"></div>
        </>
      )}
      {children}
    </div>
  );
}

interface FloatingElementsProps {
  count?: number;
  className?: string;
}

export function FloatingElements({ count = 5, className = "" }: FloatingElementsProps) {
  // Generate floating elements
  const elements = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 150 + 50; // Random size between 50-200px
    const x = Math.random() * 100; // Random x position
    const y = Math.random() * 100; // Random y position
    const duration = Math.random() * 20 + 10; // Random animation duration
    const delay = Math.random() * 5; // Random animation delay
    
    return (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white/5 backdrop-blur-md"
        style={{
          width: size,
          height: size,
          top: `${y}%`,
          left: `${x}%`,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        animate={{
          x: [20, -20, 20],
          y: [20, -20, 20],
          opacity: [0.4, 0.2, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay,
        }}
      />
    );
  });

  return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>{elements}</div>;
}