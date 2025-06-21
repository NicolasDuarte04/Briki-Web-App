import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Separator } from '@/components/ui/separator';

// This interface matches the data coming from the backend AI service
export interface InsurancePlan {
  id: number;
  name: string;
  category: string;
  provider: string;
  basePrice: number;
  currency: string;
  benefits: string[];
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
        <CardHeader className="p-5">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {plan.name}
            </CardTitle>
            <Badge variant="outline" className="capitalize text-xs ml-2 flex-shrink-0">
              {plan.category}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 pt-1">{plan.provider}</p>
        </CardHeader>
        
        <CardContent className="flex-grow p-5">
          <div className="mb-4">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {formatPrice(plan.basePrice, plan.currency)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/mes</span>
          </div>
          
          <Separator className="my-4" />

          <ul className="space-y-3 text-sm">
            {plan.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t">
          <div className="flex w-full gap-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onViewDetails(plan.id)}
            >
              Ver detalles
            </Button>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              onClick={() => onQuote(plan.id)}
            >
              Cotizar ahora <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NewPlanCard; 