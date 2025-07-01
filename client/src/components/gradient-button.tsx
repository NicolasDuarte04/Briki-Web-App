import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * A customized button component with gradient background
 */
const GradientButton = ({
  children,
  gradientFrom = "from-blue-600",
  gradientTo = "to-cyan-500",
  className,
  icon,
  iconPosition = "left",
  size = "default",
  ...props
}: GradientButtonProps) => {
  return (
    <Button
      className={cn(
        `bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:shadow-lg transition-all duration-300 text-white flex items-center justify-center gap-2`,
        className
      )}
      size={size}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </Button>
  );
};

export default GradientButton;