import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'auth' | 'home';
}

const AnimatedBackground = ({ 
  children, 
  className,
  variant = 'default'
}: AnimatedBackgroundProps) => {
  const getGradientClasses = () => {
    switch (variant) {
      case 'auth':
        return "bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400";
      case 'home':
        return "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500";
      default:
        return "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500";
    }
  };

  return (
    <div className={cn(
      "relative min-h-screen overflow-hidden",
      getGradientClasses(),
      className
    )}>
      {/* Background mesh gradient effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-purple-500/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-[10%] w-[50%] h-[50%] bg-gradient-to-tl from-sky-400/40 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-md"
            style={{
              width: `${Math.random() * 10 + 5}rem`,
              height: `${Math.random() * 10 + 5}rem`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15, 0],
              y: [0, Math.random() * 30 - 15, 0],
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground;