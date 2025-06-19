import { motion } from "framer-motion";
import { Shield, Zap, Globe, Heart, Bot, MessageSquareText } from "lucide-react";
import { GlassCard } from "@/components/auth/GlassCard";

/**
 * Consumer features section highlighting key Briki platform benefits
 */
export default function Features() {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Multi-Category Coverage",
      description: "Compare plans across travel, auto, pet, and health insurance categories to find the perfect fit."
    },
    {
      icon: <Bot className="h-6 w-6 text-blue-500" />,
      title: "AI-Powered Assistant",
      description: "Get answers, recommendations, and navigation in seconds with our intelligent conversation assistant."
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      title: "Smart Recommendations",
      description: "Receive personalized suggestions based on your unique needs and profile."
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      title: "Global Coverage Options",
      description: "Find insurance solutions that work across Colombia, Mexico, and beyond."
    },
    {
      icon: <Heart className="h-6 w-6 text-blue-500" />,
      title: "Human-Centered Design",
      description: "Our platform is built with real people in mind, making insurance simple to understand."
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50/80 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Insurance, <span className="text-blue-600 dark:text-blue-400">Simplified</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Briki brings together everything you need to make informed insurance decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 50 
              }}
            >
              <GlassCard
                className="h-full p-6 bg-blue-50/30 dark:bg-blue-900/10 hover:shadow-lg transition-all duration-300"
              >
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}