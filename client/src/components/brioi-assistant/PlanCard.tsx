import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { formatCurrency } from '../../utils/format';
import { InsurancePlan } from '../../types/insurance';
import { logPlanAnalytics } from '../../lib/analytics';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

interface PlanCardProps {
  plan: InsurancePlan;
  highlighted?: boolean;
  onQuote?: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, highlighted = false, onQuote }) => {
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  const handleCompareClick = () => {
    logPlanAnalytics('plan_clicked', { ...plan, name: `${plan.name} - Compare` }, user?.id);
    // TODO: Implement compare functionality
    toast({
      title: "Comparar plan",
      description: `Comparando ${plan.name}`,
    });
  };

  const handleQuoteClick = () => {
    logPlanAnalytics('plan_clicked', { ...plan, name: `${plan.name} - Cotizar` }, user?.id);
    console.log('🎯 Quote button clicked for plan:', plan.id);
    if (onQuote) {
      onQuote(plan.id.toString());
    }
  };

  return (
    <motion.div 
      className="flex-1"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium text-gray-500">
            {plan.name}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <span className="sr-only">Plan</span>
            {plan.id}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-400">
            {plan.description}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm"
              className={`w-full transition-all duration-200 font-medium ${
                highlighted 
                  ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg' 
                  : 'bg-primary hover:bg-primary/90 hover:shadow-md'
              }`}
              onClick={handleCompareClick}
            >
              Comparar
            </Button>
          </motion.div>
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm"
              className={`w-full transition-all duration-200 font-medium ${
                highlighted 
                  ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg' 
                  : 'bg-primary hover:bg-primary/90 hover:shadow-md'
              }`}
              onClick={handleQuoteClick}
            >
              Cotizar <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PlanCard; 