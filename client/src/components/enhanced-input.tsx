import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const enhancedInputVariants = cva(
  "group relative w-full",
  {
    variants: {
      variant: {
        default: "",
        apple: "",
        minimal: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ValidationRule {
  check: (value: string) => boolean;
  message: string;
}

export interface EnhancedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof enhancedInputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // for backward compatibility
  hideLabel?: boolean;
  validations?: ValidationRule[];
  showValidationStatus?: boolean;
  validIcon?: React.ReactNode;
  invalidIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
  inputContainerClassName?: string;
}

/**
 * Enhanced input component with multiple variants and built-in features
 */
const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({
    className,
    containerClassName,
    labelClassName,
    helperClassName,
    errorClassName,
    inputContainerClassName,
    type = "text",
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    icon, // backward compatibility
    variant,
    size,
    hideLabel = false,
    validations = [],
    showValidationStatus = false,
    validIcon = <Check className="h-4 w-4 text-green-500" />,
    invalidIcon = <AlertCircle className="h-4 w-4 text-red-500" />,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [validationState, setValidationState] = useState<boolean | null>(null);
    const [validationMessage, setValidationMessage] = useState<string>("");
    // Instead of using innerRef which causes TypeScript errors, use state to track the element
    const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    
    // Handle ref combination without causing type errors
    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        // Pass to the forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          // Using a type assertion to correctly assign the ref
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
        
        // Store a reference to the node for internal use
        // Skip setting the ref directly to avoid TypeScript errors
        if (node) {
          // Store reference for our internal use in a way that doesn't trigger TypeScript errors
          setInputElement(node);
        }
      },
      [ref]
    );
    
    // Update hasValue when input changes or props update
    useEffect(() => {
      // Set initial value state based on props
      if (props.value !== undefined) {
        setHasValue(!!props.value);
      } else if (props.defaultValue !== undefined) {
        setHasValue(!!props.defaultValue);
      }
      
      // Setup listener for future changes
      const handleInput = () => {
        if (inputElement) {
          setHasValue(!!inputElement.value);
        }
      };
      if (inputElement) {
        // Apply initial focus if autofocus is set
        if (props.autoFocus) {
          setTimeout(() => {
            inputElement.focus();
          }, 0);
        }
        
        inputElement.addEventListener('input', handleInput);
        return () => {
          inputElement.removeEventListener('input', handleInput);
        };
      }
    }, [props.value, props.defaultValue, props.autoFocus]);
    
    // Run validations
    useEffect(() => {
      if (validations.length === 0 || !hasValue) {
        setValidationState(null);
        setValidationMessage("");
        return;
      }
      
      const value = innerRef.current?.value || "";
      
      for (const rule of validations) {
        if (!rule.check(value)) {
          setValidationState(false);
          setValidationMessage(rule.message);
          return;
        }
      }
      
      setValidationState(true);
      setValidationMessage("");
    }, [hasValue, validations]);
    
    // Determine input type based on password visibility
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
    
    // Handle password visibility toggle
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    
    // Handle focus events
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };
    
    // Prepare class names
    const inputWrapperClassNames = cn(
      enhancedInputVariants({ variant, size }),
      containerClassName
    );
    
    // Define the default styling for various components
    let inputContainerStyles = "relative";
    let inputStyles = cn(
      "w-full rounded-lg transition-all duration-200 pr-10 font-medium placeholder:font-medium placeholder:text-gray-500",
      (leftIcon || icon) && "pl-12", // Fixed left padding for both icon types to prevent overlap
      "hover:border-primary/60 focus:border-primary/80 focus:ring-2 focus:ring-primary/20",
      className
    );
    let labelStyles = cn(
      "transition-all duration-200 select-none",
      labelClassName
    );
    
    // Apply styling based on variant
    if (variant === "apple") {
      inputContainerStyles = cn(
        inputContainerStyles,
        "rounded-lg bg-gray-100/40 border border-gray-200 backdrop-blur-sm focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/30 transition-all"
      );
      
      inputStyles = cn(
        inputStyles,
        "py-3 px-4 bg-transparent border-0 focus:ring-0 placeholder:text-gray-400/80",
        error ? "text-red-500" : "text-foreground"
      );
      
      if (label) {
        labelStyles = cn(
          labelStyles,
          "absolute left-4 pointer-events-none",
          hasValue || isFocused
            ? "top-1 text-xs text-primary/80 font-medium"
            : "top-[14px] text-sm text-gray-500",
        );
      }
    } else if (variant === "minimal") {
      inputContainerStyles = cn(
        inputContainerStyles,
        "border-b border-gray-200 focus-within:border-primary transition-all"
      );
      
      inputStyles = cn(
        inputStyles,
        "bg-transparent border-0 rounded-none px-0 pt-6 pb-2 focus:ring-0",
        error ? "text-red-500" : "text-foreground"
      );
      
      if (label) {
        labelStyles = cn(
          labelStyles,
          "absolute left-0 pointer-events-none",
          hasValue || isFocused
            ? "top-1 text-xs text-primary/80 font-medium"
            : "top-[26px] text-base text-gray-500",
        );
      }
    } else {
      // Default variant
      inputContainerStyles = cn(
        inputContainerStyles,
        "rounded-lg focus-within:ring-2 focus-within:ring-primary/20 transition-all"
      );
      
      inputStyles = cn(
        inputStyles
      );
      
      if (label && !hideLabel) {
        labelStyles = cn(
          labelStyles,
          "mb-2 block text-sm font-semibold text-gray-700"
        );
      }
    }
    
    // Apply error styling
    if (error) {
      inputContainerStyles = cn(
        inputContainerStyles,
        "border-red-300 focus-within:border-red-500 focus-within:ring-red-200"
      );
    }
    
    // Apply full custom styles if provided
    inputContainerStyles = cn(inputContainerStyles, inputContainerClassName);

    return (
      <div className={inputWrapperClassNames}>
        {/* Label for default variant */}
        {label && !hideLabel && variant === "default" && (
          <Label htmlFor={props.id} className={labelStyles}>
            {label}
          </Label>
        )}
        
        <div className={inputContainerStyles}>
          {/* Label for apple and minimal variants */}
          {label && !hideLabel && (variant === "apple" || variant === "minimal") && (
            <Label htmlFor={props.id} className={labelStyles}>
              {label}
            </Label>
          )}
          
          {/* Left icon */}
          {(leftIcon || icon) && (
            <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center text-gray-500">
              {leftIcon || icon}
            </div>
          )}
          
          {/* Input element with improved initialization */}
          <Input
            {...props}
            ref={combinedRef}
            type={inputType}
            className={inputStyles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              // Ensure onChange handler is properly called even for first keystroke
              if (props.onChange) {
                props.onChange(e);
              }
              // This helps ensure state is properly updated on first keystroke
              setHasValue(!!e.target.value);
            }}
          />
          
          {/* Right content - either custom icon, validation status, or password toggle */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Show validation status */}
            {showValidationStatus && validationState !== null && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={validationState ? "valid" : "invalid"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {validationState ? validIcon : invalidIcon}
                </motion.div>
              </AnimatePresence>
            )}
            
            {/* Password visibility toggle */}
            {type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            
            {/* Custom right icon */}
            {rightIcon && rightIcon}
          </div>
        </div>
        
        {/* Helper text or error message */}
        {(helperText || error || validationMessage) && (
          <AnimatePresence mode="wait">
            <motion.div
              key={error || validationMessage || helperText}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p
                className={cn(
                  "text-xs mt-1.5 px-1",
                  error
                    ? cn("text-red-500", errorClassName)
                    : validationMessage && !validationState
                    ? cn("text-amber-500", errorClassName) 
                    : cn("text-gray-500", helperClassName)
                )}
              >
                {error || validationMessage || helperText}
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export default EnhancedInput;