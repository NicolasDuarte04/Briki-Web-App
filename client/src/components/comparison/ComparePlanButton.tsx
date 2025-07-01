import React from 'react';
import { Button, ButtonProps } from '../ui/button';
import { InsurancePlan, useCompareStore } from '../../store/compare-store';
import { Plus, Check, BarChart3, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useToast } from '../../hooks/use-toast';
import { useLocation } from 'wouter';

interface ComparePlanButtonProps extends ButtonProps {
  plan: InsurancePlan;
  showIcon?: boolean;
  showTooltip?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export default function ComparePlanButton({
  plan,
  showIcon = true,
  showTooltip = true,
  size = 'default',
  variant = 'outline',
  className,
  ...props
}: ComparePlanButtonProps) {
  const { addPlan, removePlan, isPlanSelected, canAddPlanToCategory, getSelectedPlansByCategory, getComparisonReady } = useCompareStore();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const isSelected = isPlanSelected(plan.id);
  const canAdd = canAddPlanToCategory(plan.category);
  const plansInCategory = getSelectedPlansByCategory(plan.category).length;
  const comparisonReady = getComparisonReady();
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSelected) {
      removePlan(plan.id);
      toast({
        title: 'Plan removed from comparison',
        description: `${plan.name} has been removed from your comparison list.`,
      });
    } else if (canAdd) {
      addPlan(plan);
      toast({
        title: 'Plan added to comparison',
        description: `${plan.name} has been added to your comparison list.`,
        action: comparisonReady ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/compare-plans-demo')}
          >
            Compare Now
          </Button>
        ) : undefined
      });
    } else {
      toast({
        title: 'Cannot add more plans',
        description: `You can compare a maximum of ${plansInCategory} plans in the ${plan.category} category.`,
        variant: 'destructive',
      });
    }
  };
  
  // Button content based on selection state
  const buttonContent = isSelected ? (
    <>
      {showIcon && <Check className="h-4 w-4 mr-1" />}
      <span>Added</span>
    </>
  ) : (
    <>
      {showIcon && <Plus className="h-4 w-4 mr-1" />}
      <span>Compare</span>
    </>
  );
  
  // Tooltip content based on selection state and ability to add
  const tooltipContent = isSelected
    ? 'Remove from comparison'
    : !canAdd
    ? `Maximum ${plansInCategory} plans per category reached`
    : 'Add to comparison';
  
  // If comparison is ready and we have 2+ plans selected, show the compare now button
  const viewComparisonButton = comparisonReady && (
    <Button
      variant="default"
      size="sm"
      className="ml-2"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/compare-plans-demo');
      }}
    >
      <BarChart3 className="h-4 w-4 mr-1" />
      <span>View</span>
    </Button>
  );
  
  const button = (
    <Button
      variant={isSelected ? 'default' : variant}
      size={size}
      onClick={handleCompareClick}
      className={className}
      disabled={!isSelected && !canAdd}
      {...props}
    >
      {buttonContent}
    </Button>
  );
  
  if (!showTooltip) {
    return (
      <div className="flex items-center">
        {button}
        {viewComparisonButton}
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {viewComparisonButton}
    </div>
  );
}