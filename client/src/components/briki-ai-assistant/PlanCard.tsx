import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Interfaz para los planes de seguro
export interface InsurancePlan {
  id: string;
  category: string;
  provider: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  duration: string;
  coverageAmount: number;
  coverage: Record<string, any>;
  features: string[];
  deductible: number;
  exclusions: string[];
  addOns: string[];
  tags: string[];
  rating: number;
  status: string;
}

interface PlanCardProps {
  plan: InsurancePlan;
  highlighted?: boolean;
  onViewDetails?: (planId: string) => void;
  onQuote?: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  highlighted = false,
  onViewDetails,
  onQuote
}) => {
  // Generar etiqueta según las características del plan
  const getBadge = () => {
    const tags = plan.tags || [];
    if (tags.includes('premium') || tags.includes('exclusivo')) {
      return { text: 'Premium', variant: 'default' };
    }
    if (tags.includes('económico') || tags.includes('básico')) {
      return { text: 'Económico', variant: 'secondary' };
    }
    if (tags.includes('completo')) {
      return { text: 'Completo', variant: 'outline' };
    }
    return null;
  };

  // Formatear precio
  const formatPrice = () => {
    return `${plan.currency === 'USD' ? '$' : ''}${plan.basePrice} ${plan.currency === 'USD' ? '' : plan.currency}`;
  };

  // Obtener características destacadas (máximo 3)
  const highlightedFeatures = (plan.features || []).slice(0, 3);

  // Verificar si el plan es para un tipo específico
  const isSpecificPlan = () => {
    const tags = plan.tags || [];
    if (tags.includes('scooter') || tags.includes('vespa') || tags.includes('moto ligera')) {
      return 'Especial para scooters/motos';
    }
    if (tags.includes('familia') || tags.includes('familiar')) {
      return 'Plan familiar';
    }
    if (tags.includes('latinoamérica') || tags.includes('latam')) {
      return 'Especializado Latinoamérica';
    }
    return null;
  };

  const badge = getBadge();
  const specificType = isSpecificPlan();

  return (
    <Card className={`w-full overflow-hidden transition-all duration-300 hover:shadow-lg ${highlighted ? 'ring-2 ring-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950' : 'hover:shadow-md border border-gray-200 dark:border-gray-700'}`}>
      <CardHeader className="pb-3 relative">
        {highlighted && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 shadow-sm">
              <Award className="h-3 w-3 mr-1" />
              Recomendado
            </Badge>
          </div>
        )}
        {badge && !highlighted && (
          <Badge variant={badge.variant as any} className="mb-2 self-start">
            {badge.text}
          </Badge>
        )}
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white pr-20">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          {plan.provider} • {specificType || `Seguro de ${plan.category}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-baseline mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{formatPrice()}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{plan.duration}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          {highlightedFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
        
        {plan.deductible && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Deducible: ${plan.deductible} {plan.currency}
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-3 flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails && onViewDetails(plan.id)}
        >
          Detalles
        </Button>
        <Button 
          size="sm"
          className="flex-1"
          onClick={() => onQuote && onQuote(plan.id)}
        >
          Cotizar <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;