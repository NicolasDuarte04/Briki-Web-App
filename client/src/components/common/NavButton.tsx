import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavButtonProps extends ButtonProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  badge?: number | string;
}

export default function NavButton({ 
  to, 
  icon, 
  label, 
  badge, 
  className, 
  variant = "ghost", 
  ...props 
}: NavButtonProps) {
  const [location] = useLocation();
  const isActive = location === to || (to !== '/' && location.startsWith(to));
  
  return (
    <Button
      asChild
      variant={isActive ? "default" : variant}
      className={cn(
        "flex items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-all",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
        className
      )}
      {...props}
    >
      <Link href={to}>
        <span className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span>{label}</span>
          {badge && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
              {badge}
            </span>
          )}
        </span>
      </Link>
    </Button>
  );
}