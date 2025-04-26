import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  animationType?: "shake" | "bounce" | "pulse" | "none";
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
    none: {
      invalid: {},
      valid: {},
    },
  };

  // Select the animation variant
  const selectedVariant = variants[animationType];

  return (
    <motion.div
      className={cn("relative", className)}
      animate={isInvalid ? "invalid" : isValid ? "valid" : "idle"}
      variants={{
        idle: {},
        ...selectedVariant,
      }}
      transition={{ 
        duration: isInvalid ? 0.4 : 0.2,
        ease: "easeInOut",
      }}
    >
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </motion.div>
  );
}