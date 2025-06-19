import { cn } from "@/lib/utils";

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'dark';
  hover?: string;
  disableMotion?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  variant = 'default',
  hover,
  disableMotion = false
}: GlassCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'light':
        return "bg-white/20 border-white/30";
      case 'dark':
        return "bg-black/20 border-white/10";
      default:
        return "bg-white/10 border-white/20";
    }
  };

  const hoverStyles = hover ? `hover:${hover}` : '';
  
  return (
    <div className={cn(
      "relative backdrop-blur-lg",
      getVariantStyles(),
      "shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] rounded-2xl",
      "overflow-hidden text-white transition-all duration-300",
      hoverStyles,
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;