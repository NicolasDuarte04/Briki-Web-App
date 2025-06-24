import React from 'react';
import PlanCard, { InsurancePlan } from './PlanCard';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface SuggestedPlansProps {
  plans: InsurancePlan[];
}

const SuggestedPlans: React.FC<SuggestedPlansProps> = ({ plans }) => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Debug logging for plan rendering
  console.log('🎯 SuggestedPlans - Component rendered with:', {
    receivedPlans: !!plans,
    planCount: plans?.length || 0,
    planDetails: plans?.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      provider: p.provider,
      basePrice: p.basePrice,
      currency: p.currency,
      hasBenefits: Array.isArray(p.benefits),
      benefitsCount: p.benefits?.length || 0
    })) || []
  });

  // Si no hay planes, no renderizar nada
  if (!plans || plans.length === 0) {
    console.log('❌ SuggestedPlans - No plans to render');
    return null;
  }

  const handleViewDetails = (planId: string) => {
    console.log('👆 View details clicked:', { planId });
    toast({
      title: "Detalles del plan",
      description: `Viendo detalles del plan ${planId}`,
    });
  };

  const handleQuote = (planId: string) => {
    console.log('🎯 Quote clicked:', { planId });
    navigate(`/quote?planId=${planId}`);
  };

  return (
    <div className="mt-3 mb-2">
      <div className="text-sm font-medium mb-2">Planes recomendados:</div>
      {/* Vertical stacked container */}
      <div className="w-full space-y-4">
        {plans.map((plan, index) => {
          console.log('📦 Rendering plan card:', {
            planId: plan.id,
            planName: plan.name,
            isHighlighted: index === 0
          });

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              highlighted={index === 0}
              onViewDetails={handleViewDetails}
              onQuote={handleQuote}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedPlans;