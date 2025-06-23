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
      return { text: 'Premium', variant: 'default' } as const;
    }
    if (tags.includes('económico') || tags.includes('básico')) {
      return { text: 'Económico', variant: 'secondary' } as const;
    }
    if (tags.includes('completo')) {
      return { text: 'Completo', variant: 'outline' } as const;
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
    <Card className={`w-full overflow-hidden transition-all ${highlighted ? 'border-primary shadow-md' : ''}`}>
      <CardHeader className="pb-2">
        {badge && (
          <Badge variant={badge.variant as any} className="mb-1 self-start">
            {badge.text}
          </Badge>
        )}
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          {plan.name}
          {highlighted && <Award className="h-4 w-4 text-amber-500" />}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {plan.provider} • {specificType || `Seguro de ${plan.category}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-baseline mb-3">
          <span className="text-xl font-bold text-primary">{formatPrice()}</span>
          <span className="text-sm text-muted-foreground ml-1">{plan.duration}</span>
        </div>

        <div className="space-y-1 mb-3">
          {highlightedFeatures.map((feature, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
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