import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: "default" | "muted" | "gradient" | "gradient-reverse" | "dots" | "mesh";
  divider?: "curve" | "wave" | "slant" | "none";
  dividerPosition?: "top" | "bottom" | "both";
}

export function Section({ 
  children, 
  className,
  background = "default",
  divider = "none",
  dividerPosition = "bottom"
}: SectionProps) {
  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted/30",
    gradient: "bg-gradient-to-br from-primary/5 via-background to-cyan-50/50 dark:from-primary/10 dark:via-background dark:to-cyan-950/20",
    "gradient-reverse": "bg-gradient-to-tl from-cyan-50/50 via-background to-primary/5 dark:from-cyan-950/20 dark:via-background dark:to-primary/10",
    dots: "bg-dot-pattern",
    mesh: "bg-mesh-gradient"
  };

  const showTopDivider = divider !== "none" && (dividerPosition === "top" || dividerPosition === "both");
  const showBottomDivider = divider !== "none" && (dividerPosition === "bottom" || dividerPosition === "both");

  return (
    <section className={cn("relative overflow-hidden", backgroundClasses[background], className)}>
      {/* Top Divider */}
      {showTopDivider && <SectionDivider type={divider} position="top" />}
      
      {/* Background Patterns */}
      {background === "dots" && (
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] dark:opacity-[0.05]" />
      )}
      
      {background === "mesh" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-400/20 opacity-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom Divider */}
      {showBottomDivider && <SectionDivider type={divider} position="bottom" />}
    </section>
  );
}

function SectionDivider({ type, position }: { type: string; position: "top" | "bottom" }) {
  const isTop = position === "top";
  
  const dividers = {
    curve: (
      <svg
        className={cn(
          "absolute left-0 w-full h-24",
          isTop ? "top-0 rotate-180" : "bottom-0"
        )}
        preserveAspectRatio="none"
        viewBox="0 0 1440 74"
      >
        <path
          d="M0,32L48,37.3C96,43,192,53,288,56C384,59,480,53,576,42.7C672,32,768,16,864,16C960,16,1056,32,1152,37.3C1248,43,1344,37,1392,34.7L1440,32L1440,74L1392,74C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74L0,74Z"
          className="fill-background"
        />
      </svg>
    ),
    wave: (
      <svg
        className={cn(
          "absolute left-0 w-full h-32",
          isTop ? "top-0 rotate-180" : "bottom-0"
        )}
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
      >
        <path
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          className="fill-background"
        />
      </svg>
    ),
    slant: (
      <div
        className={cn(
          "absolute left-0 w-full h-24 bg-background",
          isTop ? "top-0 -skew-y-3" : "bottom-0 skew-y-3"
        )}
      />
    )
  };

  return dividers[type as keyof typeof dividers] || null;
}

// Animated background blob component
export function AnimatedBlob({ 
  className,
  color = "primary",
  size = "large",
  delay = 0 
}: { 
  className?: string;
  color?: "primary" | "cyan" | "amber";
  size?: "small" | "medium" | "large";
  delay?: number;
}) {
  const sizes = {
    small: "h-32 w-32",
    medium: "h-64 w-64",
    large: "h-96 w-96"
  };

  const colors = {
    primary: "bg-primary/20",
    cyan: "bg-cyan-400/20",
    amber: "bg-amber-400/20"
  };

  return (
    <motion.div
      className={cn(
        "absolute rounded-full blur-3xl",
        sizes[size],
        colors[color],
        className
      )}
      animate={{
        x: [0, 30, 0],
        y: [0, -30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
} 