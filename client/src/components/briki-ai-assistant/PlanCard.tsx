import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, ArrowRight, PlusCircle, MinusCircle, ShieldCheck, DollarSign, Calendar, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCompareStore } from '@/store/compare-store';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/format';

// Updated interface with more specific fields
export interface InsurancePlan {
  id: number;
  name: string;
  category: string;
  provider: string;
  basePrice: number;
  coverageAmount: number;
  currency: string;
  country: string;
  benefits: string[];
  description?: string;
  duration?: string;
  tags?: string[];
  deductible?: number;
  copay?: string;
  validity?: string;
}

interface PlanCardProps {
  plan: InsurancePlan;
  highlighted?: boolean;
  onViewDetails?: (planId: string) => void;
  onQuote?: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, highlighted = false, onQuote }) => {
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const { toast } = useToast();
  const { addPlan, removePlan, isPlanSelected } = useCompareStore();
  const isSelected = isPlanSelected(plan.id);

  const handleCompareClick = () => {
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

  const benefitsToShow = showAllBenefits ? plan.benefits : (plan.benefits || []).slice(0, 4);

  return (
    <Card className={`w-full overflow-hidden transition-all rounded-xl border shadow-md ${highlighted ? 'border-primary' : 'border-gray-200'}`}>
      <CardHeader className="p-4 bg-gray-50/70">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-bold text-gray-800">{plan.name}</CardTitle>
            <p className="text-xs text-gray-500">{plan.provider}</p>
          </div>
          {highlighted && <Badge variant="default">Recommended</Badge>}
        </div>
        <div className="pt-2">
          <span className="text-2xl font-bold text-primary">{formatCurrency(plan.basePrice, plan.currency)}</span>
          {plan.duration && <span className="text-sm text-muted-foreground ml-1">/ {plan.duration}</span>}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-600">Max Coverage</p>
              <p>{formatCurrency(plan.coverageAmount, plan.currency)}</p>
            </div>
          </div>
          {plan.deductible && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-600">Deductible</p>
                <p>{formatCurrency(plan.deductible, plan.currency)}</p>
              </div>
            </div>
          )}
          {plan.validity && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-600">Validity</p>
                <p>{plan.validity}</p>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="mb-4" />
        
        <p className="text-sm font-semibold mb-2 text-gray-700">Top Benefits</p>
        <div className="space-y-2">
          {benefitsToShow.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
        
        {(plan.benefits || []).length > 4 && (
          <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-primary" onClick={() => setShowAllBenefits(!showAllBenefits)}>
            {showAllBenefits ? 'Show less' : 'Show more'}
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showAllBenefits ? 'rotate-180' : ''}`} />
          </Button>
        )}
      </CardContent>

      <CardFooter className="bg-gray-50/70 p-4 flex gap-2">
        <Button 
          variant={isSelected ? "secondary" : "outline"}
          size="sm"
          className="flex-1"
          onClick={handleCompareClick}
        >
          {isSelected ? <MinusCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {isSelected ? 'Remove' : 'Compare'}
        </Button>
        <Button 
          size="sm"
          className="flex-1"
          onClick={() => onQuote && onQuote(plan.id.toString())}
        >
          Quote <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard; 