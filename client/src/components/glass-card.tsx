import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

const glassCardVariants = cva(
  "relative overflow-hidden rounded-xl border shadow-sm backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "bg-white/60 border-gray-100/40 shadow-gray-200/30",
        dark: "bg-gray-900/70 border-gray-700/50 shadow-gray-900/40 text-white",
        blue: "bg-blue-50/60 border-blue-100/40 shadow-blue-200/30",
        primary: "bg-primary/10 border-primary/20 shadow-primary/20",
        danger: "bg-red-50/60 border-red-100/40 shadow-red-200/30",
        warning: "bg-orange-50/60 border-orange-100/40 shadow-orange-200/30",
        success: "bg-green-50/60 border-green-100/40 shadow-green-200/30",
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
        lift: "hover:translate-y-[-4px] transition-transform",
        glow: "hover:shadow-lg hover:shadow-primary/20 transition-shadow",
        border: "hover:border-primary/40 transition-colors",
        full: "hover:translate-y-[-4px] hover:shadow-lg hover:shadow-primary/20 hover:border-primary/40 transition-all",
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
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  // Add any additional properties here
  disableMotion?: boolean;
  motionProps?: HTMLMotionProps<"div">;
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
    
    return (
      <motion.div
        ref={ref}
        className={combinedClassName}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        {...motionProps}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;