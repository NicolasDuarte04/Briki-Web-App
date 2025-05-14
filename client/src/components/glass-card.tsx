import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

const glassCardVariants = cva(
  "relative overflow-hidden rounded-xl border backdrop-blur-lg",
  {
    variants: {
      variant: {
        default: "bg-white/60 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        dark: "bg-gray-900/70 border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-white",
        blue: "bg-blue-50/70 border-blue-200/40 shadow-[0_8px_32px_rgba(59,130,246,0.15)]",
        primary: "bg-primary/15 border-primary/30 shadow-[0_8px_32px_rgba(59,130,246,0.18)]",
        danger: "bg-red-50/70 border-red-200/40 shadow-[0_8px_32px_rgba(239,68,68,0.15)]",
        warning: "bg-orange-50/70 border-orange-200/40 shadow-[0_8px_32px_rgba(249,115,22,0.15)]",
        success: "bg-green-50/70 border-green-200/40 shadow-[0_8px_32px_rgba(34,197,94,0.15)]",
        transparent: "bg-transparent border-transparent shadow-none",
      },
      size: {
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
        xl: "p-9",
        none: "p-0",
      },
      hover: {
        none: "",
        lift: "hover:translate-y-[-4px] transition-transform duration-300",
        glow: "hover:shadow-xl hover:shadow-primary/25 transition-shadow duration-300",
        border: "hover:border-primary/50 transition-colors duration-300",
        full: "hover:translate-y-[-4px] hover:shadow-xl hover:shadow-primary/25 hover:border-primary/50 transition-all duration-300",
      },
      interactive: {
        true: "cursor-pointer active:translate-y-[1px]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "none",
      interactive: false,
    },
  }
);

export interface GlassCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>,
    VariantProps<typeof glassCardVariants> {
  // Add any additional properties here
  disableMotion?: boolean;
  motionProps?: Partial<HTMLMotionProps<"div">>;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A modern glass-effect card component with various style variants
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    hover,
    interactive,
    disableMotion = false,
    motionProps = {},
    ...props 
  }, ref) => {
    const combinedClassName = cn(
      glassCardVariants({ variant, size, hover, interactive }), 
      className
    );
    
    if (disableMotion) {
      return (
        <div
          ref={ref}
          className={combinedClassName}
          {...props}
        />
      );
    }
    
    // Cast to avoid TypeScript errors with motion props
    const safeProps = props as Omit<React.HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>;
    
    return (
      <motion.div
        ref={ref}
        className={combinedClassName}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        {...motionProps}
        {...safeProps}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;