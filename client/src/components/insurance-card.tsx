import { InsurancePlan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Check, Shield, Clock, Star, Award, X, Heart, CreditCard, Activity, Briefcase, Umbrella } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface InsuranceCardProps {
  plan: InsurancePlan;
  isSelected: boolean;
  onToggleSelect: () => void;
  onSelectPlan: () => void;
}

export default function InsuranceCard({ plan, isSelected, onToggleSelect, onSelectPlan }: InsuranceCardProps) {
  const [liked, setLiked] = useState(false);
  
  // Format price as currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return "No incluido";
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper to determine if the plan is the best value
  const isBestValue = () => {
    return plan.name.includes("Premium") || 
           plan.name.includes("Elite") || 
           (plan.rating && parseFloat(plan.rating) >= 4.7);
  };

  // Helper to determine badge text
  const getBadgeText = () => {
    if (plan.rating && parseFloat(plan.rating) >= 4.7) return "Más valorado";
    if (plan.basePrice < 80) return "Económico";
    if (plan.medicalCoverage >= 300000) return "Mayor cobertura";
    return "";
  };

  // Get popular feature
  const getPopularFeature = () => {
    if (plan.adventureActivities) return "Actividades de aventura incluidas";
    if (plan.rentalCarCoverage) return "Cobertura de auto incluida";
    if (plan.tripCancellation.includes("100%")) return "100% de cancelación";
    return "";
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden transition-all duration-300 group", 
        isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
      )}
    >
      <div 
        className={cn(
          "briki-plan-card border rounded-2xl shadow-sm relative", 
          isSelected ? "ring-2 ring-primary border-transparent" : "border-gray-100"
        )}
      >
        {/* Like button - Moved to middle right instead of top right */}
        <button 
          className="absolute right-3 top-24 z-10 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors", 
              liked ? "fill-red-500 text-red-500" : "text-gray-400"
            )} 
          />
        </button>
        
        {/* Top badge - Moved down to avoid covering provider name */}
        {getBadgeText() && (
          <div className="absolute left-0 top-16 z-10">
            <Badge 
              className="rounded-r-xl rounded-l-none py-1 px-3 bg-primary text-white font-medium"
              variant="default"
            >
              {getBadgeText()}
            </Badge>
          </div>
        )}
        
        {/* Header section */}
        <div className="briki-plan-header border-b border-gray-100 pb-3 pt-4 px-4">
          <div className="briki-plan-provider">
            <div className={cn(
              "briki-plan-provider-logo shadow-sm",
              isSelected ? "bg-primary/20" : "bg-primary/10"
            )}>
              {plan.provider.includes("Mundial") ? <Shield className="h-5 w-5 text-primary" /> :
               plan.provider.includes("AXA") ? <Award className="h-5 w-5 text-primary" /> :
               plan.provider.includes("Assist") ? <Activity className="h-5 w-5 text-primary" /> :
               plan.provider.includes("Liberty") ? <Umbrella className="h-5 w-5 text-primary" /> :
               plan.provider.includes("GNP") ? <Shield className="h-5 w-5 text-primary" /> :
               plan.provider.includes("Allianz") ? <Shield className="h-5 w-5 text-primary" /> :
               plan.provider.includes("Mapfre") ? <Shield className="h-5 w-5 text-primary" /> :
               <Check className="h-5 w-5 text-primary" />}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="flex flex-col">
                <p className="briki-plan-type text-sm font-medium text-gray-600">{plan.provider}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm ml-0.5 text-gray-600">{plan.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="briki-plan-price text-2xl">{formatPrice(plan.basePrice)}</div>
            <div className="text-xs text-gray-500">por viaje</div>
          </div>
        </div>
        
        {/* Features */}
        <div className="py-3 px-4">
          {/* Popular feature highlight */}
          {getPopularFeature() && (
            <div className="mb-3 bg-blue-50 px-3 py-2 rounded-lg flex items-center">
              <Award className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-blue-700">{getPopularFeature()}</span>
            </div>
          )}
          
          <div className="briki-feature-list">
            <div className="briki-feature-item">
              <span className="briki-feature-item-check bg-green-50 p-1 rounded-full mr-2">
                <Check className="h-3 w-3 text-green-600" />
              </span>
              <span className="text-sm">Asistencia médica de {formatPrice(plan.medicalCoverage)}</span>
            </div>
            <div className="briki-feature-item">
              <span className="briki-feature-item-check bg-green-50 p-1 rounded-full mr-2">
                <Check className="h-3 w-3 text-green-600" />
              </span>
              <span className="text-sm">Cancelación: {plan.tripCancellation}</span>
            </div>
            <div className="briki-feature-item">
              <span className="briki-feature-item-check bg-green-50 p-1 rounded-full mr-2">
                <Check className="h-3 w-3 text-green-600" />
              </span>
              <span className="text-sm">Equipaje: {formatPrice(plan.baggageProtection)}</span>
            </div>
            
            {/* Extra features */}
            <div className="briki-feature-item">
              <span className={cn(
                "p-1 rounded-full mr-2",
                plan.emergencyEvacuation ? "bg-green-50" : "bg-gray-50"
              )}>
                {plan.emergencyEvacuation ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <X className="h-3 w-3 text-gray-400" />
                )}
              </span>
              <span className="text-sm">
                {plan.emergencyEvacuation 
                  ? `Evacuación: ${formatPrice(plan.emergencyEvacuation)}` 
                  : "Sin evacuación de emergencia"}
              </span>
            </div>
            
            <div className="briki-feature-item">
              <span className={cn(
                "p-1 rounded-full mr-2",
                plan.adventureActivities ? "bg-green-50" : "bg-gray-50"
              )}>
                {plan.adventureActivities ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <X className="h-3 w-3 text-gray-400" />
                )}
              </span>
              <span className="text-sm">Actividades de aventura</span>
            </div>
          </div>
        </div>
        
        {/* Reviews */}
        <div className="text-sm text-gray-500 pb-2 px-4">
          {plan.reviews} {plan.reviews === 1 ? 'opinión' : 'opiniones'}
        </div>
        
        {/* Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2 px-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-primary font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
            >
              {isSelected ? "Quitar selección" : "Comparar"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary h-8"
              onClick={(e) => {
                e.stopPropagation();
                // This would open a modal with more details
              }}
            >
              Ver detalles
            </Button>
          </div>
          
          <Button 
            onClick={onSelectPlan} 
            className="briki-button w-full"
            size="lg"
          >
            Seleccionar plan
          </Button>
        </div>
      </div>
    </div>
  );
}