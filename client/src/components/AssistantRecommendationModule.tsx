import React from 'react';
import { motion } from 'framer-motion';
import { PlanProps } from './PlanRecommendationCard';
import PlanRecommendationCard from './PlanRecommendationCard';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/lib/navigation';

interface AssistantRecommendationModuleProps {
  mainPlan: PlanProps;
  relatedPlans: PlanProps[];
  title?: string;
  subtitle?: string;
}

export default function AssistantRecommendationModule({
  mainPlan,
  relatedPlans,
  title = "Ya que elegiste este plan, también podrías necesitar...",
  subtitle = "Completa tu protección con estos planes complementarios"
}: AssistantRecommendationModuleProps) {
  const { navigate } = useNavigation();
  
  return (
    <motion.div
      className="mt-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7">{subtitle}</p>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedPlans.map((plan, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{plan.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm mt-1"
                  onClick={() => navigate(`/${plan.category}/plans`)}
                >
                  Ver detalles
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}