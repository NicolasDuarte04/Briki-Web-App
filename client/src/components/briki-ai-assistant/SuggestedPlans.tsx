import React from 'react';
import PlanCard, { InsurancePlan } from '@/components/briki-ai-assistant/PlanCard';
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

  // Mostrar el contenido de plans para depuración visual
  // (esto se puede quitar después de la depuración)
  // Si las tarjetas no aparecen, forzar el render de un plan de demo
  const forceDemo = true; // Cambia a true para forzar demo
  const demoPlans = [
    {
      id: 'demo-plan',
      name: 'Demo Plan',
      price: '$19.99',
      features: ['Cobertura médica', 'Asistencia 24/7', 'Equipaje perdido'],
      provider: 'Prueba',
      deductible: '$40 USD',
      type: 'Recomendado',
      category: 'travel',
      description: 'Plan de prueba',
      basePrice: 19.99,
      currency: 'USD',
      duration: '10 días',
      coverageAmount: 10000,
      coverage: {},
      exclusions: [],
      addOns: [],
      tags: [],
      rating: 5,
      status: 'active',
    }
  ];

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
      <pre style={{background:'#f0f4fa', color:'#222', fontSize:12, marginBottom:8, borderRadius:4, padding:8, overflow:'auto'}}>
        {JSON.stringify(plans, null, 2)}
      </pre>
      <div className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
        Planes recomendados para ti:
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(forceDemo ? demoPlans : plans).map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            highlighted={index === 0}
            onViewDetails={handleViewDetails}
            onQuote={handleQuote}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedPlans;