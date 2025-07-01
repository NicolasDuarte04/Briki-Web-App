import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Input } from "./input";

// Define props interface with all the HTML input element props
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isValid?: boolean;
  isInvalid?: boolean;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, isValid, isInvalid, ...props }, ref) => {
    // Combine regular styling with validation styling
    const inputClassName = cn(
      className,
      isInvalid && "border-destructive focus-visible:ring-destructive/30",
      isValid && "border-green-500 focus-visible:ring-green-500/30"
    );

    // We don't need animation end handler for motion components
    // as framer-motion handles all the animation states properly
    
    return (
      <motion.div
        animate={isInvalid ? "invalid" : isValid ? "valid" : "idle"}
        variants={{
          idle: {},
          valid: {},
          invalid: { x: [0, -5, 5, -5, 5, 0] }
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Input 
          ref={ref} 
          className={inputClassName}
          {...props}
        />
      </motion.div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };