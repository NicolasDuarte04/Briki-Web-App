import React from 'react';
import NewPlanCard, { InsurancePlan } from '@/components/briki-ai-assistant/NewPlanCard';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/empty-state';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface SuggestedPlansProps {
  plans?: InsurancePlan[]; // undefined while loading
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

  // Loading state – show skeletons while plans are undefined
  if (typeof plans === 'undefined') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-3" data-testid="plan-skeletons">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-60 rounded-2xl" />
        ))}
      </div>
    );
  }

  // Empty state when no plans found
  if (plans.length === 0) {
    return (
      <EmptyState
        title="No encontramos planes"
        description="Intenta ajustar tus preferencias o proporcionar más información para mostrar recomendaciones."
      />
    );
  }
  
  const handleViewDetails = (planId: number) => {
    // Por ahora solo mostraremos un toast, pero podríamos navegar a una página de detalles
    toast({
      title: "Viendo detalles del plan",
      description: `Esta acción te llevaría a la página de detalles del plan con ID: ${planId}.`,
    });
  };

  const handleQuote = (planId: number) => {
    // Navegar a la página de cotización con el ID del plan
    toast({
      title: "Iniciando cotización",
      description: `Navegando a la página de cotización para el plan ID: ${planId}.`,
    });
    navigate(`/quote?planId=${planId}`);
  };

  return (
    <div className="mt-4 mb-3">
      <div className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
        Planes recomendados para ti:
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <NewPlanCard
            key={plan.id}
            plan={plan}
            onViewDetails={handleViewDetails}
            onQuote={handleQuote}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedPlans;