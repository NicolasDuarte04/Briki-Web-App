import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RealInsurancePlan } from '@/data/realPlans';

interface PlanCardProps {
  plan: RealInsurancePlan & { isRecommended?: boolean };
  onClick?: () => void;
}

export default function PlanCard({ plan, onClick }: PlanCardProps) {
  return (
    <Card className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
          {plan.isRecommended && (
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400">
              Recomendado
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {plan.provider}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {plan.summary || plan.description}
        </p>
        {plan.features && plan.features.length > 0 && (
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                <span className="mr-2 text-blue-600">•</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        {plan.externalLink ? (
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-600/25 text-white"
            onClick={onClick}
            asChild
          >
            <a 
              href={plan.externalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              Cotizar
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="outline"
            disabled
          >
            No disponible
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 