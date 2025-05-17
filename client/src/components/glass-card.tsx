import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={cn(
      "relative bg-white/10 backdrop-blur-lg border border-white/20",
      "shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] rounded-2xl",
      "overflow-hidden text-white",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;