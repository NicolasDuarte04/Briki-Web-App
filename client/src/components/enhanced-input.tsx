import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Enhanced input component with Apple-inspired styling
 * Features floating label, error handling, and optional icon
 */
export const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ label, description, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={props.id} 
            className="text-sm font-medium text-foreground/90"
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <Input
            ref={ref}
            className={cn(
              "h-12 px-4 bg-white dark:bg-[rgba(22,25,37,0.7)] rounded-xl border transition-all duration-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "hover:border-primary/50",
              error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        
        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export default EnhancedInput;