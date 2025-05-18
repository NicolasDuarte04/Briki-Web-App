import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  icon?: ReactNode;
}

/**
 * A customized button component with gradient background
 */
const GradientButton = ({
  children,
  gradientFrom = "from-blue-600",
  gradientTo = "to-indigo-600",
  className,
  icon,
  ...props
}: GradientButtonProps) => {
  return (
    <Button
      className={cn(
        `bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:shadow-lg transition-all duration-300 text-white flex items-center justify-center space-x-2`,
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Button>
  );
};

export default GradientButton;