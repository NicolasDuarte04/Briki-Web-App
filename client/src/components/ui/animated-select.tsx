import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// The interface for the SelectTrigger props
interface AnimatedSelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectTrigger> {
  isValid?: boolean;
  isInvalid?: boolean;
}

// The interface for the AnimatedSelect props
interface AnimatedSelectProps {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  children: React.ReactNode;
  placeholder?: string;
  isValid?: boolean;
  isInvalid?: boolean;
  className?: string;
  triggerClassName?: string;
}

// Animated Select Trigger component
const AnimatedSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  AnimatedSelectTriggerProps
>(({ className, isValid, isInvalid, ...props }, ref) => {
  // Combine regular styling with validation styling
  const triggerClassName = cn(
    "transition-all duration-200 hover:border-primary/80 focus:border-primary",
    className,
    isInvalid && "border-destructive focus-visible:ring-destructive/30",
    isValid && "border-green-500 focus-visible:ring-green-500/30"
  );

  return (
    <motion.div
      animate={isInvalid ? "invalid" : isValid ? "valid" : "idle"}
      variants={{
        idle: {},
        valid: { y: [0, -2, 0], scale: [1, 1.02, 1] },
        invalid: { x: [0, -5, 5, -5, 5, 0] }
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <SelectTrigger ref={ref} className={triggerClassName} {...props} />
    </motion.div>
  );
});

AnimatedSelectTrigger.displayName = "AnimatedSelectTrigger";

// Main AnimatedSelect component
const AnimatedSelect = ({
  onValueChange,
  defaultValue,
  value,
  children,
  placeholder,
  isValid,
  isInvalid,
  className,
  triggerClassName,
}: AnimatedSelectProps) => {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
    >
      <AnimatedSelectTrigger
        className={triggerClassName}
        isValid={isValid}
        isInvalid={isInvalid}
      >
        <SelectValue placeholder={placeholder} />
      </AnimatedSelectTrigger>
      <SelectContent 
        className={cn(
          "shadow-lg border-primary/20 backdrop-blur-sm bg-background/95", 
          className
        )}
      >
        {children}
      </SelectContent>
    </Select>
  );
};

export { AnimatedSelect, AnimatedSelectTrigger };