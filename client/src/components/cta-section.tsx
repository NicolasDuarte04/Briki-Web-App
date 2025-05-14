import { ReactNode } from "react";
import { motion } from "framer-motion";
import GradientButton from "@/components/gradient-button";

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
    <div className={`bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} py-16 relative overflow-hidden ${className}`}>
      {/* Decorative Elements - Stripe-like floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-[10%] right-[20%] rounded-full bg-white/10 w-72 h-72 blur-2xl"
          animate={{
            y: [0, 10, 0],
            opacity: [0.1, 0.12, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[15%] rounded-full bg-white/10 w-56 h-56 blur-2xl"
          animate={{
            y: [0, -10, 0],
            opacity: [0.08, 0.1, 0.08],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            {description}
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <GradientButton
              size="lg"
              className="px-8 py-3 text-lg bg-white text-indigo-600 hover:bg-white/90 shadow-xl"
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