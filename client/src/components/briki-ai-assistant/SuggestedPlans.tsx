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
    plansReceived: !!plans,
    planCount: plans?.length || 0,
    planNames: plans?.map(p => p.name) || [],
    fullPlans: plans
  });

  // Si no hay planes, no renderizar nada
  if (!plans || plans.length === 0) {
    console.log('❌ SuggestedPlans - No plans to render, returning null');
    return null;
  }

  const handleViewDetails = (planId: string) => {
    // Por ahora solo mostraremos un toast, pero podríamos navegar a una página de detalles
    toast({
      title: "Detalles del plan",
      description: `Viendo detalles del plan ${planId}`,
    });
  };

  const handleQuote = (planId: string) => {
    // Navegar a la página de cotización con el ID del plan
    navigate(`/quote?planId=${planId}`);
  };

  return (
    <div className="mt-4 mb-3">
      <div className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
        Planes recomendados para ti:
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            highlighted={index === 0} // Destacar el primer plan como el más recomendado
            onViewDetails={handleViewDetails}
            onQuote={handleQuote}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedPlans;