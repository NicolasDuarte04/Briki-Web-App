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

  // Si no hay planes, no renderizar nada
  if (!plans || plans.length === 0) {
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
    <div className="mt-3 mb-2">
      <div className="text-sm font-medium mb-2">Planes recomendados:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plans.slice(0, 3).map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            highlighted={index === 0} // Destacar el primer plan como el más recomendado
            onViewDetails={handleViewDetails}
            onQuote={handleQuote}
          />
        ))}
      </div>
      {plans.length > 3 && (
        <div className="text-xs text-center mt-2 text-muted-foreground">
          Mostrando 3 de {plans.length} planes recomendados
        </div>
      )}
    </div>
  );
};

export default SuggestedPlans;