import { ReactNode } from "react";
import { motion } from "framer-motion";
import GradientButton from "./gradient-button";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  onButtonClick?: () => void;
  className?: string;
  gradientColors?: {
    from: string;
    to: string;
  };
  buttonGradient?: {
    from: string;
    to: string;
  };
}

export default function CTASection({
  title = "Ready to find your perfect insurance match?",
  description = "Let our AI technology guide you to the best coverage options for your needs",
  buttonText = "Get Started Now",
  buttonIcon,
  onButtonClick,
  className = "",
  gradientColors = {
    from: "from-indigo-600",
    to: "to-blue-500",
  },
  buttonGradient = {
    from: "from-white",
    to: "to-white/90",
  },
}: CTASectionProps) {
  return (
    <div className={`bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} py-24 relative overflow-hidden ${className}`}>
      {/* Apple-style glassmorphism backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/0 backdrop-blur-[2px]"></div>
      
      {/* Apple-style decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large primary glow */}
        <motion.div 
          className="absolute top-[10%] right-[20%] rounded-full bg-white/15 w-80 h-80 blur-3xl"
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary glow */}
        <motion.div 
          className="absolute bottom-[10%] left-[15%] rounded-full bg-white/10 w-64 h-64 blur-3xl"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        {/* Smaller accent glows */}
        <motion.div 
          className="absolute top-[40%] left-[30%] rounded-full bg-white/5 w-32 h-32 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <motion.div 
          className="absolute bottom-[30%] right-[30%] rounded-full bg-white/5 w-40 h-40 blur-2xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 50,
            damping: 20
          }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Apple-style typography */}
          <motion.h2 
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white mb-5 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/90 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>
          
          {/* Apple-style button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -8, 
              scale: 1.03,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 15 
              } 
            }}
            whileTap={{ scale: 0.97 }}
          >
            <GradientButton
              size="lg"
              className="px-10 py-4 text-lg bg-white text-indigo-600 hover:bg-white/95 shadow-xl backdrop-blur-sm rounded-full border border-white/10"
              onClick={onButtonClick}
              gradientFrom={buttonGradient.from}
              gradientTo={buttonGradient.to}
              icon={buttonIcon}
            >
              {buttonText}
            </GradientButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}