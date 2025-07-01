import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle, ArrowRight, ExternalLink, Star, TrendingUp } from "lucide-react";
import { Separator } from '../ui/separator';

// This interface matches the data coming from the backend AI service
export interface InsurancePlan {
  id: number;
  name: string;
  category: string;
  provider: string;
  basePrice: number;
  currency: string;
  benefits: string[];
  isExternal?: boolean;
  externalLink?: string | null;
  features?: string[];
}

interface NewPlanCardProps {
  plan: InsurancePlan;
  onViewDetails: (planId: number) => void;
  onQuote: (planId: number) => void;
}

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency || 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

const NewPlanCard: React.FC<NewPlanCardProps> = ({ plan, onViewDetails, onQuote }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleQuoteClick = () => {
    if (plan.isExternal && plan.externalLink) {
      // Open external link in new tab
      window.open(plan.externalLink, '_blank', 'noopener,noreferrer');
    } else {
      // Call the internal quote handler
      onQuote(plan.id);
    }
  };

  // Determine if this is a recommended plan (mock logic - could be based on price, features, etc.)
  const isRecommended = plan.basePrice < 200000 && plan.benefits.length > 3;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-2xl hover:scale-[1.02] transform-gpu transition-all duration-300 border border-gray-100 dark:border-gray-700">
        {/* Recommended badge */}
        {isRecommended && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
              <Star className="h-3 w-3 mr-1" />
              Recomendado
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          {/* Provider badge */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700">
              {plan.provider}
            </Badge>
            <Badge variant="outline" className="capitalize text-xs px-2 py-0.5">
              {plan.category}
            </Badge>
          </div>
          
          {/* Plan name */}
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
            {plan.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow pb-4">
          {/* Price section - more prominent */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 mb-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {formatPrice(plan.basePrice, plan.currency)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">/mes</span>
              </div>
              {plan.basePrice < 150000 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Mejor precio
                </Badge>
              )}
            </div>
          </div>

          {/* Benefits list - improved spacing and visual hierarchy */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Beneficios principales
            </h4>
            {Array.isArray(plan.benefits) && plan.benefits.length > 0 ? (
              <ul className="space-y-2.5">
                {plan.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors">
                      <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No hay beneficios listados para este plan.
              </p>
            )}
            
            {/* Show more benefits indicator */}
            {plan.benefits.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-7">
                +{plan.benefits.length - 3} beneficios más
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700">
          <div className="flex w-full gap-3">
            <Button 
              variant="ghost" 
              className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onViewDetails(plan.id)}
            >
              Ver detalles
            </Button>
            {plan.externalLink ? (
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm hover:shadow-md transition-all"
                onClick={handleQuoteClick}
              >
                Cotizar ahora 
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="flex-1"
                variant="outline"
                disabled
              >
                No disponible
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NewPlanCard; 