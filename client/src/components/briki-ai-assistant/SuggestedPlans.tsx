import React, { useEffect } from 'react';
import PlanCard from './PlanCard';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { logPlanAnalytics } from '@/lib/analytics';
import { useAuth } from '@/hooks/use-auth';
import { InsurancePlan } from '@/types/insurance';

interface SuggestedPlansProps {
  plans: InsurancePlan[];
}

const SuggestedPlans: React.FC<SuggestedPlansProps> = ({ plans }) => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (plans && plans.length > 0) {
      plans.forEach(plan => {
        logPlanAnalytics('plan_shown', plan, user?.id ? String(user.id) : null);
      });
    }
  }, [plans, user]);

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
    const plan = plans.find(p => p.id.toString() === planId);
    if (plan) {
      // Navigate to plan details page with plan data
      navigate(`/plan/${planId}`, { state: { plan } });
    }
    toast({
      title: "Detalles del plan",
      description: `Viendo detalles del plan ${plan?.name || planId}`,
    });
  };

  const handleQuote = (planId: string) => {
    console.log('🎯 Quote clicked:', { planId });
    const plan = plans.find(p => p.id.toString() === planId);
    
    if (plan) {
      // Store plan data in sessionStorage for access on next page
      sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
      
      // Try different routing options based on what exists
      // Priority: checkout -> cotizar -> quote -> fallback
      const routeOptions = [
        `/checkout/${planId}`,
        `/cotizar/${planId}`,
        `/quote?planId=${planId}`,
        `/insurance/${plan.category}/quote?planId=${planId}`
      ];
      
      // Use the first route option for now, we'll create the pages
      const targetRoute = `/cotizar/${planId}`;
      
      console.log('🎯 Navigating to:', targetRoute);
      navigate(targetRoute);
      
      toast({
        title: "Iniciando cotización",
        description: `Cotizando ${plan.name} de ${plan.provider}`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo encontrar el plan seleccionado",
        variant: "destructive"
      });
    }
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