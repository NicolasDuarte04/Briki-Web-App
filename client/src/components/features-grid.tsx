import { ReactNode } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/glass-card";

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

interface FeaturesGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
  columns?: number;
}

export default function FeaturesGrid({
  title = "Advanced Features for Smart Insurance",
  subtitle = "Powered by AI technology to provide you with the best insurance experience",
  features,
  className = "",
  columns = 4,
}: FeaturesGridProps) {
  // Determine grid columns based on the columns prop
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`bg-gradient-to-b from-white to-indigo-50/50 dark:from-gray-900 dark:to-gray-800 py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              {title && (
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-3 max-w-2xl mx-auto text-xl text-foreground/70">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>
        )}
        
        <div className={`grid ${gridColumns} gap-8`}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
            >
              <GlassCard 
                className="h-full relative overflow-hidden group" 
                variant="default"
                hover="lift"
              >
                {/* Stripe-style blur effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="p-2 bg-primary/10 rounded-lg inline-flex mb-4 transition-colors duration-300 group-hover:bg-primary/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}