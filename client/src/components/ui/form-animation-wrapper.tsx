import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  animationType?: "shake" | "bounce" | "pulse" | "glow" | "none";
}

export function FormAnimationWrapper({
  children,
  className,
  isValid,
  isInvalid,
  animationType = "shake",
}: FormAnimationWrapperProps) {
  // Animation variants based on the type
  const variants = {
    shake: {
      invalid: { x: [0, -5, 5, -5, 5, 0] },
      valid: { y: [0, -2, 0] },
    },
    bounce: {
      invalid: { y: [0, -5, 5, -5, 0] },
      valid: { y: [0, -5, 0] },
    },
    pulse: {
      invalid: { scale: [1, 0.97, 1.03, 0.97, 1] },
      valid: { scale: [1, 1.03, 1] },
    },
    glow: {
      invalid: { boxShadow: ["0 0 0 rgba(239, 68, 68, 0)", "0 0 8px rgba(239, 68, 68, 0.5)", "0 0 0 rgba(239, 68, 68, 0)"] },
      valid: { boxShadow: ["0 0 0 rgba(34, 197, 94, 0)", "0 0 8px rgba(34, 197, 94, 0.5)", "0 0 0 rgba(34, 197, 94, 0)"] },
    },
    none: {
      invalid: {},
      valid: {},
    },
  };

  // Select the animation variant
  const selectedVariant = variants[animationType];

  // Enhanced styling for valid/invalid states
  const wrapperClassName = cn(
    "relative transition-all duration-300",
    isValid && "focus-within:ring-2 focus-within:ring-green-200",
    isInvalid && "focus-within:ring-2 focus-within:ring-red-200",
    className
  );

  return (
    <motion.div
      className={wrapperClassName}
      animate={isInvalid ? "invalid" : isValid ? "valid" : "idle"}
      variants={{
        idle: {},
        ...selectedVariant,
      }}
      transition={{ 
        duration: isInvalid ? 0.4 : 0.2,
        ease: "easeInOut",
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </motion.div>
  );
}