import { InsurancePlan } from "../../../shared/schema";
import { useState } from "react";
import InsuranceCard from "./insurance-card";
import { CompareButton } from "./compare-button";
import { cn } from "../lib/utils";

interface PlanGridProps {
  plans: InsurancePlan[];
  onSelectPlan: (plan: InsurancePlan) => void;
  onComparePlans: (plans: InsurancePlan[]) => void;
  className?: string;
}

export function PlanGrid({ 
  plans, 
  onSelectPlan, 
  onComparePlans,
  className 
}: PlanGridProps) {
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay planes disponibles en este momento.</p>
      </div>
    );
  }

  const togglePlanSelection = (planId: number) => {
    setSelectedPlans(prev => {
      // Check if plan is already selected
      if (prev.includes(planId)) {
        // Remove from selection
        return prev.filter(id => id !== planId);
      } else {
        // Add to selection (limit to 3 plans)
        if (prev.length >= 3) {
          // If already 3 plans selected, remove the first one and add the new one
          return [...prev.slice(1), planId];
        } else {
          return [...prev, planId];
        }
      }
    });
  };

  const handleCompare = () => {
    const plansToCompare = plans.filter(plan => selectedPlans.includes(plan.id));
    onComparePlans(plansToCompare);
  };

  // Sort plans by rating (highest first)
  const sortedPlans = [...plans].sort((a, b) => {
    const ratingA = a.rating ? parseFloat(a.rating) : 0;
    const ratingB = b.rating ? parseFloat(b.rating) : 0;
    return ratingB - ratingA;
  });

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPlans.map(plan => (
          <InsuranceCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlans.includes(plan.id)}
            onToggleSelect={() => togglePlanSelection(plan.id)}
            onSelectPlan={() => onSelectPlan(plan)}
          />
        ))}
      </div>

      {/* Compare button that appears when plans are selected */}
      {selectedPlans.length > 0 && (
        <CompareButton 
          selectedCount={selectedPlans.length}
          onCompare={handleCompare}
        />
      )}
    </div>
  );
}