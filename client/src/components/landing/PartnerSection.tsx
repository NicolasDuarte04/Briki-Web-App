import { motion } from "framer-motion";
import { ArrowRight, PieChart, LineChart, BarChart3, Database } from "lucide-react";
import { useLocation } from "wouter";
import { COLORS } from "@/config";
import GradientButton from "@/components/gradient-button";
import GlassCard from "@/components/glass-card";

/**
 * The insurance partner section for the B2B audience
 */
export default function PartnerSection() {
  const [, navigate] = useLocation();

  const handlePartnerClick = () => {
    navigate('/company-login-new');
  };

  const features = [
    {
      icon: <Database className="h-6 w-6 text-white" />,
      title: "AI-Driven Analytics",
      description: "Leverage cutting-edge AI to understand market trends and customer needs."
    },
    {
      icon: <LineChart className="h-6 w-6 text-white" />,
      title: "Growth Opportunities",
      description: "Tap into new customer segments through our global marketplace."
    },
    {
      icon: <PieChart className="h-6 w-6 text-white" />,
      title: "Customizable Dashboard",
      description: "Monitor performance with real-time insights and reporting tools."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      title: "Enhanced Visibility",
      description: "Showcase your products to qualified, high-intent insurance shoppers."
    }
  ];

  return (
    <section 
      id="for-partners" 
      className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[#001d49] to-[#003087] text-white overflow-hidden relative"
    >
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0iIzEyMjQzNiIgc3Ryb2tlLXdpZHRoPSIuNSI+PHBhdGggZD0iTTYwIDBoLTYwdjYwaDYweiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      
      {/* Glow effects */}
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full" 
        style={{ 
          background: `radial-gradient(circle, ${COLORS.glow}10 0%, rgba(0,48,135,0) 70%)`,
          filter: "blur(60px)"
        }}
      ></div>
      
      <div 
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${COLORS.accent}10 0%, rgba(0,48,135,0) 70%)`,
          filter: "blur(60px)"
        }}
      ></div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Main content */}
          <motion.div 
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-[#33BFFF]">Insurance Companies:</span> <span className="text-white text-shadow-sm drop-shadow-md">Supercharge Your Distribution</span>
            </h2>
            <p className="text-lg text-blue-100/90 mb-8 leading-relaxed">
              Join Colombia and Mexico's most advanced insurance marketplace. Briki's AI-powered platform connects you directly with qualified customers seeking your exact offerings.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <GradientButton
                size="lg"
                onClick={handlePartnerClick}
                className="px-6 py-3 text-base shadow-lg"
                gradientFrom="from-[#0074FF]"
                gradientTo="to-[#33BFFF]"
                icon={<ArrowRight className="ml-2 h-5 w-5" />}
                iconPosition="right"
              >
                Partner With Us
              </GradientButton>
            </motion.div>
          </motion.div>
          
          {/* Features grid */}
          <motion.div 
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + (index * 0.1) 
                }}
              >
                <GlassCard
                  className="h-full p-5"
                  variant="dark"
                  hover="glow"
                  disableMotion={true}
                >
                  <div className="rounded-md bg-[#0074FF]/20 w-10 h-10 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100/80 text-sm">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}