import React from "react";
import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";
import { MockPlan } from "@/utils/mockAssistantResponses";
import { Link } from "wouter";

interface PlanRecommendationCardProps {
  plan: MockPlan;
  index: number;
  animationDelay?: number;
}

const PlanRecommendationCard: React.FC<PlanRecommendationCardProps> = ({ 
  plan, 
  index,
  animationDelay = 0 
}) => {
  const getBadgeColor = () => {
    const badges = [
      { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-400" },
      { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-400" },
      { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-800 dark:text-purple-400" }
    ];
    return badges[index % badges.length];
  };

  const badgeColors = getBadgeColor();
  
  return (
    <motion.div 
      className="mb-3 overflow-hidden"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ delay: 0.5 + (animationDelay || index * 0.2), duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300">PLAN RECOMENDADO</h4>
          </div>
          <span className={`text-xs ${badgeColors.bg} ${badgeColors.text} px-2 py-1 rounded-full font-medium`}>
            {plan.badge}
          </span>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{plan.name}</h3>
            <div className="text-green-600 dark:text-green-400 font-bold">{plan.price}</div>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Cobertura flexible según tus necesidades
          </div>
          
          <div className="space-y-1.5">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-center text-sm">
                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-cyan-500' : 'bg-indigo-500'} mr-2 flex-shrink-0`}></div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanRecommendationCard;