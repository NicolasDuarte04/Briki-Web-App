import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import GradientButton from "@/components/gradient-button";
import { COUNTDOWN_DATE } from "@/config";
import CountdownComponent from "./CountdownComponent";

/**
 * Call-to-action section with countdown for the landing page
 */
export default function CTASection() {
  const [, navigate] = useLocation();

  const handleSignupClick = () => {
    navigate('/auth');
  };

  const launchDate = new Date(COUNTDOWN_DATE);
  const formattedDate = launchDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 bg-blue-400/10 w-96 h-96 rounded-full blur-3xl"
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ 
            duration: 15,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 bg-indigo-400/10 w-96 h-96 rounded-full blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ 
            duration: 18,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Global Launch Coming Soon
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Briki's full platform launches on {formattedDate}. Sign up now for early access and exclusive benefits.
            </p>
            
            {/* Countdown component */}
            <div className="mb-10">
              <CountdownComponent size="medium" className="max-w-xl mx-auto" />
            </div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <GradientButton
                size="lg"
                onClick={handleSignupClick}
                className="px-8 py-4 text-base shadow-xl"
                gradientFrom="from-blue-600"
                gradientTo="to-indigo-600"
                icon={<ArrowRight className="ml-2 h-5 w-5" />}
                iconPosition="right"
              >
                Join the Beta
              </GradientButton>
            </motion.div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No credit card required. Beta access is completely free.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}