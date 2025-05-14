import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { COLORS } from "@/config";
import GradientButton from "@/components/gradient-button";

/**
 * The hero section for the B2C audience
 */
export default function Hero() {
  const [, navigate] = useLocation();

  const handlePreTestClick = () => {
    navigate('/auth');
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      }
    },
  };

  return (
    <section 
      id="for-users" 
      className="w-full py-16 md:py-24 lg:py-32 overflow-hidden relative"
    >
      {/* Animated blobs background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-[10%] right-[15%] bg-blue-500/30 w-96 h-96 rounded-full blur-3xl"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ 
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[10%] bg-cyan-400/20 w-80 h-80 rounded-full blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1,
          }}
        />
        <motion.div 
          className="absolute top-[40%] left-[45%] bg-sky-300/20 w-64 h-64 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ 
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>

      <div className="container px-4 md:px-6 mx-auto">
        <motion.div 
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Main headline */}
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
            variants={item}
          >
            Smarter Insurance Starts Here
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl"
            variants={item}
          >
            Compare, choose, and understand insurance in seconds.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={item}>
            <GradientButton
              size="lg"
              onClick={handlePreTestClick}
              className="px-8 py-4 text-base sm:text-lg shadow-xl"
              gradientFrom="from-blue-600"
              gradientTo="to-cyan-500"
              icon={<ArrowRight className="ml-2 h-5 w-5" />}
              iconPosition="right"
            >
              Pre-Test the App
            </GradientButton>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Beta access now open.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}