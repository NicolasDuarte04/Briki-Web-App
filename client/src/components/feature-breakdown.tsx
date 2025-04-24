import { InsurancePlan } from "@shared/schema";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Check, 
  X, 
  Activity, 
  Briefcase, 
  Heart, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  PhoneCall,
  Calendar,
  Car,
  Map
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FeatureBreakdownProps {
  plans: InsurancePlan[];
  activePlanId?: number;
  maxFeatures?: number;
  className?: string;
}

export function FeatureBreakdown({ 
  plans, 
  activePlanId, 
  maxFeatures = 3,
  className 
}: FeatureBreakdownProps) {
  if (!plans || plans.length === 0) return null;
  
  // Format price as currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return "No incluido";
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Find the active plan
  const activePlan = activePlanId ? plans.find(p => p.id === activePlanId) : plans[0];
  
  // Calculate max values for progress bars
  const maxMedical = Math.max(...plans.map(p => p.medicalCoverage));
  const maxBaggage = Math.max(...plans.map(p => p.baggageProtection));
  const maxEvacuation = Math.max(...plans.map(p => p.emergencyEvacuation ? p.emergencyEvacuation : 0));
  
  // Calculate percentage for progress bars
  const getPercentage = (value: number, max: number) => {
    return Math.round((value / max) * 100);
  };

  // Key features to display
  const keyFeatures = [
    {
      name: "Asistencia médica",
      icon: <Shield className="h-5 w-5 text-primary" />,
      getValue: (plan: InsurancePlan) => formatPrice(plan.medicalCoverage),
      getProgress: (plan: InsurancePlan) => getPercentage(plan.medicalCoverage, maxMedical),
      format: "currency",
      description: "Cobertura para gastos médicos durante el viaje"
    },
    {
      name: "Cancelación de viaje",
      icon: <Calendar className="h-5 w-5 text-primary" />,
      getValue: (plan: InsurancePlan) => plan.tripCancellation,
      format: "text",
      description: "Reembolso en caso de cancelación del viaje"
    },
    {
      name: "Protección de equipaje",
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      getValue: (plan: InsurancePlan) => formatPrice(plan.baggageProtection),
      getProgress: (plan: InsurancePlan) => getPercentage(plan.baggageProtection, maxBaggage),
      format: "currency",
      description: "Cobertura por pérdida o daño de equipaje"
    },
    {
      name: "Evacuación de emergencia",
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      getValue: (plan: InsurancePlan) => formatPrice(plan.emergencyEvacuation),
      getProgress: (plan: InsurancePlan) => plan.emergencyEvacuation !== null && plan.emergencyEvacuation !== undefined ? getPercentage(plan.emergencyEvacuation, maxEvacuation) : 0,
      format: "currency",
      description: "Transporte médico de emergencia"
    },
    {
      name: "Actividades de aventura",
      icon: <Activity className="h-5 w-5 text-primary" />,
      getValue: (plan: InsurancePlan) => plan.adventureActivities ? "Incluido" : "No incluido",
      format: "boolean",
      description: "Cobertura para deportes y actividades de aventura"
    },
    {
      name: "Cobertura de auto",
      icon: <Car className="h-5 w-5 text-primary" />,
      getValue: (plan: InsurancePlan) => plan.rentalCarCoverage ? formatPrice(plan.rentalCarCoverage) : "No incluido",
      format: "mixed",
      description: "Seguro para autos de alquiler"
    },
    {
      name: "Asistencia 24/7",
      icon: <PhoneCall className="h-5 w-5 text-primary" />,
      getValue: (plan: InsurancePlan) => "Incluido",
      format: "boolean",
      description: "Servicio de asistencia telefónica 24 horas"
    }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <ul className="space-y-5">
        {keyFeatures.slice(0, maxFeatures).map((feature, index) => (
          <li key={index} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {feature.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{feature.name}</h3>
                  <div className="text-right">
                    {feature.format === "boolean" ? (
                      <div className="flex items-center">
                        {feature.getValue(activePlan as InsurancePlan) === "Incluido" ? (
                          <>
                            <span className="h-5 w-5 rounded-full bg-green-50 inline-flex items-center justify-center mr-1">
                              <Check className="h-3 w-3 text-green-600" />
                            </span>
                            <span className="text-green-700 font-medium">Incluido</span>
                          </>
                        ) : (
                          <>
                            <span className="h-5 w-5 rounded-full bg-red-50 inline-flex items-center justify-center mr-1">
                              <X className="h-3 w-3 text-red-600" />
                            </span>
                            <span className="text-red-700 font-medium">No incluido</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {feature.getValue(activePlan as InsurancePlan)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Progress bar for numerical values */}
                {feature.getProgress && feature.format === "currency" && (
                  <div className="mt-2">
                    <Progress 
                      value={feature.getProgress(activePlan as InsurancePlan)} 
                      className="h-2 bg-gray-100" 
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>Cobertura</span>
                      <span>
                        {feature.getProgress(activePlan as InsurancePlan)}% del máximo
                      </span>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}