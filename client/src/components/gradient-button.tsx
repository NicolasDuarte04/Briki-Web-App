import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof Button> {
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";
  loading?: boolean;
  loadingText?: string;
  disableMotion?: boolean;
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

/**
 * A customizable gradient button component that extends the base Button component
 */
const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({
    className,
    gradientFrom = "from-[#3D70F5]",
    gradientTo = "to-[#59A0FF]",
    gradientDirection = "to-r",
    variant = "default",
    size = "default",
    type = "button",
    disabled = false,
    loading = false,
    loadingText,
    disableMotion = false,
    asChild = false,
    icon,
    iconPosition = "left",
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isLoading = loading || disabled;
    
    // Base gradient class
    const gradientClass = `bg-gradient-${gradientDirection} ${gradientFrom} ${gradientTo} hover:shadow-lg hover:shadow-${gradientFrom.replace("from-", "")}/30 active:scale-[0.98] font-semibold transition-all duration-300 border border-white/20`;
    
    // Choose button styling based on variant
    let buttonClass = className || "";
    if (variant === "default" || variant === "primary" || variant === "secondary") {
      buttonClass = cn(
        gradientClass,
        "text-white border-0",
        disabled ? "opacity-60 pointer-events-none" : "",
        buttonClass
      );
    } else if (variant === "outline") {
      buttonClass = cn(
        "border bg-transparent hover:bg-transparent",
        `hover:border-${gradientFrom.replace("from-", "")}/50`,
        `text-${gradientFrom.replace("from-", "")}`,
        disabled ? "opacity-60 pointer-events-none" : "",
        buttonClass
      );
    } else if (variant === "ghost") {
      buttonClass = cn(
        "bg-transparent hover:bg-transparent",
        `text-${gradientFrom.replace("from-", "")}`,
        `hover:bg-${gradientFrom.replace("from-", "")}/10`,
        disabled ? "opacity-60 pointer-events-none" : "",
        buttonClass
      );
    } else if (variant === "link") {
      buttonClass = cn(
        "bg-transparent p-0 h-auto hover:bg-transparent underline-offset-4 hover:underline",
        `text-${gradientFrom.replace("from-", "")}`,
        disabled ? "opacity-60 pointer-events-none" : "",
        buttonClass
      );
    }
    
    const content = (
      <>
        {loading ? (
          <div className="flex items-center justify-center gap-2.5">
            <Loader2
              className="h-5 w-5 animate-spin"
              aria-hidden="true"
            />
            <span className="font-semibold">{loadingText || "Loading..."}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {icon && iconPosition === "left" && (
              <span className="mr-2.5">{icon}</span>
            )}
            <span className="font-semibold">{children}</span>
            {icon && iconPosition === "right" && (
              <span className="ml-2.5">{icon}</span>
            )}
          </div>
        )}
      </>
    );
    
    if (disableMotion) {
      return (
        <Button
          ref={ref}
          type={type}
          variant="custom"
          size={size}
          className={buttonClass}
          disabled={isLoading}
          asChild={asChild}
          {...props}
        >
          {content}
        </Button>
      );
    }
    
    return (
      <Button
        ref={ref}
        type={type}
        variant="custom"
        size={size}
        className={buttonClass}
        disabled={isLoading}
        asChild
        {...props}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {content}
        </motion.button>
      </Button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;