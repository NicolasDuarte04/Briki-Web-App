import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";

// Button animation variants
const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
  loading: { scale: 1 }
};

export interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  successText?: string;
  showSuccess?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    isLoading = false,
    loadingText,
    successText,
    showSuccess = false,
    children,
    ...props 
  }, ref) => {
    const [animateSuccess, setAnimateSuccess] = React.useState(false);
    
    React.useEffect(() => {
      if (showSuccess) {
        setAnimateSuccess(true);
        const timer = setTimeout(() => {
          setAnimateSuccess(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [showSuccess]);
    
    return (
      <motion.div
        whileHover={!isLoading ? "hover" : "loading"}
        whileTap={!isLoading ? "tap" : "loading"}
        initial="idle"
        animate={animateSuccess ? "success" : "idle"}
        variants={{
          ...buttonVariants,
          success: { 
            scale: [1, 1.1, 1],
            transition: { duration: 0.5 }
          }
        }}
      >
        <Button
          className={cn(className, animateSuccess && "bg-green-500 hover:bg-green-600")}
          variant={variant}
          size={size}
          ref={ref}
          disabled={isLoading}
          {...props}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingText || children}
            </>
          ) : animateSuccess ? (
            successText || "Success!"
          ) : (
            children
          )}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };