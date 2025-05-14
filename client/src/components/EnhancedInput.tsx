import React, { useState, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import '@/styles/design-system.css';

export type ValidationRule = {
  check: (value: string) => boolean;
  message: string;
};

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  validations?: ValidationRule[];
  showValidationStatus?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      label,
      helperText,
      error,
      type = 'text',
      leftIcon,
      rightIcon,
      validations = [],
      showValidationStatus = false,
      className = '',
      containerClassName = '',
      labelClassName = '',
      helperClassName = '',
      errorClassName = '',
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validationState, setValidationState] = useState<boolean | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = useRef<HTMLInputElement | null>(null);

    // Set up combined ref
    React.useEffect(() => {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
      combinedRef.current = inputRef.current;
    }, [ref]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      props.onBlur?.(e);

      // Validate on blur if validations exist
      if (validations.length > 0 && e.target.value) {
        const isValid = validations.every((rule) => rule.check(e.target.value));
        setValidationState(isValid);
      } else {
        setValidationState(null);
      }
    };

    // Determine current input type
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Apply different styles based on state
    const containerStyles = `input-container ${containerClassName}`;
    
    const inputStyles = `
      input 
      ${leftIcon ? 'pl-10' : ''} 
      ${rightIcon || (type === 'password') || showValidationStatus ? 'pr-10' : ''} 
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''} 
      ${validationState === true ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : ''} 
      ${validationState === false ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-200' : ''} 
      ${focused ? 'border-accent-blue ring-2 ring-accent-blue/20' : ''}
      ${className}
    `;

    return (
      <div className={containerStyles}>
        {/* Label */}
        {label && (
          <label htmlFor={props.id || props.name} className={`input-label ${labelClassName}`}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 flex items-center justify-center w-5 h-5">
              {leftIcon}
            </div>
          )}
          
          {/* Input element */}
          <input
            ref={inputRef}
            type={inputType}
            className={inputStyles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {/* Right content - either icon, validation status, or password toggle */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {/* Show validation status */}
            {showValidationStatus && validationState !== null && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`status-${validationState}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={`w-5 h-5 flex items-center justify-center rounded-full ${
                    validationState ? 'text-green-500' : 'text-orange-500'
                  }`}
                >
                  {validationState ? <Check size={16} /> : <X size={16} />}
                </motion.div>
              </AnimatePresence>
            )}
            
            {/* Password visibility toggle */}
            {type === 'password' && (
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            
            {/* Custom right icon */}
            {rightIcon && rightIcon}
          </div>
        </div>
        
        {/* Helper text or error message */}
        {(helperText || error) && (
          <div className="mt-1 text-sm">
            {error ? (
              <p className={`text-red-500 ${errorClassName}`}>{error}</p>
            ) : helperText ? (
              <p className={`text-gray-500 ${helperClassName}`}>{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

export default EnhancedInput;