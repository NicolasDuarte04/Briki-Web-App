import React, { useState } from 'react';
import insurancePlans, { formatPrice, formatCoverage, getBestValuePlan } from '../data/plansData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { BadgeCheck, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InsurancePlanDisplayProps {
  onSelectPlan: (planId: number) => void;
}

export function InsurancePlansDisplay({ onSelectPlan }: InsurancePlanDisplayProps) {
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  
  const bestValuePlan = getBestValuePlan();
  
  const togglePlanSelection = (planId: number) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
    } else {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  const getComparePlans = () => {
    return insurancePlans.filter(plan => selectedPlans.includes(plan.id));
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
        {insurancePlans.map(plan => (
          <Card 
            key={plan.id} 
            className={`relative transition-all ${
              selectedPlans.includes(plan.id) ? 'border-primary shadow-md' : ''
            }`}
          >
            {plan.id === bestValuePlan.id && (
              <Badge className="absolute top-0 right-0 rounded-bl-xl rounded-tr-xl rounded-br-none rounded-tl-none">
                Mejor Valor
              </Badge>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
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
                <div className="flex items-center">
                  <div className="bg-green-50 rounded-full p-1 mr-2">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Cobertura médica de {formatCoverage(plan.medicalCoverage)}</span>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-50 rounded-full p-1 mr-2">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>
                    {typeof plan.tripCancellation === 'object' 
                      ? 'Cancelación con múltiples coberturas' 
                      : `Cancelación: ${plan.tripCancellation}`}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className={`rounded-full p-1 mr-2 ${plan.adventureActivities ? 'bg-green-50' : 'bg-gray-100'}`}>
                    {plan.adventureActivities 
                      ? <Check className="h-4 w-4 text-green-600" /> 
                      : <X className="h-4 w-4 text-gray-400" />
                    }
                  </div>
                  <span>Actividades de aventura</span>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-50 rounded-full p-1 mr-2">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>COVID-19 incluido</span>
                </div>
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
        ))}
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
                  <td key={plan.id} className="p-2 text-center border-b">
                    {formatCoverage(plan.medicalCoverage)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Emergencia dental</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {plan.dentalEmergency || plan.dentalExpenses || "No especificado"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Repatriación</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {plan.repatriation ? (
                      <div className="flex justify-center">
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                      </div>
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
                    {typeof plan.tripCancellation === 'object' 
                      ? 'Múltiples coberturas' 
                      : plan.tripCancellation}
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
                  <td key={plan.id} className="p-2 text-center border-b">
                    {typeof plan.baggageProtection === 'number' 
                      ? formatPrice(plan.baggageProtection) 
                      : plan.baggageProtection || "No especificado"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Demora de equipaje</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {typeof plan.baggageDelay === 'number'
                      ? formatPrice(plan.baggageDelay)
                      : plan.baggageDelay || "No especificado"}
                  </td>
                ))}
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
                    {plan.adventureActivities ? (
                      <div className="flex justify-center">
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                      </div>
                    ) : "No cubierto"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Cobertura COVID-19</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    {plan.covidCoverage ? (
                      <div className="flex justify-center">
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                      </div>
                    ) : "No cubierto"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border-b">Asistencia telefónica</td>
                {plans.map(plan => (
                  <td key={plan.id} className="p-2 text-center border-b">
                    <div className="flex justify-center">
                      <BadgeCheck className="h-5 w-5 text-green-600" />
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}