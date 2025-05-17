import React, { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  onIconRightClick?: () => void;
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    label, 
    error, 
    icon, 
    iconRight, 
    onIconRightClick,
    type = "text",
    ...props 
  }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              "w-full rounded-xl text-sm text-gray-700 py-3 transition-all duration-200",
              "placeholder:text-gray-400/80 focus:ring-2 focus:ring-blue-500/30",
              "bg-white/90 backdrop-blur-sm border border-white/40 shadow-sm",
              "focus:border-blue-400 focus:outline-none",
              icon ? "pl-10" : "pl-4",
              iconRight ? "pr-10" : "pr-4",
              error ? "border-red-300 focus:ring-red-500/30 focus:border-red-400" : "",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {iconRight && (
            <div 
              className={cn(
                "absolute inset-y-0 right-3 flex items-center text-gray-400",
                onIconRightClick ? "cursor-pointer hover:text-gray-600" : "pointer-events-none"
              )}
              onClick={onIconRightClick}
            >
              {iconRight}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1.5 text-sm text-red-500 ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export default EnhancedInput;