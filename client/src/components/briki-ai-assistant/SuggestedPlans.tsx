import React, { useEffect, useState } from 'react';
import NewPlanCard from './NewPlanCard';
import { useToast } from '../../hooks/use-toast';
import { useLocation } from 'wouter';
import { logPlanAnalytics } from '../../lib/analytics';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { InsurancePlan } from './NewPlanCard';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface SuggestedPlansProps {
  plans: InsurancePlan[];
  category?: string;
  onViewAllPlans?: () => void;
}

const SuggestedPlans: React.FC<SuggestedPlansProps> = ({ plans, category, onViewAllPlans }) => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const [showViewAll, setShowViewAll] = useState(false);

  useEffect(() => {
    if (plans && plans.length > 0) {
      plans.forEach(plan => {
        logPlanAnalytics('plan_shown', plan, user?.id ? String(user.id) : null);
      });
      
      // Show "View All" button if there are more than 4 plans and category is specified
      setShowViewAll(plans.length >= 4 && !!category);
    }
  }, [plans, user, category]);

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
      benefitsCount: p.benefits?.length || 0,
      isExternal: (p as any).isExternal,
      externalLink: (p as any).externalLink
    })) || []
  });

  // Si no hay planes, no renderizar nada
  if (!plans || plans.length === 0) {
    console.log('❌ SuggestedPlans - No plans to render');
    return null;
  }

  // Additional debug before rendering
  console.log('✅ SuggestedPlans - About to render plans:', {
    totalPlans: plans.length,
    firstPlan: plans[0],
    allPlanNames: plans.map(p => p.name)
  });

  const handleViewDetails = (planId: number) => {
    console.log('👆 View details clicked:', { planId });
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      // Navigate to plan details page with plan data
      navigate(`/plan/${planId}`, { state: { plan } });
    }
    toast({
      title: "Detalles del plan",
      description: `Viendo detalles del plan ${plan?.name || planId}`,
    });
  };

  const handleQuote = (planId: number) => {
    console.log('🎯 Quote clicked:', { planId });
    const plan = plans.find(p => p.id === planId);
    
    if (plan) {
      // Check if user is authenticated
      if (!user) {
        // Store intended quote target for post-login redirect
        sessionStorage.setItem('quoteIntentPlanId', planId.toString());
        sessionStorage.setItem('quoteIntentPlan', JSON.stringify(plan));
        
        toast({
          title: "Inicia sesión para continuar",
          description: "Necesitas una cuenta para cotizar este plan",
        });
        
        // Redirect to auth with return URL
        navigate(`/auth?returnTo=/cotizar/${planId}`);
        return;
      }
      
      // Check if plan is external
      const isExternal = (plan as any).isExternal;
      const externalLink = (plan as any).externalLink;
      
      if (isExternal && externalLink) {
        // External plans are handled directly in PlanCard
        console.log('🔗 External plan - redirect handled by PlanCard');
      } else {
        // Internal flow for mock plans
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
      }
    } else {
      toast({
        title: "Error",
        description: "No se pudo encontrar el plan seleccionado",
        variant: "destructive"
      });
    }
  };

  const handleViewAllPlans = () => {
    if (onViewAllPlans) {
      onViewAllPlans();
    } else if (category) {
      // Navigate to the category page to see all plans
      navigate(`/insurance/${category}`);
      toast({
        title: "Mostrando todos los planes",
        description: `Viendo todos los planes de ${category}`,
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
            isHighlighted: index === 0,
            isExternal: (plan as any).isExternal
          });

          return (
            <NewPlanCard
              key={plan.id}
              plan={plan as any}
              onViewDetails={handleViewDetails}
              onQuote={handleQuote}
            />
          );
        })}
      </div>
      
      {/* View All Plans Button */}
      {showViewAll && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleViewAllPlans}
            className="group"
          >
            Ver todos los planes
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SuggestedPlans;