import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CheckCircle, XCircle, AlertCircle, Users, Shield, Clock } from 'lucide-react';
import { InsurancePlan } from './NewPlanCard';
import { cn } from '../../lib/utils';

interface PlanComparisonProps {
  plans: InsurancePlan[];
  className?: string;
}

const formatPrice = (price: number, currency: string) => {
  if (!price || price === 0) {
    return "Según cotización";
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency || 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

export const PlanComparison: React.FC<PlanComparisonProps> = ({ plans, className }) => {
  // Limit to 3 plans max for better UX
  const plansToCompare = plans.slice(0, 3);

  // Extract unique benefits across all plans
  const allBenefits = new Set<string>();
  plansToCompare.forEach(plan => {
    plan.benefits?.forEach(benefit => allBenefits.add(benefit));
  });

  const benefitsList = Array.from(allBenefits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Comparación de Planes
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Desktop view - side by side */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300 w-1/4">
                    Característica
                  </th>
                  {plansToCompare.map((plan) => (
                    <th key={plan.id} className="p-4 text-center">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {plan.provider}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price row */}
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">
                    Precio
                  </td>
                  {plansToCompare.map((plan) => (
                    <td key={plan.id} className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(plan.basePrice, plan.currency)}
                      </div>
                      {plan.basePrice > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">/mes</div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Category row */}
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">
                    Categoría
                  </td>
                  {plansToCompare.map((plan) => (
                    <td key={plan.id} className="p-4 text-center">
                      <Badge className="capitalize">{plan.category}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Benefits comparison */}
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300 align-top">
                    Beneficios principales
                  </td>
                  {plansToCompare.map((plan) => (
                    <td key={plan.id} className="p-4">
                      <ul className="space-y-2">
                        {plan.benefits.slice(0, 5).map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Ideal for row */}
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">
                    Ideal para
                  </td>
                  {plansToCompare.map((plan) => (
                    <td key={plan.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{getIdealFor(plan)}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* External link row */}
                <tr>
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">
                    Disponibilidad
                  </td>
                  {plansToCompare.map((plan) => (
                    <td key={plan.id} className="p-4 text-center">
                      {plan.isExternal && plan.externalLink ? (
                        <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Disponible
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Consultar
                        </Badge>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile view - stacked */}
          <div className="md:hidden space-y-4 p-4">
            {plansToCompare.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4 space-y-3">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {plan.provider}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Precio:</span>
                    <span className="text-lg font-bold">
                      {formatPrice(plan.basePrice, plan.currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Categoría:</span>
                    <Badge className="capitalize">{plan.category}</Badge>
                  </div>
                  
                  <div className="pt-2">
                    <span className="text-sm font-medium block mb-2">Beneficios:</span>
                    <ul className="space-y-1">
                      {plan.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to determine ideal user type based on plan characteristics
function getIdealFor(plan: InsurancePlan): string {
  const price = plan.basePrice || 0;
  const benefitCount = plan.benefits?.length || 0;
  
  if (plan.category === 'travel') {
    if (price < 100000) return 'Viajeros ocasionales';
    if (price > 200000) return 'Viajeros frecuentes';
    return 'Todo tipo de viajeros';
  }
  
  if (plan.category === 'health') {
    if (benefitCount > 5) return 'Cobertura completa';
    return 'Cobertura básica';
  }
  
  if (plan.category === 'auto') {
    if (price > 150000) return 'Vehículos premium';
    return 'Vehículos estándar';
  }
  
  if (plan.category === 'pet') {
    return 'Dueños de mascotas';
  }
  
  return 'Usuarios generales';
}

export default PlanComparison; 