import React, { useState } from 'react';
import insurancePlans, { formatPrice, formatCoverage, getBestValuePlan, getMostEconomicalPlan } from '../data/plansData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { BadgeCheck, Check, ChevronDown, ChevronUp, Heart, Info, Medal, Shield, ThumbsUp, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface InsurancePlanDisplayProps {
  onSelectPlan: (planId: number) => void;
}

export function InsurancePlansDisplay({ onSelectPlan }: InsurancePlanDisplayProps) {
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const bestValuePlan = getBestValuePlan();
  const economicalPlan = getMostEconomicalPlan();
  
  const togglePlanSelection = (planId: number) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
    } else {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  const toggleExpandDetails = (planId: number) => {
    if (expandedDetails.includes(planId)) {
      setExpandedDetails(expandedDetails.filter(id => id !== planId));
    } else {
      setExpandedDetails([...expandedDetails, planId]);
    }
  };
  
  const toggleFavorite = (planId: number) => {
    if (favorites.includes(planId)) {
      setFavorites(favorites.filter(id => id !== planId));
    } else {
      setFavorites([...favorites, planId]);
    }
  };

  const getComparePlans = () => {
    return insurancePlans.filter(plan => selectedPlans.includes(plan.id));
  };
  
  // Get top benefits for a plan
  const getTopBenefits = (plan) => {
    const benefits = [];
    
    if (plan.medicalCoverage) {
      benefits.push(`Cobertura médica de ${formatCoverage(plan.medicalCoverage)}`);
    }
    
    if (typeof plan.tripCancellation === 'object') {
      benefits.push('Cancelación con múltiples coberturas');
    } else if (plan.tripCancellation) {
      benefits.push(`Cancelación: ${plan.tripCancellation}`);
    }
    
    if (plan.baggageProtection) {
      benefits.push(`Equipaje: ${formatCoverage(plan.baggageProtection)}`);
    }
    
    if (plan.emergencyEvacuation) {
      benefits.push(`Evacuación: ${formatCoverage(plan.emergencyEvacuation)}`);
    }
    
    if (benefits.length < 4 && plan.adventureActivities) {
      benefits.push('Actividades de aventura incluidas');
    }
    
    return benefits.slice(0, 4); // Return top 4 benefits
  };

  // Get tag for user recommendation
  const getPlanTag = (plan) => {
    if (plan.id === bestValuePlan.id) return { label: 'Mejor Valor', icon: <Medal className="h-4 w-4" /> };
    if (plan.id === economicalPlan.id) return { label: 'Más Económico', icon: <ThumbsUp className="h-4 w-4" /> };
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Planes de Seguro</h2>
        
        {selectedPlans.length > 1 && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setCompareModalOpen(true)}
          >
            <span>Comparar {selectedPlans.length} planes</span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insurancePlans.map(plan => {
          const planTag = getPlanTag(plan);
          const isExpanded = expandedDetails.includes(plan.id);
          const isFavorite = favorites.includes(plan.id);
          const topBenefits = getTopBenefits(plan);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all ${
                selectedPlans.includes(plan.id) ? 'border-primary shadow-md' : ''
              }`}
            >
              {/* Badge/Tag */}
              {planTag && (
                <Badge className="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl rounded-br-none rounded-tl-none">
                  <span className="flex items-center gap-1">
                    {planTag.icon}
                    {planTag.label}
                  </span>
                </Badge>
              )}
              
              {/* Favorite button */}
              <button 
                onClick={() => toggleFavorite(plan.id)}
                className={`absolute top-3 left-3 p-1.5 rounded-full ${
                  isFavorite ? 'bg-pink-100 text-pink-500' : 'bg-gray-100 text-gray-400'
                }`}
                title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
              </button>
              
              <CardHeader>
                <div className="flex justify-between items-start pt-3">
                  <div className="pl-8"> {/* Add padding to account for the favorite button */}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.provider}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{formatPrice(plan.basePrice)}</div>
                    <div className="text-sm text-gray-500">por viaje</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Top benefits */}
                  {topBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-green-50 rounded-full p-1 mr-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                  
                  {/* Collapsible details section */}
                  <Collapsible open={isExpanded}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full mt-2 flex justify-between items-center py-1 h-auto text-primary"
                        onClick={() => toggleExpandDetails(plan.id)}
                      >
                        <span>
                          {isExpanded ? 'Ocultar detalles' : 'Más información'}
                        </span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                      {/* Extra coverage details */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Características destacadas</h4>
                        <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
                          {plan.servicesIncluded && plan.servicesIncluded.map((service, idx) => (
                            <li key={idx}>{service}</li>
                          ))}
                          {plan.extras && plan.extras.map((extra, idx) => (
                            <li key={idx}>{extra}</li>
                          ))}
                          {plan.extraFeatures && plan.extraFeatures.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Exclusions */}
                      {plan.exclusions && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Exclusiones a tener en cuenta</h4>
                          <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
                            {plan.exclusions.map((exclusion, idx) => (
                              <li key={idx}>{exclusion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Data source note */}
                      <div className="text-xs text-gray-500 italic">
                        Datos obtenidos de la documentación oficial de {plan.provider}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2">
                <div className="w-full flex items-center gap-2">
                  <Checkbox 
                    id={`select-plan-${plan.id}`}
                    checked={selectedPlans.includes(plan.id)}
                    onCheckedChange={() => togglePlanSelection(plan.id)}
                  />
                  <label htmlFor={`select-plan-${plan.id}`} className="text-sm">
                    Seleccionar para comparar
                  </label>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => onSelectPlan(plan.id)}
                >
                  Elegir este plan
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Disclaimer */}
      <div className="mt-8 text-sm text-gray-500 p-4 border border-gray-100 rounded-lg bg-gray-50">
        <div className="flex">
          <Info className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            La información de estos planes está basada en documentos públicos oficiales de cada proveedor, incluidos folletos y resúmenes de pólizas. Nos esforzamos por mantener la precisión y transparencia mientras finalizamos asociaciones formales con aseguradoras. Por favor, confirme los detalles del plan con el proveedor antes de comprar.
          </p>
        </div>
      </div>
      
      {/* Comparison Modal */}
      <Dialog open={compareModalOpen} onOpenChange={setCompareModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Comparación de Planes</DialogTitle>
            <DialogDescription>
              Comparando {selectedPlans.length} planes de seguro
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[70vh] overflow-auto">
            <ComparisonTable plans={getComparePlans()} />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompareModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Comparison Table Component
interface ComparisonTableProps {
  plans: typeof insurancePlans;
}

function ComparisonTable({ plans }: ComparisonTableProps) {
  // Helper to find max value for a particular coverage
  const findMaxValue = (key: string) => {
    let max = 0;
    plans.forEach(plan => {
      if (typeof plan[key] === 'number' && plan[key] > max) {
        max = plan[key];
      }
    });
    return max;
  };

  // Helper to highlight the best value in a row
  const getHighlightClass = (plan, key: string) => {
    if (typeof plan[key] !== 'number') return '';
    
    const maxValue = findMaxValue(key);
    if (plan[key] === maxValue && maxValue > 0) {
      return 'bg-green-100 font-medium';
    }
    return '';
  };
  
  // Helper to format coverage with highlight badge
  const formatCoverageWithHighlight = (plan, key: string) => {
    if (typeof plan[key] !== 'number' || plan[key] === 0) {
      return plan[key] || "No especificado";
    }
    
    const maxValue = findMaxValue(key);
    const value = formatCoverage(plan[key]);
    
    if (plan[key] === maxValue) {
      return (
        <div className="flex flex-col items-center">
          <span>{value}</span>
          <Badge variant="outline" className="mt-1 bg-green-50 text-xs py-0 h-5">
            Mayor cobertura
          </Badge>
        </div>
      );
    }
    
    return value;
  };
  
  // Helper to render yes/no status with badge
  const renderYesNo = (value: boolean, label?: string) => {
    if (value) {
      return (
        <div className="flex flex-col items-center">
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            {label || "Incluido"}
          </Badge>
        </div>
      );
    }
    return <span className="text-gray-500">No incluido</span>;
  };

  return (
    <Tabs defaultValue="medical">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="medical">Médico</TabsTrigger>
        <TabsTrigger value="cancellation">Cancelación</TabsTrigger>
        <TabsTrigger value="baggage">Equipaje</TabsTrigger>
        <TabsTrigger value="extras">Extras</TabsTrigger>
      </TabsList>
      
      <TabsContent value="medical" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Cobertura</th>
                {plans.map(plan => (
                  <th key={plan.id} className="p-2 text-center">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b">Cobertura médica</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`p-2 text-center border-b ${getHighlightClass(plan, 'medicalCoverage')}`}>
                    {formatCoverageWithHighlight(plan, 'medicalCoverage')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Emergencia dental</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`p-2 text-center border-b ${getHighlightClass(plan, 'dentalExpenses')}`}>
                    {plan.dentalEmergency || formatCoverageWithHighlight(plan, 'dentalExpenses') || "No especificado"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Repatriación</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {plan.repatriation ? (
                      typeof plan.repatriation === 'string' ? plan.repatriation : (
                        <div className="flex justify-center">
                          <BadgeCheck className="h-5 w-5 text-green-600" />
                        </div>
                      )
                    ) : "No cubierto"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Condiciones pre-existentes</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {plan.preExistingConditions || "No cubierto"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Evacuación médica</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`p-2 text-center border-b ${getHighlightClass(plan, 'emergencyEvacuation')}`}>
                    {formatCoverageWithHighlight(plan, 'emergencyEvacuation') || "No especificado"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
      
      <TabsContent value="cancellation" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Cobertura</th>
                {plans.map(plan => (
                  <th key={plan.id} className="p-2 text-center">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b">Cancelación de viaje</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {typeof plan.tripCancellation === 'object' ? (
                      <Badge variant="outline" className="bg-green-50">
                        Múltiples coberturas
                      </Badge>
                    ) : plan.tripCancellation || "No cubierto"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Interrupción de viaje</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {plan.tripInterruption || "No especificado"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Demora de viaje</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {plan.tripDelay || "No especificado"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Regreso anticipado</td>
                {plans.map(plan => {
                  const hasEarlyReturn = plan.earlyReturn || plan.earlyReturnTransport;
                  return (
                    <td key={plan.id} className="p-2 text-center border-b">
                      {hasEarlyReturn ? (
                        <Badge variant="outline" className="bg-green-50">
                          Incluido
                        </Badge>
                      ) : "No especificado"}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-2 border-b">Conexión perdida</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`p-2 text-center border-b ${getHighlightClass(plan, 'missedConnection')}`}>
                    {formatCoverageWithHighlight(plan, 'missedConnection') || "No cubierto"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
      
      <TabsContent value="baggage" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Cobertura</th>
                {plans.map(plan => (
                  <th key={plan.id} className="p-2 text-center">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b">Protección de equipaje</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`p-2 text-center border-b ${getHighlightClass(plan, 'baggageProtection')}`}>
                    {typeof plan.baggageProtection === 'number' 
                      ? formatCoverageWithHighlight(plan, 'baggageProtection') 
                      : plan.baggageProtection || "No especificado"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Demora de equipaje</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`p-2 text-center border-b ${getHighlightClass(plan, 'baggageDelay')}`}>
                    {typeof plan.baggageDelay === 'number'
                      ? formatCoverageWithHighlight(plan, 'baggageDelay')
                      : plan.baggageDelay || "No especificado"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Documentos robados</td>
                {plans.map(plan => {
                  const hasDocumentCoverage = plan.baggageAndDocuments?.stolenDocuments;
                  return (
                    <td key={plan.id} className="p-2 text-center border-b">
                      {hasDocumentCoverage ? (
                        <Badge variant="outline" className="bg-green-50">
                          Cubierto
                        </Badge>
                      ) : "No especificado"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
      
      <TabsContent value="extras" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Cobertura</th>
                {plans.map(plan => (
                  <th key={plan.id} className="p-2 text-center">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b">Actividades de aventura</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {renderYesNo(!!plan.adventureActivities, "Incluido")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Cobertura COVID-19</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {renderYesNo(!!plan.covidCoverage, "Protegido")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Cobertura para auto de alquiler</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`p-2 text-center border-b ${getHighlightClass(plan, 'rentalCarCoverage')}`}>
                    {plan.rentalCarCoverage ? formatCoverageWithHighlight(plan, 'rentalCarCoverage') : "No cubierto"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Asistencia telefónica</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    <Badge variant="outline" className="bg-green-50">
                      24/7
                    </Badge>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Asistencia legal</td>
                {plans.map(plan => {
                  const hasLegalAssistance = plan.legalAssistance || 
                                            plan.legalDefense || 
                                            (plan.extras && plan.extras.some(e => e.toLowerCase().includes('legal')));
                  return (
                    <td key={plan.id} className="p-2 text-center border-b">
                      {hasLegalAssistance ? (
                        <Badge variant="outline" className="bg-green-50">
                          Incluido
                        </Badge>
                      ) : "No especificado"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}