import { ReactNode } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/glass-card";

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
    <div className={`bg-gradient-to-b from-white via-white to-blue-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/10 py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              {title && (
                <motion.h2 
                  className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {title}
                </motion.h2>
              )}
              {subtitle && (
                <motion.p 
                  className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {subtitle}
                </motion.p>
              )}
            </motion.div>
          </div>
        )}
        
        <div className={`grid ${gridColumns} gap-8 md:gap-10`}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 15 } }}
            >
              <GlassCard 
                className="h-full relative overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm" 
                variant="default"
                hover="lift"
              >
                {/* Apple-style subtle glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-xl translate-y-8 -translate-x-8"></div>
                
                <div className="relative z-10 p-1">
                  {/* Icon with enhanced animation */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      className="p-3 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 shadow-sm group-hover:shadow transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-indigo-100 group-hover:to-blue-100 dark:group-hover:from-indigo-900/40 dark:group-hover:to-blue-900/40"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, 5, 0, -5, 0],
                        transition: { 
                          rotate: {
                            duration: 1.5, 
                            ease: "easeInOut", 
                            repeat: Infinity,
                          },
                          scale: {
                            duration: 0.3,
                            type: "spring"
                          }
                        }
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  
                  <div className="text-center px-2">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                
                {/* Apple-style subtle highlight element */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500/0 via-blue-500/30 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}