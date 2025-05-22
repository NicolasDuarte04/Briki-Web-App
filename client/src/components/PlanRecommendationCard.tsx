import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/lib/navigation';

export interface PlanFeature {
  text: string;
  color: string; // e.g. 'blue-500', 'cyan-500', etc.
}

export interface PlanProps {
  name: string;
  description: string;
  price: number; 
  priceUnit: string; // e.g. '/mo', '/yr', etc.
  features: PlanFeature[];
  category: 'health' | 'travel' | 'auto' | 'pet'; // Used for tag colors and navigation
  badge?: string; // Optional badge text like "Freelancer Friendly"
  delay?: number; // Animation delay in seconds
}

export default function PlanRecommendationCard({ 
  name, 
  description, 
  price, 
  priceUnit, 
  features, 
  category,
  badge,
  delay = 0
}: PlanProps) {
  const { navigate } = useNavigation();

  // Different gradient color schemes for different plan categories
  const gradientColors = {
    health: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800/30",
    travel: "from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800/30",
    auto: "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-100 dark:border-cyan-800/30",
    pet: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800/30"
  };

  // Different badge color schemes
  const badgeColors = {
    health: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400",
    travel: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-400",
    auto: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-400",
    pet: "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-400"
  };

  // Shield icon colors for different categories
  const shieldColors = {
    health: "text-blue-600 dark:text-blue-400",
    travel: "text-indigo-600 dark:text-indigo-400",
    auto: "text-cyan-600 dark:text-cyan-400",
    pet: "text-purple-600 dark:text-purple-400"
  };

  // Navigation links for different categories
  const viewAllLinks = {
    health: "/health/plans",
    travel: "/travel/plans",
    auto: "/auto/plans",
    pet: "/pet/plans"
  };

  return (
    <motion.div 
      className="overflow-hidden"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className={`bg-gradient-to-r ${gradientColors[category]} rounded-xl border p-4 shadow-sm`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Shield className={`h-5 w-5 ${shieldColors[category]} mr-2`} />
            <h4 className={`font-semibold text-sm ${shieldColors[category]}`}>RECOMMENDED PLAN</h4>
          </div>
          {badge && (
            <span className={`text-xs ${badgeColors[category]} px-2 py-1 rounded-full font-medium`}>
              {badge}
            </span>
          )}
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{name}</h3>
            <div className="text-green-600 dark:text-green-400 font-bold">
              ${price}<span className="text-xs font-normal text-gray-500 dark:text-gray-400">{priceUnit}</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </div>
          
          <div className="space-y-1.5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className={`w-3 h-3 rounded-full bg-${feature.color} mr-2 flex-shrink-0`}></div>
                <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-center">
          <Button
            variant="link"
            className={`text-${category === 'health' ? 'blue' : category === 'travel' ? 'indigo' : category === 'auto' ? 'cyan' : 'purple'}-600 hover:text-${category === 'health' ? 'blue' : category === 'travel' ? 'indigo' : category === 'auto' ? 'cyan' : 'purple'}-700 text-sm p-0 h-auto`}
            onClick={() => navigate(viewAllLinks[category])}
          >
            View all {category} plans
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Multi-plan carousel component that displays multiple plan cards in a row or vertically on mobile
export function PlanRecommendations({ 
  plans, 
  className = "" 
}: { 
  plans: PlanProps[],
  className?: string 
}) {
  return (
    <div className={`space-y-4 sm:space-y-0 sm:grid sm:grid-cols-${Math.min(plans.length, 3)} sm:gap-4 ${className}`}>
      {plans.map((plan, index) => (
        <PlanRecommendationCard
          key={index}
          {...plan}
          delay={0.3 + (index * 0.2)} // Staggered animation delays
        />
      ))}
    </div>
  );
}