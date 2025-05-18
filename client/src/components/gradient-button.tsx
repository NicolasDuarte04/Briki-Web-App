import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  icon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  gradientFrom?: string;
  gradientTo?: string;
  iconPosition?: "left" | "right";
}

const GradientButton = ({
  children,
  className,
  size = "md",
  variant = "primary",
  icon,
  loading = false,
  loadingText,
  gradientFrom,
  gradientTo,
  iconPosition = "left",
  ...props
}: GradientButtonProps) => {
  // Size classes
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };
  
  // Custom gradient if provided
  const customGradient = gradientFrom && gradientTo 
    ? `bg-gradient-to-r from-[${gradientFrom}] to-[${gradientTo}]`
    : "";

  // Variant classes
  const variantClasses = {
    primary: 
      customGradient || ("bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 " +
      "text-white shadow-md hover:shadow-lg border border-blue-400/50 hover:border-blue-600/50"),
    secondary: 
      customGradient || ("bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 " +
      "text-white shadow-md hover:shadow-lg border border-purple-400/50 hover:border-purple-600/50"),
    outline: 
      "bg-gradient-to-r from-transparent to-transparent hover:from-blue-50/10 hover:to-blue-100/10 " +
      "text-blue-500 border border-blue-400 hover:text-blue-600 hover:border-blue-500",
  };

  // Filter out custom props before passing to DOM element
  const domProps = {...props};
  delete (domProps as any).gradientFrom;
  delete (domProps as any).gradientTo;
  delete (domProps as any).iconPosition;

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center font-medium transition-all duration-200",
        "rounded-xl disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-blue-100/10",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={loading || domProps.disabled}
      {...domProps}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default GradientButton;