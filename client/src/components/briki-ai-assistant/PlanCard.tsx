import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, ArrowRight, PlusCircle, MinusCircle, ShieldCheck, DollarSign, Calendar, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCompareStore } from '@/store/compare-store';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/format';
import { InsurancePlan } from '@/types/insurance';
import { logPlanAnalytics } from '@/lib/analytics';
import { useAuth } from '@/hooks/use-auth';

interface PlanCardProps {
  plan: InsurancePlan;
  highlighted?: boolean;
  onViewDetails?: (planId: string) => void;
  onQuote?: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, highlighted = false, onQuote }) => {
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { addPlan, removePlan, isPlanSelected } = useCompareStore();
  const { user } = useAuth();
  const isSelected = isPlanSelected(plan.id);

  const handleCompareClick = () => {
    logPlanAnalytics('plan_clicked', plan, user?.id ? String(user.id) : null);
    if (isSelected) {
      removePlan(plan.id);
      toast({ title: "Plan Removed", description: `${plan.name} removed from comparison.` });
    } else {
      const success = addPlan(plan);
      if (success) {
        toast({ title: "Plan Added", description: `${plan.name} added to comparison.` });
      } else {
        toast({
          title: "Comparison Limit Reached",
          description: "You can only compare up to 3 plans at a time.",
          variant: "destructive",
        });
      }
    }
  };

  const handleQuoteClick = () => {
    logPlanAnalytics('plan_clicked', plan, user?.id ? String(user.id) : null);
    console.log('🎯 Quote button clicked for plan:', plan.id);
    if (onQuote) {
      onQuote(plan.id.toString());
    }
  };

  const benefitsToShow = showAllBenefits ? plan.benefits : (plan.benefits || []).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`w-full overflow-hidden transition-all duration-300 rounded-xl border shadow-md hover:shadow-xl ${
        highlighted 
          ? 'border-primary ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-primary/10' 
          : 'border-gray-200 hover:border-primary/30'
      } ${isHovered ? 'shadow-xl transform-gpu' : ''}`}>
        
        <CardHeader className="p-4 bg-gradient-to-r from-gray-50/70 to-gray-100/70">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-base font-bold text-gray-800 mb-1">{plan.name}</CardTitle>
              <p className="text-xs text-gray-500">{plan.provider}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {highlighted && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                >
                  <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 shadow-sm">
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
          <motion.div 
            className="pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatCurrency(plan.basePrice, plan.currency)}
            </span>
            {plan.duration && <span className="text-sm text-muted-foreground ml-1">/ {plan.duration}</span>}
          </motion.div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
            <motion.div 
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="font-semibold text-gray-600">Max Coverage</p>
                <p className="text-primary font-medium">{formatCurrency(plan.coverageAmount, plan.currency)}</p>
              </div>
            </motion.div>
            {plan.deductible && (
              <motion.div 
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-600">Deductible</p>
                  <p>{formatCurrency(plan.deductible, plan.currency)}</p>
                </div>
              </motion.div>
            )}
            {plan.validity && (
              <motion.div 
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-600">Validity</p>
                  <p>{plan.validity}</p>
                </div>
              </motion.div>
            )}
          </div>
          
          <Separator className="mb-4" />
          
          <p className="text-sm font-semibold mb-2 text-gray-700">Top Benefits</p>
          <div className="space-y-2">
            {benefitsToShow.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{benefit}</span>
              </motion.div>
            ))}
          </div>
          
          {(plan.benefits || []).length > 4 && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto mt-2 text-primary hover:text-primary/80" 
              onClick={() => setShowAllBenefits(!showAllBenefits)}
            >
              {showAllBenefits ? 'Show less' : 'Show more'}
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${showAllBenefits ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </CardContent>

        <CardFooter className="bg-gradient-to-r from-gray-50/70 to-gray-100/70 p-4 flex gap-3">
          <Button 
            variant={isSelected ? "secondary" : "outline"}
            size="sm"
            className={`flex-1 transition-all duration-200 ${
              isSelected 
                ? 'bg-secondary hover:bg-secondary/80' 
                : 'hover:bg-gray-50 hover:border-primary/50'
            }`}
            onClick={handleCompareClick}
          >
            {isSelected ? <MinusCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {isSelected ? 'Remove' : 'Compare'}
          </Button>
          
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