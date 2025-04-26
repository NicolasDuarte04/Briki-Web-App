import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormMessage } from "@/components/ui/form";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Define props interface
interface AnimatedFormMessageProps {
  children?: React.ReactNode;
  className?: string;
  isValid?: boolean;
  showSuccessIcon?: boolean;
}

export function AnimatedFormMessage({
  children,
  className,
  isValid,
  showSuccessIcon = true,
}: AnimatedFormMessageProps) {
  const hasChildren = React.Children.count(children) > 0;
  
  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {/* Error Message Animation */}
        {hasChildren && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ 
              duration: 0.2,
              ease: "easeInOut"
            }}
            className="flex items-start gap-1.5"
          >
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <FormMessage className="flex-1">{children}</FormMessage>
          </motion.div>
        )}
        
        {/* Success Icon Animation - shown only when field is valid and has been interacted with */}
        {isValid && showSuccessIcon && !hasChildren && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              type: "spring",
              stiffness: 300, 
              damping: 15
            }}
            className="absolute right-2 -top-7"
          >
            <CheckCircle className="h-4 w-4 text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}