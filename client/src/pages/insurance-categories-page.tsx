import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { InsuranceCategory } from "@shared/schema";

// Import our new components
import AnimatedBackground from "@/components/animated-background";
import GlassCard from "@/components/glass-card";
import GradientButton from "@/components/gradient-button";
import Navbar from "@/components/navbar-new";

// Icons
import { Plane, Car, Heart, Cat, HelpCircle, ChevronRight } from "lucide-react";

/**
 * Insurance Categories Page - Shows all available insurance types
 */
export default function InsuranceCategoriesPage() {
  const [, navigate] = useLocation();
  const [hoveredCategory, setHoveredCategory] = useState<InsuranceCategory | null>(null);

  // Category definitions 
  const categories = [
    {
      id: "travel" as InsuranceCategory,
      name: "Travel Insurance",
      description: "Comprehensive coverage for international and domestic travel",
      icon: <Plane size={24} />,
      gradient: "from-[#4C6EFF] to-[#5F9FFF]",
      active: true, // Only travel is currently implemented fully
    },
    {
      id: "auto" as InsuranceCategory,
      name: "Auto Insurance",
      description: "Protection for your vehicle and third-party liability",
      icon: <Car size={24} />,
      gradient: "from-[#4F6AFF] to-[#33C1FF]",
      active: false,
    },
    {
      id: "health" as InsuranceCategory,
      name: "Health Insurance",
      description: "Medical coverage for individuals and families",
      icon: <Heart size={24} />,
      gradient: "from-[#F43F5E] to-[#FB7185]", 
      active: false,
    },
    {
      id: "pet" as InsuranceCategory,
      name: "Pet Insurance",
      description: "Care for your pets with veterinary coverage",
      icon: <Paw size={24} />,
      gradient: "from-[#6E59FF] to-[#A289FF]",
      active: false,
    }
  ];

  // Handle category selection
  const handleCategoryClick = (category: InsuranceCategory) => {
    const isActive = categories.find(c => c.id === category)?.active;
    
    if (isActive) {
      if (category === "travel") {
        navigate("/trip-info");
      } else {
        // For future implementation of other categories
        navigate(`/${category}-info`);
      }
    } else {
      // Show "coming soon" toast or modal for inactive categories
      console.log(`${category} insurance coming soon!`);
    }
  };

  return (
    <AnimatedBackground variant="consumer" className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header with animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white drop-shadow-md">
              Choose Insurance Category
            </h1>
            <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
              Select the type of insurance you'd like to explore with Briki's AI-powered recommendation engine
            </p>
          </motion.div>
          
          {/* Category cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2 + index * 0.1,
                  ease: [0.21, 0.61, 0.35, 1]
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <GlassCard 
                  onClick={() => handleCategoryClick(category.id)}
                  className={`p-6 cursor-pointer transition-all overflow-hidden relative ${!category.active ? 'opacity-80' : ''}`}
                >
                  {/* Gradient background that appears on hover */}
                  <div
                    className={`
                      absolute inset-0 opacity-0 transition-opacity duration-300
                      ${hoveredCategory === category.id ? 'opacity-10' : ''}
                      bg-gradient-to-r ${category.gradient}
                    `}
                  />
                  
                  <div className="flex items-start">
                    {/* Icon with gradient background */}
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                      bg-gradient-to-r ${category.gradient} text-white
                    `}>
                      {category.icon}
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                      <p className="mt-1 text-white/70">{category.description}</p>
                    </div>
                    
                    <div className="ml-2 flex-shrink-0">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        bg-white/10 text-white transition-transform duration-300
                        ${hoveredCategory === category.id ? 'transform translate-x-1' : ''}
                      `}>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                  
                  {!category.active && (
                    <div className="mt-3 py-1 px-3 bg-white/20 rounded-full inline-flex items-center">
                      <span className="text-xs font-medium text-white">Coming Soon</span>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
          
          {/* Help button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <GradientButton
              variant="outline"
              size="lg"
              onClick={() => console.log("Need help clicked")}
              className="gap-2"
            >
              <HelpCircle size={18} />
              Need help choosing? Talk to our AI
            </GradientButton>
          </motion.div>
        </div>
      </main>
    </AnimatedBackground>
  );
}