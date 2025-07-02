import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { RealInsurancePlan } from '../../data/realPlans';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanCardProps {
  plan: RealInsurancePlan & { isRecommended?: boolean };
  onClick?: () => void;
}

export default function PlanCard({ plan, onClick }: PlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = window.innerWidth < 768;

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Collapsed mobile view
  if (isMobile && !isExpanded) {
    return (
      <Card 
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">{plan.name}</CardTitle>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {plan.provider}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {plan.isRecommended && (
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 text-xs">
                  ✓
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {plan.basePrice && (
            <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatPrice(plan.basePrice)}/{plan.priceUnit === 'annual' ? 'año' : 'mes'}
            </div>
          )}
        </CardHeader>
      </Card>
    );
  }

  // Expanded mobile view or desktop view
  return (
    <Card className={`flex flex-col ${isMobile ? '' : 'h-full'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
          {plan.isRecommended && (
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 mt-2">
              Recomendado
            </Badge>
            )}
          </div>
          {isMobile && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="p-1"
            >
              <ChevronUp className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {plan.provider}
        </div>
        {plan.basePrice && (
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice(plan.basePrice)}/{plan.priceUnit === 'annual' ? 'año' : 'mes'}
          </div>
        )}
      </CardHeader>
      
      <AnimatePresence>
        {(isExpanded || !isMobile) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
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
                    Cotizar ahora
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
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
} 